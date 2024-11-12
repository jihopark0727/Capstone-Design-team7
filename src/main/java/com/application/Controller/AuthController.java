package com.application.Controller;

import com.application.Dto.LoginDto;
import com.application.Dto.ResponseDto;
import com.application.Dto.SignUpDto;
import com.application.Entity.Counselor;
import com.application.Service.AuthService;
import com.application.Repository.CounselorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private CounselorRepository counselorRepository;

    @PostMapping("/signUp")
    public ResponseDto<?> signUp(@RequestBody SignUpDto requestBody) {
        ResponseDto<?> result = authService.signUp(requestBody);
        return result;
    }

    @PostMapping("/login")
    public ResponseDto<?> login(@RequestBody LoginDto requestBody) {
        ResponseDto<?> result = authService.login(requestBody);
        return result;
    }

    // 현재 로그인된 상담사 정보를 반환하는 엔드포인트 추가
    @GetMapping("/me")
    public ResponseDto<Counselor> getLoggedInCounselor() {
        // 현재 인증된 사용자의 이메일을 가져옴
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loggedInCounselorEmail = authentication.getName();

        // 이메일로 상담사 정보 조회
        Optional<Counselor> counselorOpt = counselorRepository.findByEmail(loggedInCounselorEmail);
        Counselor counselor = counselorOpt.orElseThrow(() -> new RuntimeException("상담사 정보를 찾을 수 없습니다."));

        return ResponseDto.setSuccessData("로그인된 상담사 정보 조회 성공", counselor, HttpStatus.OK);
    }
}
