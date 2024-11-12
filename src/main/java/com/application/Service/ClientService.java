package com.application.Service;

import com.application.Dto.ResponseDto;
import com.application.Entity.Client;
import com.application.Entity.Counselor;
import com.application.Repository.ClientRepository;
import com.application.Repository.CounselorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientService {

    private final ClientRepository clientRepository;
    private final CounselorRepository counselorRepository;

    @Autowired
    public ClientService(ClientRepository clientRepository, CounselorRepository counselorRepository) {
        this.clientRepository = clientRepository;
        this.counselorRepository = counselorRepository;
    }

    public ResponseDto<Client> getClientById(Long id) {
        return clientRepository.findById(id)
                .map(client -> ResponseDto.setSuccessData("내담자 조회 성공", client, HttpStatus.OK))
                .orElse(ResponseDto.setFailed("내담자 ID가 존재하지 않습니다.", HttpStatus.NOT_FOUND));
    }

    public ResponseDto<Client> addClient(Client client) {
        // 현재 로그인된 상담사의 정보를 가져옴
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loggedInCounselorEmail = authentication.getName();

        // 로그인된 상담사의 정보를 데이터베이스에서 조회
        Counselor counselor = counselorRepository.findByEmail(loggedInCounselorEmail)
                .orElseThrow(() -> new RuntimeException("상담사 정보를 찾을 수 없습니다."));

        // 내담자와 상담사 간의 관계 설정
        client.getCounselors().add(counselor); // 상담사와의 매핑 추가
        clientRepository.save(client);

        return ResponseDto.setSuccessData("내담자 추가 성공", client, HttpStatus.CREATED);
    }

    public ResponseDto<Client> updateClient(Long id, Client updatedClient) {
        return clientRepository.findById(id)
                .map(client -> {
                    client.setName(updatedClient.getName());
                    client.setAge(updatedClient.getAge());
                    client.setGender(updatedClient.getGender());
                    clientRepository.save(client);
                    return ResponseDto.setSuccessData("내담자 정보 수정 성공", client, HttpStatus.OK);
                })
                .orElse(ResponseDto.setFailed("내담자 ID가 존재하지 않습니다.", HttpStatus.NOT_FOUND));
    }

    public ResponseDto<?> deleteClient(Long id) {
        if (clientRepository.existsById(id)) {
            clientRepository.deleteById(id);
            return ResponseDto.setSuccess("내담자 삭제 성공", HttpStatus.OK);
        } else {
            return ResponseDto.setFailed("내담자 ID가 존재하지 않습니다.", HttpStatus.NOT_FOUND);
        }
    }

    // 로그인된 상담사에게 배정된 내담자 목록을 조회하는 메서드
    public ResponseDto<List<Client>> getClientsByLoggedInCounselor() {
        // 현재 로그인된 상담사의 이메일을 가져옴
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loggedInCounselorEmail = authentication.getName();

        // 이메일을 통해 상담사 정보를 조회
        Counselor counselor = counselorRepository.findByEmail(loggedInCounselorEmail)
                .orElseThrow(() -> new RuntimeException("상담사 정보를 찾을 수 없습니다."));

        // 상담사 ID를 통해 배정된 내담자 목록을 조회
        List<Client> clients = clientRepository.findByCounselors_Id(counselor.getId());
        return ResponseDto.setSuccessData("상담사의 내담자 조회 성공", clients, HttpStatus.OK);
    }
}
