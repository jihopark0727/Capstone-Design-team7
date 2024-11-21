package com.application.Service;

import com.application.Dto.ResponseDto;
import com.application.Entity.Client;
import com.application.Entity.Counselor;
import com.application.Entity.CounselorClient;
import com.application.Repository.ClientRepository;
import com.application.Repository.CounselorClientRepository;
import com.application.Repository.CounselorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ClientService {

    private static final Logger logger = LoggerFactory.getLogger(ClientService.class);

    private final ClientRepository clientRepository;
    private final CounselorRepository counselorRepository;
    private final CounselorClientRepository counselorClientRepository;

    @Autowired
    public ClientService(ClientRepository clientRepository,
                         CounselorRepository counselorRepository, CounselorClientRepository counselorClientRepository) {
        this.clientRepository = clientRepository;
        this.counselorRepository = counselorRepository;
        this.counselorClientRepository = counselorClientRepository;
    }

    public ResponseDto<Client> getClientById(Long id) {
        return clientRepository.findById(id)
                .map(client -> ResponseDto.setSuccessData("내담자 조회 성공", client, HttpStatus.OK))
                .orElse(ResponseDto.setFailed("내담자 ID가 존재하지 않습니다.", HttpStatus.NOT_FOUND));
    }

    public ResponseDto<Client> addClient(Client client, String topic) {
        // 현재 로그인된 상담사 정보 가져오기
        Counselor counselor = getLoggedInCounselor();

        // 내담자 저장
        Client savedClient = clientRepository.save(client);

        // 상담사-내담자 관계 설정 및 주제 저장
        CounselorClient counselorClient = CounselorClient.builder()
                .counselor(counselor)
                .client(savedClient)
                .topic(topic)
                .build();

        counselorClientRepository.save(counselorClient); // 새로운 테이블에 저장

        return ResponseDto.setSuccessData("내담자 추가 성공", savedClient, HttpStatus.CREATED);
    }


    public ResponseDto<Client> updateClient(Long clientId, Client updatedClient, String newTopic) {
        return clientRepository.findById(clientId)
                .map(client -> {
                    // 내담자 정보 업데이트
                    client.setName(updatedClient.getName());
                    client.setAge(updatedClient.getAge());
                    client.setGender(updatedClient.getGender());
                    client.setContactNumber(updatedClient.getContactNumber());
                    client.setBirthDate(updatedClient.getBirthDate());

                    clientRepository.save(client);

                    // 상담사-내담자 관계에서 주제 업데이트
                    Counselor counselor = getLoggedInCounselor();
                    CounselorClient counselorClient = counselorClientRepository
                            .findByCounselorAndClient(counselor, client)
                            .orElseThrow(() -> new RuntimeException("관계가 존재하지 않습니다."));
                    counselorClient.setTopic(newTopic);
                    counselorClientRepository.save(counselorClient);

                    return ResponseDto.setSuccessData("내담자 정보 및 주제 업데이트 성공", client, HttpStatus.OK);
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

    public ResponseDto<List<Map<String, Object>>> getClientsByLoggedInCounselor() {
        Counselor counselor = getLoggedInCounselor();

        logger.info("Logged-in counselor: {}", counselor);

        // 상담사-내담자 관계 조회
        List<CounselorClient> counselorClients = counselorClientRepository.findByCounselor(counselor);
        logger.info("Counselor clients found: {}", counselorClients);
        counselorClients.forEach(cc -> logger.info("Client: {}, Topic: {}", cc.getClient(), cc.getTopic()));

        // 필요한 데이터 변환 및 topic에서 [ ] 제거
        List<Map<String, Object>> result = counselorClients.stream()
                .map(cc -> Map.of(
                        "client", cc.getClient(),
                        "topic", removeBrackets(cc.getTopic()) // topic의 대괄호 제거
                ))
                .collect(Collectors.toList());

        return ResponseDto.setSuccessData("상담사의 내담자 조회 성공", result, HttpStatus.OK);
    }

    // Helper 메서드: 문자열에서 대괄호 제거
    private String removeBrackets(String topic) {
        if (topic == null || topic.isEmpty()) {
            return "N/A"; // topic이 없을 경우 기본값
        }
        return topic.replace("[", "").replace("]", ""); // 대괄호 제거
    }



    // 현재 로그인된 상담사 정보 가져오기
    public Counselor getLoggedInCounselor() {
        String loggedInCounselorEmail = getCurrentUserEmail();
        logger.info("email {}", loggedInCounselorEmail);
        return counselorRepository.findByEmail(loggedInCounselorEmail)
                .orElseThrow(() -> new RuntimeException("상담사 정보를 찾을 수 없습니다."));
    }

    // 현재 로그인된 사용자의 이메일을 가져오는 메서드
    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            logger.error("Authentication object is null or user is not authenticated");
            throw new RuntimeException("인증된 사용자가 아닙니다.");
        }

        logger.info("Authenticated user's email: {}", authentication.getName());
        return authentication.getName();
    }

    public ResponseDto<List<String>> getClientNamesByLoggedInCounselor() {
        Counselor counselor = getLoggedInCounselor();

        logger.info("Logged-in counselor: {}", counselor);

        // 상담사-내담자 관계 조회
        List<CounselorClient> counselorClients = counselorClientRepository.findByCounselor(counselor);
        logger.info("Counselor clients found: {}", counselorClients);
        counselorClients.forEach(cc -> logger.info("Client: {}, Topic: {}", cc.getClient(), cc.getTopic()));

        // 클라이언트 이름만 추출
        List<String> result = counselorClients.stream()
                .map(cc -> cc.getClient().getName()) // 클라이언트 이름만 추출
                .collect(Collectors.toList());

        return ResponseDto.setSuccessData("상담사의 내담자 이름 조회 성공", result, HttpStatus.OK);
    }


}
