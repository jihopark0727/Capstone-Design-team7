import React, { useState } from 'react';
import { signUp } from '../services/authService';

function SignUp() {
    const [email, setEmail] = useState('');  // id로 사용
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [userType, setUserType] = useState('counselor');  // 기본값 'counselor'
    const [message, setMessage] = useState('');

    // 전화번호 검증
    const validatePhoneNumber = (phoneNumber) => {
        const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;
        return phoneRegex.test(phoneNumber);
    };

    const handleSignUp = async () => {
        // 유효성 검사
        if (email === '') {
            setMessage('이메일을 입력해주세요.');
            return;
        }
        if (password === '') {
            setMessage('비밀번호를 입력해주세요.');
            return;
        }
        if (name === '') {
            setMessage('이름을 입력해주세요.');
            return;
        }
        if (!validatePhoneNumber(phoneNumber)) {
            setMessage('전화번호 형식이 유효하지 않습니다. 형식: 010-1234-5678');
            return;
        }

        try {
            const response = await signUp({
                id: email,  // id는 email로 사용
                email: email,
                password: password,
                name: name,
                phone_number: phoneNumber,
                user_type: userType
            });

            if (response.data.result) {
                setMessage(response.data.message);  // 성공 메시지 표시
                window.location.href = '/?signup=success';  // 성공 시 리다이렉트
            } else {
                setMessage('회원가입 실패! 다시 시도해주세요.');
            }
        } catch (error) {
            setMessage('회원가입에 실패하였습니다.');
        }
    };

    return (
        <div className="page-container">
            <div className="form-container shadow">
                <div className="form-left-side">
                    <h1>Issue Management System</h1>
                    <p>We support the following:<br />
                        Issue Creation & Browse & Comment & Details view & Status Change & Analytics, etc.</p>
                </div>
                <div className="form-right-side">
                    <h1>Sign Up</h1>
                    <div className="input-container">
                        <div className="input-wrap input-id">
                            <i className="fas fa-envelope"></i>
                            <input
                                placeholder="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="input-wrap input-password">
                            <i className="fas fa-key"></i>
                            <input
                                placeholder="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="input-wrap input-user">
                            <i className="fas fa-user"></i>
                            <input
                                className="user_name"
                                placeholder="Name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="input-wrap input-tel">
                            <i className="fas fa-phone"></i>
                            <input
                                placeholder="Phone Number"
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                        <div className="input-wrap input-user-type">
                            <i className="fas fa-user-cog"></i>
                            <select
                                value={userType}
                                onChange={(e) => setUserType(e.target.value)}
                            >
                                <option value="counselor">counselor</option>
                                <option value="admin">admin</option>
                                <option value="pl">pl</option>
                                <option value="dev">dev</option>
                                <option value="tester">tester</option>
                            </select>
                        </div>
                        {message && <div className="warning-message">{message}</div>}
                        <button className="submit-btn" onClick={handleSignUp}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
