package com.application.Service;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Service
public class FlaskCommunicationService {

    private final String FLASK_SERVER_URL = "http://localhost:5000/analyze";

    public String analyzeRecording(File file) throws IOException {
        // HTTP POST 요청 생성
        HttpPost post = new HttpPost(FLASK_SERVER_URL);

        // Multipart 데이터 생성 (녹음 파일 첨부)
        MultipartEntityBuilder builder = MultipartEntityBuilder.create();
        builder.addBinaryBody("file", file, ContentType.MULTIPART_FORM_DATA, file.getName());

        post.setEntity(builder.build());

        // HTTP 클라이언트를 사용해 요청 전송
        try (CloseableHttpClient client = HttpClients.createDefault();
             CloseableHttpResponse response = client.execute(post)) {

            // Flask 서버에서 받은 응답 반환
            return EntityUtils.toString(response.getEntity());
        }
    }
}
