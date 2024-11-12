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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

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

    // 특정 상담사에게 배정된 내담자 목록 조회
    @GetMapping("/assigned-clients")
    public ResponseDto<List<Client>> getClientsByLoggedInCounselor() {
        Long counselorId = getLoggedInCounselorId(); // 현재 로그인한 상담사의 ID를 가져옴
        return clientService.getClientsByCounselorId(counselorId);
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
    @PutMapping("/{id}")
    public ResponseDto<Client> updateClient(@PathVariable Long id, @RequestBody Client client) {
        return clientService.updateClient(id, client);
    }

    // 내담자 삭제
    @DeleteMapping("/{id}")
    public ResponseDto<?> deleteClient(@PathVariable Long id) {
        return clientService.deleteClient(id);
    }

    // 현재 로그인한 상담사의 ID를 반환하는 메서드
    public Long getLoggedInCounselorId() {
        // 현재 인증된 사용자의 정보를 가져옴
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("사용자가 인증되지 않았습니다.");
        }

        // Principal로부터 상담사 ID를 가져옴 (예: Username을 ID로 사용하는 경우)
        String counselorIdStr = authentication.getName(); // 예: counselorId를 사용자의 이름으로 저장한 경우
        return Long.parseLong(counselorIdStr); // Long 타입으로 변환하여 반환
    }
}
