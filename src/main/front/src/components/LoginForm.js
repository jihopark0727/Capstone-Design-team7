import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css'; // 로그인 스타일
import './SignUpForm.css'; // 회원가입 스타일

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
    const [signUpData, setSignUpData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
    });
    const navigate = useNavigate();

    // 로그인 처리
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email,
                password,
            });

            if (response.data.result) {
                alert('상담사 로그인에 성공하였습니다.');

                // 토큰 저장
                const token = response.data.data.token;
                if (token) {
                    localStorage.setItem('token', token);
                    console.log('토큰이 localStorage에 저장되었습니다.');
                } else {
                    console.error('토큰이 응답에 포함되지 않았습니다.');
                }

                // FileUploadPage로 이동
                navigate('/upload');
            } else {
                alert('로그인에 실패했습니다. 다시 시도해 주세요.');
            }
        } catch (error) {
            console.error('로그인 오류:', error.response || error.message);
            if (error.response && error.response.status === 401) {
                alert('잘못된 이메일 또는 비밀번호입니다.');
            } else {
                alert('로그인에 실패했습니다. 다시 시도해 주세요.');
            }
        }
    };

    // 회원가입 처리
    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/signup', signUpData);
            if (response.data.result) {
                alert('회원가입이 완료되었습니다. 로그인해 주세요.');
                setIsModalOpen(false);
            } else {
                alert('회원가입에 실패했습니다. 다시 시도해 주세요.');
            }
        } catch (error) {
            console.error('회원가입 오류:', error.response || error.message);
            alert(error.response?.data?.message || '회원가입에 실패했습니다.');
        }
    };

    // 회원가입 폼 입력값 변경 처리
    const handleSignUpChange = (e) => {
        const { name, value } = e.target;
        setSignUpData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // 모달 열기/닫기
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div>
            {/* 로그인 폼 */}
            <form onSubmit={handleLogin} className="signup">
                <div className="signup-1">
                    <div className="inputs">
                        <div className="input">
                            <label htmlFor="email" className="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input-field"
                            />
                        </div>
                        <div className="input-1">
                            <label htmlFor="password" className="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="input-field"
                            />
                        </div>
                    </div>
                    <button type="submit" className="button">
                        <span className="text-">로그인</span>
                    </button>
                </div>
                <div className="others">
                    <button
                        type="button"
                        className="button-1"
                        onClick={openModal}
                    >
                        <span className="text--1">회원가입</span>
                    </button>
                </div>
            </form>

            {/* 회원가입 모달 */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={closeModal}>
                            &times;
                        </button>
                        <form className="sign-up-page" onSubmit={handleSignUp}>
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
                                                onChange={handleSignUpChange}
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
                                                onChange={handleSignUpChange}
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
                                                onChange={handleSignUpChange}
                                                className="input-field"
                                                required
                                            />
                                        </div>
                                        <div className="input3-1">
                                            <label className="text--6">전화번호</label>
                                            <input
                                                type="text"
                                                name="phoneNumber"
                                                placeholder="연락 가능한 번호를 입력해 주세요."
                                                value={signUpData.phoneNumber}
                                                onChange={handleSignUpChange}
                                                className="input-field"
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
            )}
        </div>
    );
}

export default LoginForm;
