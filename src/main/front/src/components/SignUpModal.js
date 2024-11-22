import React, { useState } from 'react';
import axios from 'axios';
import './SignUpForm.css'; // 스타일 공유

function SignUpModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
    });
    const [agreeToPolicy, setAgreeToPolicy] = useState(false);
    const [passwordMatchError, setPasswordMatchError] = useState(false);

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // 비밀번호 확인 에러 체크
        if (name === 'confirmPassword') {
            setPasswordMatchError(formData.password !== value);
        } else if (name === 'password') {
            setPasswordMatchError(formData.confirmPassword !== value);
        }
    };

    // 약관 동의 체크박스
    const handleCheckboxChange = () => {
        setAgreeToPolicy(!agreeToPolicy);
    };

    // 회원가입 처리
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!agreeToPolicy) {
            alert('개인정보 보호정책 및 약관에 동의해주세요.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setPasswordMatchError(true);
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/signUp', formData);
            if (response.status === 201 || response.status === 200) {
                alert('회원가입이 완료되었습니다.');
                onClose(); // 회원가입 성공 시 모달 닫기
            }
        } catch (error) {
            console.error('Error response:', error.response);
            alert('회원가입에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <form className="sign-up-page" onSubmit={handleSubmit}>
                    <div className="sign-up">
                        <h2>회원가입</h2>
                        <div className="content">
                            <div className="inputs">
                                {/* 이름 */}

                                <div className="input1">
                                    <label className="sign-up-text">이름</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="이름을 입력하세요."
                                        className="input-field"
                                        required
                                    />
                                </div>
                                {/* 이메일 */}
                                <div className="input2">
                                    <label className="sign-up-text">이메일</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="이메일을 입력해 주세요."
                                        className="input-field"
                                        required
                                    />
                                </div>
                                {/* 비밀번호 */}
                                <div className="input3">
                                    <label className="sign-up-text">비밀번호</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="8~16자의 영문 대소문자, 숫자, 특수문자만 가능합니다."
                                        className="input-field"
                                        required
                                    />
                                </div>
                                {/* 비밀번호 확인 */}
                                <div className="input4">
                                    <label className="sign-up-text">비밀번호 확인</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="비밀번호를 다시 입력해 주세요."
                                        className="input-field"
                                        required
                                    />
                                    {passwordMatchError && (
                                        <span className="error-message">비밀번호가 일치하지 않습니다.</span>
                                    )}
                                </div>
                                {/* 전화번호 */}
                                <div className="input5">
                                    <label className="sign-up-text">전화번호</label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        placeholder="연락 가능한 번호를 입력해 주세요."
                                        className="input-field"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 약관 동의 */}
                    <div className="text">
                        <input
                            type="checkbox"
                            className="checkbox"
                            checked={agreeToPolicy}
                            onChange={handleCheckboxChange}
                            required
                        />
                        <label className="text-------">
                            개인정보 보호정책 및 약관을 읽었으며 이에 동의합니다.
                        </label>
                    </div>
                    {/* 회원가입 버튼 */}
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
