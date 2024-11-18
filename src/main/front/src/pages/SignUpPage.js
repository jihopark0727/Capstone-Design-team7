// SignUpPage.js
import React from 'react';
import SignUpForm from '../components/SignUpForm';

function SignUpPage() {
    return (
        <div className="container">
            <div className="main-content">
                <div className="left-content">
                    <h2>새로운 여정을 시작하세요</h2>
                    <p>계정을 생성하여 마음읽기 서비스를 이용해보세요.</p>
                </div>

                <div className="right-content">
                    <h2>회원가입</h2>
                    <SignUpForm />
                </div>
            </div>
        </div>
    );
}

export default SignUpPage;
