import React, { useState } from 'react';
import './SignUpForm.css'; // 스타일 공유

function SignUpModal({ isOpen, onClose, signUpData, handleChange, handleSubmit }) {
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState(false);

    // 비밀번호 확인 입력 핸들러
    const handleConfirmPasswordChange = (e) => {
        const { value } = e.target;
        setConfirmPassword(value);
        setPasswordMatchError(signUpData.password !== value);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (signUpData.password !== confirmPassword) {
            setPasswordMatchError(true);
            return;
        }
        handleSubmit(e); // 부모 컴포넌트에서 전달된 회원가입 처리 함수 호출
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <form className="sign-up-page" onSubmit={handleFormSubmit}>
                    <div className="login">
                        <div className="text--2">회원가입</div>
                        <div className="content">
                            <div className="inputs">
                                <div className="input1">
                                    <label className="text--3">이름</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="이름을 입력하세요."
                                        value={signUpData.name}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div className="input2">
                                    <label className="text--4">이메일</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="로그인에 사용할 이메일을 입력해 주세요."
                                        value={signUpData.email}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div className="input3">
                                    <label className="text--5">비밀번호</label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="8~16자의 영문 대소문자, 숫자, 특수문자만 가능합니다."
                                        value={signUpData.password}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div className="input3-1">
                                    <label className="text--6">비밀번호 확인</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="비밀번호를 다시 입력해 주세요."
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                        className="input-field"
                                        required
                                    />
                                    {passwordMatchError && (
                                        <span className="error-message">비밀번호가 일치하지 않습니다.</span>
                                    )}
                                </div>
                                <div className="input3-2">
                                    <label className="text--7">전화번호</label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        placeholder="연락 가능한 번호를 입력해 주세요."
                                        value={signUpData.phoneNumber}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text">
                        <input type="checkbox" className="checkbox" required />
                        <label className="text-------">
                            개인정보 보호정책 및 약관을 읽었으며 이에 동의합니다.
                        </label>
                    </div>
                    <div className="bottom">
                        <button type="submit" className="button">
                            <span className="text-">회원가입</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUpModal;
