import React, { useState, useEffect } from 'react';
import ClientInfo from '../components/ClientInfo';
import DataGrid from '../components/DataGrid';
import GptSummary from '../components/GptSummary';
import EmotionGraph from '../components/EmotionGraph';
import '../EmotionDashboard.css';

const EmotionDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('상담 정보');
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedDashboard');
    if (hasVisited) {
      setIsFirstVisit(false);
    }
  }, []);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  const handleStartDashboard = () => {
    setIsFirstVisit(false);
    localStorage.setItem('hasVisitedDashboard', 'true');
  };

  if (isFirstVisit) {
    return (
      <div className="container">
        <div className="onboarding">
          <h1>감정 대시보드에 오신 것을 환영합니다!</h1>
          <p>이 대시보드에서는 내담자의 감정 상태를 시각적으로 확인하고 분석할 수 있습니다.</p>
          <p>주요 기능:</p>
          <ul>
            <li>내담자 정보 확인</li>
            <li>상담 정보 요약</li>
            <li>GPT를 활용한 상담 내용 요약</li>
            <li>감정 변화 그래프</li>
          </ul>
          <button onClick={handleStartDashboard} className="start-button">시작하기</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard-content">
        <div className="left-sidebar">
          <ClientInfo />
          <div className="menu-container">
            {['상담 정보', '회기별 정보', '감정분석'].map((menu) => (
              <button
                key={menu}
                className={`menu-button ${activeMenu === menu ? 'active' : ''}`}
                onClick={() => handleMenuClick(menu)}
              >
                {menu}
              </button>
            ))}
          </div>
        </div>
        <div className="main-content">
          {activeMenu === '상담 정보' && <DataGrid />}
          {activeMenu === '회기별 정보' && <p>회기별 정보 내용</p>}
          {activeMenu === '감정분석' && <p>감정분석 내용</p>}
          <div className="summary-and-graph">
            <GptSummary />
            <EmotionGraph />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionDashboard;