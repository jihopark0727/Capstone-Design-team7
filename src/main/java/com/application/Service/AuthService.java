// AuthService.java
package com.application.Service;

import com.application.Dto.CounselorDto;
import com.application.Dto.LoginResponseDto;
import com.application.Dto.ResponseDto;
import com.application.Dto.SignUpDto;
import com.application.Dto.LoginDto;
import com.application.Entity.Counselor;
import com.application.Security.TokenProvider;
import com.application.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, TokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    // 회원가입
    public ResponseDto<?> signUp(SignUpDto dto) {
        String email = dto.getEmail();

        // 이메일 중복 확인
        if (userRepository.existsByEmail(email)) {
            return ResponseDto.setFailed("중복된 Email 입니다.", HttpStatus.BAD_REQUEST);
			// 시간이 되신다면 나~~중에 에러 응답을 직접 내려주는게 아니라 throw만 하고 별도의 에러 핸들러를 정의하셔서
			// 거기서 처리를 하시는 게 좋을거 같아요. 현재는 콘솔에 5xx번대 에러는 그대로 출력이 되면 좋긴 한데
			// 4xx 번대 오류는 사용자의 오류니 굳이 콘솔에 출력할 필요도 없을 거 같고요. 이런 처리를 모아서 하면 좋을 거 같아요
        }

        // 비밀번호 암호화
        String hashedPassword = passwordEncoder.encode(dto.getPassword());

        // Counselor 엔티티 생성 및 저장
        Counselor counselor = Counselor.builder()
                .email(email)
                .password(hashedPassword)
                .name(dto.getName())
                .phoneNumber(dto.getPhoneNumber())
                .build();

        try {
            userRepository.save(counselor);
        } catch (Exception e) {
            return ResponseDto.setFailed("데이터베이스 연결에 실패하였습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return ResponseDto.setSuccess("상담사 회원 생성에 성공했습니다.", HttpStatus.CREATED);
    }

    // 상담사 로그인
    public ResponseDto<LoginResponseDto> login(LoginDto dto) {
        String email = dto.getEmail();
        String password = dto.getPassword();

        Optional<Counselor> counselorOpt = userRepository.findByEmail(email);
        if (counselorOpt.isEmpty()) {
            return ResponseDto.setFailed("입력하신 이메일로 등록된 상담사 계정이 존재하지 않습니다.", HttpStatus.NOT_FOUND);
        }

        Counselor counselor = counselorOpt.get();

        // 비밀번호 검증
        if (!passwordEncoder.matches(password, counselor.getPassword())) {
            return ResponseDto.setFailed("비밀번호가 일치하지 않습니다.", HttpStatus.UNAUTHORIZED);
        }

        // JWT 토큰 생성
        int exprTime = 3600; // 1시간 유효
        String token = tokenProvider.createJwt(email, exprTime);
        if (token == null) {
            return ResponseDto.setFailed("토큰 생성에 실패하였습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // CounselorDto 객체로 변환
        CounselorDto counselorDto = new CounselorDto(
                counselor.getId(),
                counselor.getEmail(),
                counselor.getName(),
                counselor.getPhoneNumber()
        );

        // 로그인 응답 생성
        LoginResponseDto loginResponseDto = new LoginResponseDto(token, exprTime, counselorDto);
        return ResponseDto.setSuccessData("상담사 로그인에 성공하였습니다.", loginResponseDto, HttpStatus.OK);
    }
}
