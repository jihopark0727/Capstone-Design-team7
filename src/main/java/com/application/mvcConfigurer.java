package com.application;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class mvcConfigurer implements WebMvcConfigurer {
	// config 클래스들도 별도로 package를 만들어서 나누는게 좋을거 같아요

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("http://localhost:3000") // 허용할 Origin 명시
                .allowedMethods("GET", "POST", "PUT", "DELETE") // 허용할 HTTP 메서드 명시
                .allowedHeaders("*") // 모든 헤더 허용
                .allowCredentials(true); // 쿠키 허용 설정 (필요 시)
    }
}