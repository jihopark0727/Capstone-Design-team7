package com.application.Controller;

import com.application.Dto.ResponseDto;
import com.application.Entity.Client;
import com.application.Entity.EmotionMap;
import com.application.Entity.Session;
import com.application.Service.ClientService;
import com.application.Service.EmotionAnalysisService;
import com.application.Service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseDto<List<Client>> getClientsByLoggedInCounselor() {
        // ClientService에서 로그인된 상담사에 대한 내담자 목록을 가져옴
        return clientService.getClientsByLoggedInCounselor();
    }

    // 특정 내담자 조회
    @GetMapping("/{id}")
    public ResponseDto<Client> getClientById(@PathVariable Long id) {
        return clientService.getClientById(id);
    }

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
    public ResponseDto<Client> addClient(@RequestBody Client client) {
        return clientService.addClient(client);
    }

    // 내담자 정보 수정
    @PutMapping("/{id}")
    public ResponseDto<Client> updateClient(@PathVariable Long id, @RequestBody Client client) {
        return clientService.updateClient(id, client);
    }

    // 내담자 삭제
    @DeleteMapping("/{id}")
    public ResponseDto<?> deleteClient(@PathVariable Long id) {
        return clientService.deleteClient(id);
    }
}
