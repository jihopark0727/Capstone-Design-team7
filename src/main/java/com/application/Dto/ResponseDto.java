package com.application.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor(staticName = "set")
public class ResponseDto<D> {

    private boolean result;        // 요청 성공 여부
    private String message;        // 응답 메시지
    private D data;                // 응답 데이터
    private int statusCode;        // HTTP 상태 코드

    // 요청이 성공했을 때 메시지와 상태 코드만 반환
    public static <D> ResponseDto<D> setSuccess(String message, HttpStatus status) {
        return ResponseDto.set(true, message, null, status.value());
    }

    // 요청이 실패했을 때 메시지와 상태 코드만 반환
    public static <D> ResponseDto<D> setFailed(String message, HttpStatus status) {
        return ResponseDto.set(false, message, null, status.value());
    }

    // 요청이 성공했을 때 메시지, 데이터, 상태 코드 반환
    public static <D> ResponseDto<D> setSuccessData(String message, D data, HttpStatus status) {
        return ResponseDto.set(true, message, data, status.value());
    }

    // 요청이 실패했을 때 메시지, 데이터, 상태 코드 반환
    public static <D> ResponseDto<D> setFailedData(String message, D data, HttpStatus status) {
        return ResponseDto.set(false, message, data, status.value());
    }

    // 요청이 성공했을 때 데이터와 상태 코드만 반환
    public static <D> ResponseDto<D> setSuccessData(D data, HttpStatus status) {
        return ResponseDto.set(true, null, data, status.value());
    }
}
