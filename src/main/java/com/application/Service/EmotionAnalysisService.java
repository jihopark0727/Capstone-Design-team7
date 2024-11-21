package com.application.Service;

import com.application.Client.NaverCloudClient;
import com.application.Dto.AIAnalysisResult;
import com.application.Dto.ResponseDto;
import com.application.Entity.EmotionAnalysisReport;
import com.application.Entity.EmotionMap;
import com.application.Entity.Session;
import com.application.Repository.EmotionAnalysisReportRepository;
import com.application.Repository.EmotionMapRepository;
import com.application.Repository.SessionRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class EmotionAnalysisService {

    private final EmotionAnalysisReportRepository emotionAnalysisReportRepository;
    private final EmotionMapRepository emotionMapRepository;
    private final SessionRepository sessionRepository;
    private final NaverCloudClient naverCloudClient;
    private final FlaskCommunicationService flaskCommunicationService;

    @Autowired
    public EmotionAnalysisService(
            EmotionAnalysisReportRepository emotionAnalysisReportRepository,
            EmotionMapRepository emotionMapRepository,
            SessionRepository sessionRepository,
            NaverCloudClient naverCloudClient,
            FlaskCommunicationService flaskCommunicationService
    ) {
        this.emotionAnalysisReportRepository = emotionAnalysisReportRepository;
        this.emotionMapRepository = emotionMapRepository;
        this.sessionRepository = sessionRepository;
        this.naverCloudClient = naverCloudClient;
        this.flaskCommunicationService = flaskCommunicationService;
    }

    /**
     * 녹음 파일 분석
     *
     * @param clientId  클라이언트 ID
     * @param sessionNumber 세션 number
     * @param file      녹음 파일
     * @return 분석 결과
     */
    public ResponseDto<String> analyzeRecording(Long clientId, Integer sessionNumber, MultipartFile file) {
        try {
            // 1. 세션 검증
            Session session = sessionRepository.findByClientIdAndSessionNumber(clientId, sessionNumber)
                    .orElseThrow(() -> new IllegalArgumentException("해당 세션 번호가 존재하지 않습니다."));

            // 2. MultipartFile을 File로 변환
            File convertedFile = convertMultipartFileToFile(file);

            // 3. 로컬 AI 모델로 녹음 파일 전송 및 분석 수행
            String predictionResult = flaskCommunicationService.analyzeRecording(convertedFile);

            // 4. AI 분석 결과를 객체로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            List<AIAnalysisResult> analysisResults = objectMapper.readValue(
                    predictionResult, new TypeReference<List<AIAnalysisResult>>() {});

            // 5. 분석 결과 저장
            saveAnalysisResults(session.getId(), analysisResults);

            return ResponseDto.setSuccessData("AI 분석 완료", predictionResult, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.setFailed("녹음 분석 중 오류가 발생했습니다: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // MultipartFile을 File로 변환하는 메서드
    private File convertMultipartFileToFile(MultipartFile multipartFile) throws IOException {
        // 임시 파일로 저장
        File file = new File(multipartFile.getOriginalFilename());
        multipartFile.transferTo(file); // multipartFile의 내용을 file로 복사
        return file;
    }

    /**
     * 감정 분석 결과 저장
     *
     * @param sessionId      세션 ID
     * @param analysisResults 분석 결과
     */
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
    }

    /**
     * 세션의 감정 분석 결과 조회
     *
     * @param sessionId 세션 ID
     * @return 감정 분석 결과 목록
     */
    public List<EmotionAnalysisReport> getEmotionReportsBySession(Long sessionId) {
        return emotionAnalysisReportRepository.findBySessionId(sessionId);
    }

    /**
     * 클라이언트의 감정 요약 데이터 조회
     *
     * @param clientId 클라이언트 ID
     * @return 감정 요약 데이터 목록
     */
    public List<EmotionMap> getEmotionSummaryByClient(Long clientId) {
        return emotionMapRepository.findByClient_Id(clientId);
    }
}
