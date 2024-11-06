import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignUpForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phoneNumber: '',
    });
    const navigate = useNavigate(); // useNavigate 훅 사용

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 회원가입 경로를 백엔드의 `/api/auth/signUp`로 설정
            const response = await axios.post('http://localhost:8080/api/auth/signUp', formData);
            if (response.status === 201 || response.status === 200) {
                console.log('회원가입 성공:', response.data); // 성공 로그 출력
                alert('회원가입이 완료되었습니다.');
                navigate('/'); // HomePage.js로 이동
            }
        } catch (error) {
            console.error('Error response:', error.response);
            alert('회원가입에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    return (
        <form className="signup-form" onSubmit={handleSubmit}>
            <div>
                <label>이메일</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>비밀번호</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>이름</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>전화번호</label>
                <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">회원가입</button>
        </form>
    );
}

export default SignUpForm;
