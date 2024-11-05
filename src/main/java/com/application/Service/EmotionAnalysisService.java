package com.application.Service;

import com.application.Client.NaverCloudClient;
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
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class EmotionAnalysisService {
    private final EmotionAnalysisReportRepository emotionAnalysisReportRepository;
    private final EmotionMapRepository emotionMapRepository;
    private final SessionRepository sessionRepository;
    private final ClientRepository clientRepository;
    private final NaverCloudClient naverCloudClient;
    private final FlaskCommunicationService flaskCommunicationService; // FlaskCommunicationService 주입

    @Autowired
    public EmotionAnalysisService(
            EmotionAnalysisReportRepository emotionAnalysisReportRepository,
            EmotionMapRepository emotionMapRepository,
            SessionRepository sessionRepository,
            ClientRepository clientRepository,
            NaverCloudClient naverCloudClient,
            FlaskCommunicationService flaskCommunicationService  // 주입
    ) {
        this.emotionAnalysisReportRepository = emotionAnalysisReportRepository;
        this.emotionMapRepository = emotionMapRepository;
        this.sessionRepository = sessionRepository;
        this.clientRepository = clientRepository;
        this.naverCloudClient = naverCloudClient;
        this.flaskCommunicationService = flaskCommunicationService;
    }

    public ResponseDto<String> analyzeRecording(Long clientId, MultipartFile file) {
        try {
            // MultipartFile을 File로 변환
            File convFile = convertMultipartFileToFile(file);

            // NaverCloudClient를 통해 파일을 텍스트로 변환
            String transcript = naverCloudClient.soundToText(convFile);

            // 변환이 완료되면 임시 파일 삭제
            if (!convFile.delete()) {
                System.out.println("Failed to delete the temporary file");
            }

            if (transcript == null) {
                return ResponseDto.setFailed("텍스트 변환에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
            }

            // 로컬 AI 모델에 텍스트 전달 및 감정 분석 수행
            String predictionResult = flaskCommunicationService.getPrediction(transcript);

            // 예측 결과 저장
            saveAnalysisResults(clientId, predictionResult);

            return ResponseDto.setSuccessData("AI 분석 완료", predictionResult, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseDto.setFailed("파일 처리 중 오류가 발생했습니다: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.setFailed("녹음 분석 중 오류가 발생했습니다: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private File convertMultipartFileToFile(MultipartFile file) throws IOException {
        File convFile = File.createTempFile("upload_", Objects.requireNonNull(file.getOriginalFilename()));
        try (FileOutputStream fos = new FileOutputStream(convFile)) {
            fos.write(file.getBytes());
        }
        return convFile;
    }

    public void saveAnalysisResults(Long sessionId, String predictionResult) {
        // 로컬 AI의 예측 결과를 분석 보고서에 저장하는 로직 (여기서는 간단히 결과를 저장하는 예시로 작성)
        // AI 모델 결과의 감정 분석 요약을 EmotionMap으로 저장
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("해당 세션 ID가 존재하지 않습니다."));

        EmotionMap emotionMap = new EmotionMap();
        emotionMap.setClient(session.getClient());
        emotionMap.setAnalysisSummary(predictionResult);
        emotionMap.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        emotionMapRepository.save(emotionMap);
    }

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

    private String calculateDominantEmotion(List<EmotionAnalysisReport> reports) {
        Map<String, Long> emotionCount = reports.stream()
                .collect(Collectors.groupingBy(EmotionAnalysisReport::getDominantEmotion, Collectors.counting()));
        return emotionCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("None");
    }

    private String generateKeywordSummary(List<EmotionAnalysisReport> reports) {
        return reports.stream()
                .flatMap(report -> List.of(report.getKeywords().split(",")).stream())
                .collect(Collectors.groupingBy(keyword -> keyword, Collectors.counting()))
                .toString();
    }
}
