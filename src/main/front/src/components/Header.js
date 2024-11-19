import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ isLoggedIn, setIsLoggedIn, counselorName }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        // 로그아웃 시 토큰 삭제
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        alert('로그아웃 되었습니다.');
        setIsLoggedIn(false); // 로그인 상태 업데이트
        navigate('/'); // 로그아웃 후 홈 페이지로 이동
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header>
            <div className="header-content">
                <div className="logo">마음읽기</div>
                <nav className={isMenuOpen ? 'open' : ''}>
                    <ul>
                        <li>
                            <Link
                                to="/"
                                className={location.pathname === '/' ? 'active' : ''}
                            >
                                Home
                            </Link>
                        </li>
                        {isLoggedIn && (
                            <>
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
                            </>
                        )}
                    </ul>
                </nav>
                {/* 상담사 이름을 표시 (로그인된 상태에서만 표시) */}
                {isLoggedIn && counselorName && (
                    <div className="counselor-name">환영합니다, {counselorName}님!</div>
                )}
            </div>
        </header>
    );
}

export default Header;
