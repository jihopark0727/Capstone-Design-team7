package com.application.Service;

import com.application.Dto.ResponseDto;
import com.application.Dto.AIAnalysisResult;
import com.application.Entity.Client;
import com.application.Entity.Session;
import com.application.Entity.SessionRecording;
import com.application.Repository.ClientRepository;
import com.application.Repository.SessionRepository;
import com.application.Repository.SessionRecordingRepository;
import com.application.Repository.EmotionAnalysisReportRepository;
import com.application.Entity.EmotionAnalysisReport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.sql.Timestamp;
import java.util.stream.Collectors;

@Service
public class SessionService {

    private final SessionRepository sessionRepository;
    private final ClientRepository clientRepository;
    private final SessionRecordingRepository sessionRecordingRepository;
    private final EmotionAnalysisService emotionAnalysisService; // EmotionAnalysisService 주입

    private static final String UPLOAD_DIRECTORY = "uploads/";

    @Autowired
    public SessionService(SessionRepository sessionRepository, ClientRepository clientRepository,
                          SessionRecordingRepository sessionRecordingRepository, EmotionAnalysisService emotionAnalysisService) {
        this.sessionRepository = sessionRepository;
        this.clientRepository = clientRepository;
        this.sessionRecordingRepository = sessionRecordingRepository;
        this.emotionAnalysisService = emotionAnalysisService; // 주입
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

    // 특정 Client ID에 대한 모든 세션 조회
    public ResponseDto<List<Session>> getSessionsByClient(Long clientId) {
        List<Session> sessions = sessionRepository.findByClientId(clientId);
        if (sessions.isEmpty()) {
            return ResponseDto.setFailed("해당 내담자에 대한 세션이 존재하지 않습니다.", HttpStatus.NOT_FOUND);
        }
        return ResponseDto.setSuccessData("해당 내담자의 모든 세션 조회 성공", sessions, HttpStatus.OK);
    }

    // 세션 추가 및 파일 업로드
    public ResponseDto<Session> addSessionWithRecording(Long clientId, MultipartFile file) {
        try {
            // 파일 저장 경로 설정
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIRECTORY + filename);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, file.getBytes());

            // clientId로 Client 객체를 조회
            Client client = clientRepository.findById(clientId)
                    .orElseThrow(() -> new IllegalArgumentException("해당 Client ID가 존재하지 않습니다."));

            // 세션 생성 및 Client 설정
            Session session = new Session();
            session.setClient(client);
            Session savedSession = sessionRepository.save(session);

            // SessionRecording 생성 및 파일 정보 설정
            SessionRecording sessionRecording = new SessionRecording();
            sessionRecording.setSession(savedSession);
            sessionRecording.setFilePath(filePath.toString());
            sessionRecording.setFileSize(file.getSize());
            sessionRecording.setFileType(file.getContentType());
            sessionRecordingRepository.save(sessionRecording);

            // AI 감정 분석 수행
            List<AIAnalysisResult> analysisResults = emotionAnalysisService.analyze(filePath.toString());
            emotionAnalysisService.saveAnalysisResults(savedSession.getId(), analysisResults); // sessionId로 결과 저장

            return ResponseDto.setSuccessData("세션과 녹음 파일이 성공적으로 추가되었습니다.", savedSession, HttpStatus.CREATED);
        } catch (IOException e) {
            return ResponseDto.setFailed("파일 저장 중 오류가 발생했습니다: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return ResponseDto.setFailed("감정 분석 중 오류가 발생했습니다: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // 세션 추가 (파일 없이)
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
