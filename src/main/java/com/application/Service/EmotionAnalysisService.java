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
import com.application.Repository.ClientRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
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
    private final FlaskCommunicationService flaskCommunicationService;

    @Autowired
    public EmotionAnalysisService(
            EmotionAnalysisReportRepository emotionAnalysisReportRepository,
            EmotionMapRepository emotionMapRepository,
            SessionRepository sessionRepository,
            ClientRepository clientRepository,
            NaverCloudClient naverCloudClient,
            FlaskCommunicationService flaskCommunicationService
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
            File convFile = convertMultipartFileToFile(file);
            List<Map<String, String>> speakerSegments = naverCloudClient.soundToText(convFile);

            if (!convFile.delete()) {
                System.out.println("Failed to delete the temporary file");
            }

            if (speakerSegments == null || speakerSegments.isEmpty()) {
                return ResponseDto.setFailed("텍스트 변환에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
            }

            // 각 speaker segment의 텍스트를 하나의 문장으로 합침
            String transcript = speakerSegments.stream()
                    .map(segment -> segment.get("text"))
                    .collect(Collectors.joining(" "));

            String predictionResult = flaskCommunicationService.getPrediction(transcript);

            // JSON 문자열을 List<AIAnalysisResult>로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            List<AIAnalysisResult> analysisResults = objectMapper.readValue(
                    predictionResult, new TypeReference<List<AIAnalysisResult>>() {});

            saveAnalysisResults(clientId, analysisResults);

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

    // 감정 분석 결과를 List<AIAnalysisResult>로 받아서 저장하는 메서드
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

    public List<EmotionAnalysisReport> getEmotionReportsBySession(Long sessionId) {
        return emotionAnalysisReportRepository.findBySessionId(sessionId);
    }

    public List<EmotionMap> getEmotionSummaryByClient(Long clientId) {
        return emotionMapRepository.findByClient_Id(clientId);
    }
}
