package com.application.Client;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.application.Dto.MediaTextResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.MediaType;
import reactor.core.publisher.Mono;

import java.io.File;
import java.nio.file.Files;

@Component
public class NaverCloudClient {
    private final ObjectMapper objectMapper;

    @Value("${naver.cloud.id}")
    private String CLIENT_ID;

    @Value("${naver.cloud.secret}")
    private String CLIENT_SECRET;

    private final WebClient webClient;

    public NaverCloudClient(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.webClient = WebClient.builder()
                .baseUrl("https://naveropenapi.apigw.ntruss.com")
                .build();
    }

    public String soundToText(File file) {
        try {
            // 파일을 바이트 배열로 읽어온 후 전송
            byte[] fileContent = Files.readAllBytes(file.toPath());
            String language = "Kor";

            Mono<String> responseMono = webClient.post()
                    .uri(uriBuilder -> uriBuilder.path("/recog/v1/stt")
                            .queryParam("lang", language)
                            .build())
                    .header("X-NCP-APIGW-API-KEY-ID", CLIENT_ID)
                    .header("X-NCP-APIGW-API-KEY", CLIENT_SECRET)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .bodyValue(fileContent)
                    .retrieve()
                    .bodyToMono(String.class)
                    .map(this::getTextFromResponse);

            return responseMono.block();
        } catch (Exception e) {
            System.out.println(e);
            return null;
        }
    }

    private String getTextFromResponse(String responseStr) {
        try {
            return objectMapper.readValue(responseStr, MediaTextResponse.class).getText();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
