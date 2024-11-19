package com.application.Service;

import com.application.Dto.ResponseDto;
import com.application.Entity.Client;
import com.application.Entity.CounselingTopic;
import com.application.Entity.Counselor;
import com.application.Repository.ClientRepository;
import com.application.Repository.CounselorRepository;
import com.application.Repository.CounselingTopicRepository;
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
    private final CounselingTopicRepository counselingTopicRepository;

    @Autowired
    public ClientService(ClientRepository clientRepository,
                         CounselorRepository counselorRepository,
                         CounselingTopicRepository counselingTopicRepository) {
        this.clientRepository = clientRepository;
        this.counselorRepository = counselorRepository;
        this.counselingTopicRepository = counselingTopicRepository;
    }

    public ResponseDto<Client> getClientById(Long id) {
        return clientRepository.findById(id)
                .map(client -> ResponseDto.setSuccessData("내담자 조회 성공", client, HttpStatus.OK))
                .orElse(ResponseDto.setFailed("내담자 ID가 존재하지 않습니다.", HttpStatus.NOT_FOUND));
    }

    public ResponseDto<Client> addClient(Client client, List<String> topicNames) {
        // 현재 로그인된 상담사의 정보를 가져옴
        Counselor counselor = getLoggedInCounselor();

        // 내담자와 상담사 간의 관계 설정
        if (client.getCounselors() == null) {
            client.setCounselors(new HashSet<>());
        }
        client.getCounselors().add(counselor);

        // 상담 주제 설정
        Set<CounselingTopic> topics = topicNames.stream()
                .map(this::getOrCreateTopic)
                .collect(Collectors.toSet());

        // 내담자와 상담 주제 연결
        if (client.getCounselingTopics() == null) {
            client.setCounselingTopics(new HashSet<>());
        }
        client.getCounselingTopics().addAll(topics);

        logger.info("Adding client with details: {}", client);

        // DB에 내담자 저장
        clientRepository.save(client);

        return ResponseDto.setSuccessData("내담자 추가 성공", client, HttpStatus.CREATED);
    }

    public ResponseDto<Client> updateClient(Long id, Client updatedClient, List<String> topicNames) {
        return clientRepository.findById(id)
                .map(client -> {
                    // 내담자 정보 업데이트
                    client.setName(updatedClient.getName());
                    client.setAge(updatedClient.getAge());
                    client.setGender(updatedClient.getGender());
                    client.setContactNumber(updatedClient.getContactNumber());
                    client.setBirthDate(updatedClient.getBirthDate());

                    // 상담 주제 업데이트
                    Set<CounselingTopic> topics = topicNames.stream()
                            .map(this::getOrCreateTopic)
                            .collect(Collectors.toSet());
                    client.setCounselingTopics(topics);

                    logger.info("Updating client with details: {}", client);

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

    public ResponseDto<List<Client>> getClientsByLoggedInCounselor() {
        // 현재 로그인된 상담사 정보 가져오기
        Counselor counselor = getLoggedInCounselor();

        // 상담사 ID를 통해 배정된 내담자 목록 조회
        List<Client> clients = clientRepository.findByCounselorsId(counselor.getId());
        return ResponseDto.setSuccessData("상담사의 내담자 조회 성공", clients, HttpStatus.OK);
    }

    // 주제를 가져오거나 새로 생성하는 메서드
    private CounselingTopic getOrCreateTopic(String topicName) {
        return counselingTopicRepository.findByTopicName(topicName)
                .orElseGet(() -> {
                    CounselingTopic newTopic = new CounselingTopic();
                    newTopic.setTopicName(topicName);
                    return counselingTopicRepository.save(newTopic);
                });
    }

    // 현재 로그인된 상담사 정보 가져오기
    private Counselor getLoggedInCounselor() {
        String loggedInCounselorEmail = getCurrentUserEmail();
        return counselorRepository.findByEmail(loggedInCounselorEmail)
                .orElseThrow(() -> new RuntimeException("상담사 정보를 찾을 수 없습니다."));
    }

    // 현재 로그인된 사용자의 이메일을 가져오는 메서드
    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("인증된 사용자가 아닙니다.");
        }
        return authentication.getName();
    }
}
