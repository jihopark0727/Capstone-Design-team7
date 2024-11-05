import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header>
      <div className="logo">마음읽기</div>
      <nav>
        <ul className={isMenuOpen ? 'open' : ''}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/clients">나의 내담자</Link></li>
          <li><Link to="/dashboard">감정 대시보드</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;