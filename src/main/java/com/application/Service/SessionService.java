package com.application.Service;

import com.application.Dto.ResponseDto;
import com.application.Entity.Client;
import com.application.Entity.Session;
import com.application.Repository.ClientRepository;
import com.application.Repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class SessionService {

    private final SessionRepository sessionRepository;
    private final ClientRepository clientRepository;
    private final EmotionAnalysisService emotionAnalysisService;

    @Autowired
    public SessionService(SessionRepository sessionRepository, ClientRepository clientRepository,
                          EmotionAnalysisService emotionAnalysisService) {
        this.sessionRepository = sessionRepository;
        this.clientRepository = clientRepository;
        this.emotionAnalysisService = emotionAnalysisService;
    }

    /**
     * 세션 및 클라이언트 검증 후 감정 분석 요청
     *
     * @param clientId  클라이언트 ID
     * @param sessionNumber 세션 ID
     * @param file      녹음 파일
     * @return 감정 분석 결과
     */
    public ResponseDto<String> analyzeSessionRecording(Long clientId, Integer sessionNumber, MultipartFile file) {
        try {
            // 1. 세션 검증
            Session session = sessionRepository.findByClientIdAndSessionNumber(clientId, sessionNumber)
                    .orElseThrow(() -> new IllegalArgumentException("해당 세션 번호가 존재하지 않습니다."));

            if (!session.getClient().getId().equals(clientId)) {
                return ResponseDto.setFailed("세션이 해당 내담자와 연결되어 있지 않습니다.", HttpStatus.BAD_REQUEST);
            }

            // 2. 감정 분석 요청 (EmotionAnalysisService 호출)
            return emotionAnalysisService.analyzeRecording(clientId, sessionNumber, file);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.setFailed("녹음 분석 중 오류가 발생했습니다: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * 모든 세션 조회
     */
    public ResponseDto<List<Session>> getAllSessions() {
        List<Session> sessions = sessionRepository.findAll();
        return ResponseDto.setSuccessData("모든 세션 조회 성공", sessions, HttpStatus.OK);
    }

    /**
     * 특정 세션 조회
     */
    public ResponseDto<Session> getSessionById(Long id) {
        return sessionRepository.findById(id)
                .map(session -> ResponseDto.setSuccessData("세션 조회 성공", session, HttpStatus.OK))
                .orElse(ResponseDto.setFailed("세션 ID가 존재하지 않습니다.", HttpStatus.NOT_FOUND));
    }

    /**
     * 특정 클라이언트의 모든 세션 조회
     */
    public ResponseDto<List<Session>> getSessionsByClient(Long clientId) {
        List<Session> sessions = sessionRepository.findByClientId(clientId);
        if (sessions.isEmpty()) {
            return ResponseDto.setFailed("해당 내담자에 대한 세션이 존재하지 않습니다.", HttpStatus.NOT_FOUND);
        }
        return ResponseDto.setSuccessData("해당 내담자의 모든 세션 조회 성공", sessions, HttpStatus.OK);
    }

    /**
     * 세션 삭제
     */
    public ResponseDto<?> deleteSession(Long id) {
        if (sessionRepository.existsById(id)) {
            sessionRepository.deleteById(id);
            return ResponseDto.setSuccess("세션 삭제 성공", HttpStatus.OK);
        } else {
            return ResponseDto.setFailed("세션 ID가 존재하지 않습니다.", HttpStatus.NOT_FOUND);
        }
    }
}
