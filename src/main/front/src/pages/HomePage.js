// HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Slider from '../components/Slider';  // 슬라이더 컴포넌트
import LoginForm from '../components/LoginForm';  // 로그인 폼 컴포넌트

function HomePage() {
    return (
        <div className="container">
            <Header />
            <div className="main-content">
                {/* 좌측 슬라이더 */}
                <div className="left-content">
                    <Slider />
                </div>

                {/* 우측 로그인 폼 */}
                <div className="right-content">
                    <h2>마음을 잇는 당신의 곁에, 마음읽기</h2>
                    <LoginForm />

                    {/* 회원가입 버튼 */}
                    <p>
                        계정이 없으신가요? <Link to="/signup">회원가입</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
