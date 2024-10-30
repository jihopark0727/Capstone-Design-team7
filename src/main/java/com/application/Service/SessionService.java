package com.application.Service;

import com.application.Dto.ResponseDto;
import com.application.Entity.Session;
import com.application.Repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SessionService {

    private final SessionRepository sessionRepository;

    @Autowired
    public SessionService(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    // 모든 세션 조회
    public ResponseDto<List<Session>> getAllSessions() {
        List<Session> sessions = sessionRepository.findAll();
        return ResponseDto.setSuccessData("모든 세션 조회 성공", sessions, HttpStatus.OK);
    }

    // 특정 세션 조회
    public ResponseDto<Session> getSessionById(Long id) {
        return sessionRepository.findById(id)
                .map(session -> ResponseDto.setSuccessData("세션 조회 성공", session, HttpStatus.OK))
                .orElse(ResponseDto.setFailed("세션 ID가 존재하지 않습니다.", HttpStatus.NOT_FOUND));
    }

    // 세션 추가
    public ResponseDto<Session> addSession(Session session) {
        Session savedSession = sessionRepository.save(session);
        return ResponseDto.setSuccessData("세션 추가 성공", savedSession, HttpStatus.CREATED);
    }

    // 세션 삭제
    public ResponseDto<?> deleteSession(Long id) {
        if (sessionRepository.existsById(id)) {
            sessionRepository.deleteById(id);
            return ResponseDto.setSuccess("세션 삭제 성공", HttpStatus.OK);
        } else {
            return ResponseDto.setFailed("세션 ID가 존재하지 않습니다.", HttpStatus.NOT_FOUND);
        }
    }
}
