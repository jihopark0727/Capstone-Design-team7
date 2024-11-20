import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SignUpModal from './SignUpModal'; // 모달 컴포넌트 추가
import './LoginForm.css'; // 로그인 스타일

function LoginForm({ setIsLoggedIn }) { // props로 setIsLoggedIn 받음

    console.log('setIsLoggedIn:', typeof setIsLoggedIn); // "function"이어야 정상
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
            const response = await axios.post('/api/auth/login', { email, password });

            if (response.data?.result) {
                alert('로그인 성공');
                const name = response.data.data?.counselor?.name;
                const token = response.data.data?.token;

                if (name) localStorage.setItem('name', name);
                if (token) localStorage.setItem('token', token);

                setIsLoggedIn(true); // 로그인 상태 업데이트
                navigate('/upload'); // 이동
            } else {
                throw new Error('로그인 실패: 서버에서 인증 거부'); // 명확한 에러 처리
            }
        } catch (error) {
            console.error('로그인 요청 오류:', error); // 에러 로그 추가
            alert('로그인 오류: 서버 문제 또는 네트워크 오류가 발생했습니다.');
        }
    };


    // 회원가입 처리
    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/signUp', signUpData);
            if (response.data.result) {
                alert('회원가입이 완료되었습니다.');
                setIsModalOpen(false);
            } else {
                alert('회원가입에 실패했습니다.');
            }
        } catch (error) {
            alert('회원가입 오류');
        }
    };

    // 회원가입 입력값 핸들러
    const handleSignUpChange = (e) => {
        const { name, value } = e.target;
        setSignUpData((prevData) => ({ ...prevData, [name]: value }));
    };

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
                        onClick={() => setIsModalOpen(true)}
                    >
                        <span className="text--1">회원가입</span>
                    </button>
                </div>
            </form>

            {/* 회원가입 모달 */}
            <SignUpModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                signUpData={signUpData}
                handleChange={handleSignUpChange}
                handleSubmit={handleSignUp}
            />
        </div>
    );
}

export default LoginForm;
