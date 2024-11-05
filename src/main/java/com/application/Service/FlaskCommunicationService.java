package com.application.Service;

// FlaskCommunicationService.java
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;

@Service
public class FlaskCommunicationService {

    private final String FLASK_SERVER_URL = "http://localhost:5000/predict";

    public String getPrediction(String transcribedText) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");

        // JSON 형태의 요청 본문 생성
        String jsonBody = String.format("{\"text\": \"%s\"}", transcribedText);
        HttpEntity<String> request = new HttpEntity<>(jsonBody, headers);

        // Flask 서버로 요청 전송
        ResponseEntity<String> response = restTemplate.postForEntity(FLASK_SERVER_URL, request, String.class);
        return response.getBody();
    }
}
