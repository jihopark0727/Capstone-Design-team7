// Header.js
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css'; // 스타일 파일 연결

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation(); // 현재 경로를 확인하기 위해 useLocation 사용
    const navigate = useNavigate();

    const handleLogout = () => {
        // 로그아웃 시 토큰 삭제
        localStorage.removeItem('token');
        alert('로그아웃 되었습니다.');
        navigate('/'); // 로그아웃 후 홈 페이지로 이동
    };

    return (
        <header>
            <div className="logo">마음읽기</div>
            <nav>
                <ul className={isMenuOpen ? 'open' : ''}>
                    <li>
                        <Link
                            to="/"
                            className={location.pathname === '/' ? 'active' : ''}
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/clients"
                            className={location.pathname === '/clients' ? 'active' : ''}
                        >
                            나의 내담자
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/dashboard"
                            className={location.pathname === '/dashboard' ? 'active' : ''}
                        >
                            감정 대시보드
                        </Link>
                    </li>
                    <li>
                        <button onClick={handleLogout} className="logout-button">
                            로그아웃
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
