package com.application.Service;

import com.application.Dto.ResponseDto;
import com.application.Dto.AIAnalysisResult;
import com.application.Entity.EmotionAnalysisReport;
import com.application.Entity.EmotionMap;
import com.application.Entity.Session;
import com.application.Entity.Client;
import com.application.Repository.EmotionAnalysisReportRepository;
import com.application.Repository.EmotionMapRepository;
import com.application.Repository.SessionRepository;
import com.application.Repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class EmotionAnalysisService {

    private final EmotionAnalysisReportRepository emotionAnalysisReportRepository;
    private final EmotionMapRepository emotionMapRepository;
    private final SessionRepository sessionRepository;
    private final ClientRepository clientRepository;

    @Autowired
    public EmotionAnalysisService(
            EmotionAnalysisReportRepository emotionAnalysisReportRepository,
            EmotionMapRepository emotionMapRepository,
            SessionRepository sessionRepository,
            ClientRepository clientRepository
    ) {
        this.emotionAnalysisReportRepository = emotionAnalysisReportRepository;
        this.emotionMapRepository = emotionMapRepository;
        this.sessionRepository = sessionRepository;
        this.clientRepository = clientRepository;
    }

    // 감정 분석 실행
    public List<AIAnalysisResult> analyze(String filePath) {
        // OpenAI Whisper API 호출하여 텍스트 변환
        String transcript = callWhisperApi(filePath);
        if (transcript == null) {
            throw new RuntimeException("Whisper API 호출 실패");
        }

        // Local AI 모델 호출하여 감정 분석 수행
        return callLocalAiModel(transcript);
    }

    // Whisper API 호출 메서드
    private String callWhisperApi(String filePath) {
        // Whisper API 호출 로직 구현
        return "변환된 텍스트"; // 임시 텍스트 반환
    }

    // Local AI 모델 호출
    private List<AIAnalysisResult> callLocalAiModel(String transcript) {
        // 로컬 AI 모델 호출 로직 구현
        return List.of(); // 임시 빈 결과 반환
    }

    // 감정 분석 결과 저장
    public void saveAnalysisResults(Long sessionId, List<AIAnalysisResult> analysisResults) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("해당 세션 ID가 존재하지 않습니다."));

        List<EmotionAnalysisReport> reports = analysisResults.stream().map(result -> {
            EmotionAnalysisReport report = new EmotionAnalysisReport();
            report.setSession(session);
            report.setSentenceNumber(result.getSentenceNumber());
            report.setSentenceText(result.getSentenceText());
            report.setDominantEmotion(result.getEmotion());
            report.setKeywords(result.getKeywords());
            report.setAnalyzedAt(new Timestamp(System.currentTimeMillis()));
            return report;
        }).collect(Collectors.toList());

        emotionAnalysisReportRepository.saveAll(reports);

        // 종합 감정 요약 저장
        saveEmotionMapSummary(session, reports);
    }

    // 특정 세션의 감정 분석 요약 저장
    private void saveEmotionMapSummary(Session session, List<EmotionAnalysisReport> reports) {
        String dominantEmotion = calculateDominantEmotion(reports);
        String keywordSummary = generateKeywordSummary(reports);

        EmotionMap emotionMap = new EmotionMap();
        emotionMap.setClient(session.getClient());
        emotionMap.setDominantEmotion(dominantEmotion);
        emotionMap.setKeywordSummary(keywordSummary);
        emotionMap.setAnalysisSummary("주요 감정: " + dominantEmotion + ", 키워드 요약: " + keywordSummary);
        emotionMap.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        emotionMapRepository.save(emotionMap);
    }

    // 특정 내담자의 종합 감정 정보 조회
    public ResponseDto<EmotionMap> getEmotionSummaryByClient(Long clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("해당 내담자 ID가 존재하지 않습니다."));

        EmotionMap emotionMap = emotionMapRepository.findByClient(client)
                .orElse(null);

        if (emotionMap != null) {
            return ResponseDto.setSuccessData("내담자의 종합 감정 정보 조회 성공", emotionMap, HttpStatus.OK);
        } else {
            return ResponseDto.setFailed("내담자의 종합 감정 정보가 존재하지 않습니다.", HttpStatus.NOT_FOUND);
        }
    }

    public ResponseDto<List<EmotionAnalysisReport>> getEmotionReportsBySession(Long sessionId) {
        // sessionId에 해당하는 EmotionAnalysisReport 목록을 조회
        List<EmotionAnalysisReport> reports = emotionAnalysisReportRepository.findBySessionId(sessionId);

        if (reports.isEmpty()) {
            return ResponseDto.setFailed("해당 세션 ID에 대한 분석 결과가 없습니다.", HttpStatus.NOT_FOUND);
        }

        return ResponseDto.setSuccessData("감정 분석 결과 조회 성공", reports, HttpStatus.OK);
    }

    // 주된 감정 계산
    private String calculateDominantEmotion(List<EmotionAnalysisReport> reports) {
        Map<String, Long> emotionCount = reports.stream()
                .collect(Collectors.groupingBy(EmotionAnalysisReport::getDominantEmotion, Collectors.counting()));
        return emotionCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("None");
    }

    // 키워드 요약 생성
    private String generateKeywordSummary(List<EmotionAnalysisReport> reports) {
        return reports.stream()
                .flatMap(report -> List.of(report.getKeywords().split(",")).stream())
                .collect(Collectors.groupingBy(keyword -> keyword, Collectors.counting()))
                .toString();
    }
}
