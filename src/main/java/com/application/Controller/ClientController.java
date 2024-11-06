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
	// @RequiredArgsConstructor를 사용하시는 건 어떨까요?
	// @Autowired랑 생성자 주입 방식이 동시에 사용되는 건 좀 특이해 보이네요

    // 모든 내담자 조회
    @GetMapping
    public ResponseDto<List<Client>> getAllClients() {
        return clientService.getAllClients();
    }

    // 특정 내담자 조회
    @GetMapping("/{id}")
    public ResponseDto<Client> getClientById(@PathVariable Long id) {
        return clientService.getClientById(id);
    }

    @GetMapping("/{clientId}/summary")
    public ResponseDto<List<EmotionMap>> getEmotionSummaryByClient(@PathVariable Long clientId) {
        List<EmotionMap> emotionSummary = emotionAnalysisService.getEmotionSummaryByClient(clientId);
        return ResponseDto.setSuccessData(emotionSummary); // 혹은 적절한 성공 메시지와 데이터를 함께 반환
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
	// 이건 전체 업데이트를 발생시켜서 patch와 구분해서 사용하신거죠?
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
