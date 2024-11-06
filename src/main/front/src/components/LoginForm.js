// LoginForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email,
                password,
            });

            console.log('API 호출 성공:', response);
            console.log('response.data:', response.data);

            // 로그인 성공 여부 확인
            if (response.data.result) {
                console.log('로그인 성공:', response.data);
                alert('상담사 로그인에 성공하였습니다.');

                // 토큰 저장
                const token = response.data.data.token;
                if (token) {
                    localStorage.setItem('token', token);
                    console.log('토큰이 localStorage에 저장되었습니다.');
                } else {
                    console.error('토큰이 응답에 포함되지 않았습니다.');
                }

                // 로그인 성공 후 이동
                setTimeout(() => {
                    navigate('/clients');
                }, 500);
            } else {
                console.error('로그인 실패: 서버가 성공 상태를 반환하지 않았습니다.');
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


    return (
        <form onSubmit={handleLogin}>
            <h2>로그인</h2>
            <div>
                <label>이메일</label>
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>비밀번호</label>
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">로그인</button>
        </form>
    );
}

export default LoginForm;
