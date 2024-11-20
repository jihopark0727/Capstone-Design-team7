package com.application.Controller;

import com.application.Dto.ClientRequestDto;
import com.application.Dto.ResponseDto;
import com.application.Entity.Client;
import com.application.Entity.EmotionMap;
import com.application.Entity.Session;
import com.application.Service.ClientService;
import com.application.Service.EmotionAnalysisService;
import com.application.Service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;
    private final EmotionAnalysisService emotionAnalysisService;
    private final SessionService sessionService;

    @Autowired
    public ClientController(ClientService clientService, EmotionAnalysisService emotionAnalysisService, SessionService sessionService) {
        this.clientService = clientService;
        this.emotionAnalysisService = emotionAnalysisService;
        this.sessionService = sessionService;
    }

    // 로그인된 상담사에게 배정된 내담자 목록 조회
    @GetMapping("/assigned-clients")
    public ResponseDto<List<Map<String, Object>>> getClientsByLoggedInCounselor() {
        return clientService.getClientsByLoggedInCounselor();
    }

    // 로그인된 상담사에게 배정된 내담자 이름 목록 조회
    @GetMapping("/assigned-client-names")
    public ResponseDto<List<String>> getClientNamesByLoggedInCounselor() {
        return clientService.getClientNamesByLoggedInCounselor();
    }


    // 특정 내담자 조회
    @GetMapping("/{id}")
    public ResponseDto<Client> getClientById(@PathVariable Long id) {
        return clientService.getClientById(id);
    }

    // 특정 내담자의 감정 요약 조회
    @GetMapping("/{clientId}/summary")
    public ResponseDto<List<EmotionMap>> getEmotionSummaryByClient(@PathVariable Long clientId) {
        List<EmotionMap> emotionSummary = emotionAnalysisService.getEmotionSummaryByClient(clientId);
        return ResponseDto.setSuccessData(emotionSummary);
    }

    // 특정 내담자의 모든 세션 조회
    @GetMapping("/{clientId}/sessions")
    public ResponseDto<List<Session>> getSessionsByClient(@PathVariable Long clientId) {
        return sessionService.getSessionsByClient(clientId);
    }

    // 내담자 추가
    @PostMapping
    public ResponseDto<Client> addClient(@RequestBody ClientRequestDto clientRequestDto) {
        List<String> topicNames = clientRequestDto.getTopicList();

        Client client = new Client();
        client.setRegistrationStatus(clientRequestDto.getRegistrationStatus());
        client.setName(clientRequestDto.getName());
        client.setContactNumber(clientRequestDto.getContactNumber());
        client.setGender(clientRequestDto.getGender());
        client.setAge(clientRequestDto.getAge());
        client.setRegistrationDate(LocalDate.parse(clientRequestDto.getRegistrationDate()));

        return clientService.addClient(client, topicNames.toString());
    }



    // 내담자 정보 수정
    @PutMapping("/{id}")
    public ResponseDto<Client> updateClient(
            @PathVariable Long id,
            @RequestBody Client client,
            @RequestParam(required = false) String counselingTopics) {
        // 상담 주제를 콤마로 구분된 문자열에서 배열로 변환
        List<String> topics = List.of(counselingTopics.split(","));
        return clientService.updateClient(id, client, topics.toString());
    }

    // 내담자 삭제
    @DeleteMapping("/{id}")
    public ResponseDto<?> deleteClient(@PathVariable Long id) {
        return clientService.deleteClient(id);
    }
}
