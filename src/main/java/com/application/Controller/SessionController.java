package com.application.Controller;

import com.application.Dto.AIAnalysisResult;
import com.application.Dto.ResponseDto;
import com.application.Entity.EmotionAnalysisReport;
import com.application.Entity.Session;
import com.application.Service.EmotionAnalysisService;
import com.application.Service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final SessionService sessionService;
    private final EmotionAnalysisService emotionAnalysisService;

    @Autowired
    public SessionController(SessionService sessionService, EmotionAnalysisService emotionAnalysisService) {
        this.sessionService = sessionService;
        this.emotionAnalysisService = emotionAnalysisService;
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

    // 특정 내담자의 모든 세션 조회
    @GetMapping("/client/{clientId}")
    public ResponseDto<List<Session>> getSessionsByClient(@PathVariable Long clientId) {
        return sessionService.getSessionsByClient(clientId);
    }

    // 녹음 파일 업로드 및 AI 분석 요청
    @PostMapping("/{clientId}/analyze-recording")
    public ResponseDto<String> analyzeRecording(
            @PathVariable Long clientId,
            @RequestParam("file") MultipartFile file) {
        return emotionAnalysisService.analyzeRecording(clientId, file);
    }

    // 세션 추가 및 파일 업로드
    @PostMapping("/{clientId}/upload")
    public ResponseDto<Session> addSessionWithRecording(
            @PathVariable Long clientId,
            @RequestParam("file") MultipartFile file) {
        return sessionService.addSessionWithRecording(clientId, file);
    }

    // 감정 분석 결과 저장 API
    @PostMapping("/{sessionId}/analyze")
    public ResponseDto<?> saveAnalysisResults(
            @PathVariable Long sessionId,
            @RequestBody List<AIAnalysisResult> analysisResults) {
        emotionAnalysisService.saveAnalysisResults(sessionId, analysisResults);
        return ResponseDto.setSuccess("감정 분석 결과가 성공적으로 저장되었습니다.", HttpStatus.CREATED);
    }

    // 특정 세션의 감정 분석 결과 조회
    @GetMapping("/{sessionId}/analysis")
    public ResponseDto<List<EmotionAnalysisReport>> getEmotionReportsBySession(@PathVariable Long sessionId) {
        return emotionAnalysisService.getEmotionReportsBySession(sessionId);
    }

    // 세션 삭제
    @DeleteMapping("/{id}")
    public ResponseDto<?> deleteSession(@PathVariable Long id) {
        return sessionService.deleteSession(id);
    }
}
