import React, { useState } from 'react';
import axios from 'axios';
import './SignUpForm.css';

function SignUpForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phoneNumber: '',
    });

    const [agreeToPolicy, setAgreeToPolicy] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden'; // 스크롤 비활성화
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto'; // 스크롤 활성화
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = () => {
        setAgreeToPolicy(!agreeToPolicy);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!agreeToPolicy) {
            alert('개인정보 보호정책 및 약관에 동의해주세요.');
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
            <button onClick={openModal} className="open-signup-button">
                회원가입
            </button>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={closeModal}>
                            &times;
                        </button>
                        <form className="sign-up-page" onSubmit={handleSubmit}>
                            <div className="login">
                                <div className="text--2">회원가입</div>
                                <div className="content">
                                    <div className="inputs">
                                        <div className="input1">
                                            <label className="text--3">이름</label>
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
                                        <div className="input2">
                                            <label className="text--4">이메일</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="로그인에 사용할 이메일을 입력해 주세요."
                                                className="input-field"
                                                required
                                            />
                                        </div>
                                        <div className="input3">
                                            <label className="text--5">비밀번호</label>
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
                                        <div className="input3-1">
                                            <label className="text--6">전화번호</label>
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
                            <div className="text">
                                <input
                                    type="checkbox"
                                    className="checkbox"
                                    checked={agreeToPolicy}
                                    onChange={handleCheckboxChange}
                                />
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
            )}
        </div>
    );
}

export default SignUpForm;
