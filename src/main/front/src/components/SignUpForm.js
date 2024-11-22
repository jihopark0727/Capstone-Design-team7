import React, { useState } from 'react';
import axios from 'axios';
import './SignUpForm.css'; // 스타일 공유

function SignUpForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
    });

    const [agreeToPolicy, setAgreeToPolicy] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [passwordMatchError, setPasswordMatchError] = useState(false);

    // 모달 열기/닫기
    const openModal = () => {
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden'; // 스크롤 비활성화
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto'; // 스크롤 활성화
    };

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
                closeModal(); // 회원가입 성공 시 모달 닫기
            }
        } catch (error) {
            console.error('Error response:', error.response);
            alert('회원가입에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    return (
        <div>
            {/* 회원가입 버튼 */}
            <button onClick={openModal} className="open-signup-button">
                회원가입
            </button>

        </div>
    );
}

export default SignUpForm;
