package com.application.Controller;

import com.application.Dto.ResponseDto;
import com.application.Entity.Session;
import com.application.Service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final SessionService sessionService;

    @Autowired
    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    // 모든 세션 조회
    @GetMapping
    public ResponseDto<List<Session>> getAllSessions() {
        return sessionService.getAllSessions();
    }

    // 특정 세션 조회
    @GetMapping("/{id}")
    public ResponseDto<Session> getSessionById(@PathVariable Long id) {
        return sessionService.getSessionById(id);
    }

    // 세션 추가
    @PostMapping
    public ResponseDto<Session> addSession(@RequestBody Session session) {
        return sessionService.addSession(session);
    }

    // 세션 삭제
    @DeleteMapping("/{id}")
    public ResponseDto<?> deleteSession(@PathVariable Long id) {
        return sessionService.deleteSession(id);
    }
}
