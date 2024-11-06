package com.application.Service;

import com.application.Dto.ResponseDto;
import com.application.Entity.Client;
import com.application.Repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    @Autowired
    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public ResponseDto<List<Client>> getAllClients() {
        List<Client> clients = clientRepository.findAll();
        return ResponseDto.setSuccessData("모든 내담자 조회 성공", clients, HttpStatus.OK);
    }

    public ResponseDto<Client> getClientById(Long id) {
        return clientRepository.findById(id)
                .map(client -> ResponseDto.setSuccessData("내담자 조회 성공", client, HttpStatus.OK))
                .orElse(ResponseDto.setFailed("내담자 ID가 존재하지 않습니다.", HttpStatus.NOT_FOUND));
    }

    public ResponseDto<Client> addClient(Client client) {
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
					// JPA에서는 dirty check를 해서 별도로 save를 안 해도 되지 않나요? 이러면 duplicated key 오류 발생할 거 같은데요
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
}
