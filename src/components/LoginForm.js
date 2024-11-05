import React, { useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('로그인 기능은 현재 구현되지 않았습니다.');
  };

  return (
    <div className="login-section">
      <h3>로그인</h3>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="아이디(이메일)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">로그인</button>
      </form>
      <div className="login-options">
        <a href="#">아이디/비밀번호 찾기</a>
      </div>
    </div>
  );
}

export default LoginForm;