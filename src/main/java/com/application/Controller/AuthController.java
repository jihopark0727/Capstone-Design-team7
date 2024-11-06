package com.application.Controller;

import com.application.Dto.ResponseDto;
import com.application.Dto.SignUpDto;
import com.application.Dto.LoginDto;
import com.application.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	// @Autowired 대신 생성자 주입 방식을 추천드려요
    @Autowired AuthService authService;

    @PostMapping("/signUp")
    public ResponseDto<?> signUp(@RequestBody SignUpDto requestBody) {
		// D 보다는 T 을 이용하면 정확히 어떤 객체가 반환되는 지 정확히 추론할 수 있을 거 같아요
		// 현재 선언문 만으로는 어떤 응답이 내려갈 지 확인이 어려워서 Swagger 같은 문서화 라이브러리 사용할 때도 조금 어려워질 수 있어요
        ResponseDto<?> result = authService.signUp(requestBody);
        return result;
    }

    @PostMapping("/login")
    public ResponseDto<?> login(@RequestBody LoginDto requestBody) {
        ResponseDto<?> result = authService.login(requestBody);
        return result;
    }
}