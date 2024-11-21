import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // useParams 추가
import ClientInfo from '../components/ClientInfo';
import GptSummary from '../components/GptSummary';
import EmotionGraph from '../components/EmotionGraph';
import axios from 'axios';
import './EmotionDashboard.css';

const EmotionDashboard = () => {
  const { clientId } = useParams(); // URL에서 clientId를 받아옴
  const [activeMenu, setActiveMenu] = useState('상담 정보');
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [sessions, setSessions] = useState([]); // 회기 데이터 상태
  const [clientInfo, setClientInfo] = useState(null); // 내담자 정보 상태
  const [selectedTranscript, setSelectedTranscript] = useState(null); // 선택된 축어록 데이터
  const [showTranscriptModal, setShowTranscriptModal] = useState(false); // 축어록 모달 상태
  const [showEmotionGraphModal, setShowEmotionGraphModal] = useState(false); // 감정 그래프 모달 상태

  // Mock 데이터 (임시 데이터)
  const mockTranscriptData = [
    { speaker: '내담자', text: '안녕하세요. 요즘 스트레스를 많이 받고 있어요.' },
    { speaker: '상담사', text: '안녕하세요. 스트레스의 원인이 무엇인지 이야기해볼까요?' },
    { speaker: '내담자', text: '일과 가족 문제 때문에요.' },
  ];

  const mockEmotionGraphData = {
    happiness: 30,
    sadness: 20,
    anger: 10,
    fear: 15,
    surprise: 25,
  };

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedDashboard');
    if (hasVisited) {
      setIsFirstVisit(false);
    }
  }, []);

  useEffect(() => {
    const fetchClientInfo = async () => {
      try {
        const response = await axios.get(`/api/clients/${clientId}`);
        console.log('Client Info Response:', response); // 응답 데이터 확인
        // 데이터 구조에 맞게 수정
        setClientInfo(response.data.data); // 내담자 정보 저장
      } catch (error) {
        console.error('내담자 정보를 가져오는 중 오류 발생:', error);
        setClientInfo(null); // 오류 발생 시 null로 설정
      }
    };

    const fetchSessions = async () => {
      try {
        const response = await axios.get(`/api/sessions/${clientId}`);
        setSessions(response.data); // 회기 데이터 설정
      } catch (error) {
        console.error('회기별 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchClientInfo(); // 내담자 정보 가져오기
    fetchSessions();   // 회기 데이터 가져오기
  }, [clientId]);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  const handleStartDashboard = () => {
    setIsFirstVisit(false);
    localStorage.setItem('hasVisitedDashboard', 'true');
  };

  const openTranscriptModal = (sessionId) => {
    setSelectedTranscript(mockTranscriptData); // mock 데이터 설정
    setShowTranscriptModal(true);
  };

  const closeTranscriptModal = () => {
    setShowTranscriptModal(false);
    setSelectedTranscript(null);
  };

  const openEmotionGraphModal = () => {
    setShowEmotionGraphModal(true);
  };

  const closeEmotionGraphModal = () => {
    setShowEmotionGraphModal(false);
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
              <li>감정 변화 그래프</li>
            </ul>
            <button onClick={handleStartDashboard} className="start-button">
              시작하기
            </button>
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
              {['상담 정보', '회기별 정보'].map((menu) => (
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
            {activeMenu === '상담 정보' && (
                <>
                  <div className="data-grid">
                    <div className="grid-row">
                      <p>인적사항</p>
                    </div>
                    <div className="client-info">
                      {/* 내담자 정보 표시 */}
                      {clientInfo ? (
                          <>
                            <p><strong>이름:</strong> {clientInfo.name}</p>
                            <p><strong>나이:</strong> {clientInfo.age}</p>
                            <p><strong>성별:</strong> {clientInfo.gender}</p>
                            <p><strong>연락처:</strong> {clientInfo.contactNumber}</p>
                            <p><strong>상담 주제:</strong> {clientInfo.topic}</p>
                          </>
                      ) : (
                          <p>내담자 정보가 없습니다.</p>
                      )}
                    </div>
                  </div>
                  <div className="summary-and-graph">
                    <GptSummary />
                    <EmotionGraph data={mockEmotionGraphData} /> {/* mock 데이터 전달 */}
                  </div>
                </>
            )}
            {activeMenu === '회기별 정보' && (
                <div className="list">
                  {sessions.length === 0 ? (
                      <p>등록된 회기 데이터가 없습니다.</p>
                  ) : (
                      sessions.map((session, index) => (
                          <div className="formitem" key={index}>
                            <div className="time">
                              <div className="time-1">
                                <div className="text-2024-11-13-oooo">{session.date}</div>
                              </div>
                              <div className="divider"></div>
                            </div>
                            <div className="task">
                              <div className="task-1">
                                <div
                                    className="verbatim-button"
                                    onClick={() => openTranscriptModal(session.id)}
                                >
                                  {session.transcript}
                                </div>
                                <div
                                    className="emotiongraph-button-1"
                                    onClick={openEmotionGraphModal}
                                >
                                  {session.emotionWave}
                                </div>
                              </div>
                            </div>
                          </div>
                      ))
                  )}
                </div>
            )}
          </div>
        </div>

        {/* 모달: 축어록 */}
        {showTranscriptModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button className="close-modal" onClick={closeTranscriptModal}>
                  ✖
                </button>
                <h2>축어록</h2>
                <div className="transcript-content">
                  {selectedTranscript.map((item, index) => (
                      <div key={index} className="transcript-item">
                        <strong>{item.speaker}:</strong> {item.text}
                      </div>
                  ))}
                </div>
              </div>
            </div>
        )}

        {/* 모달: 감정 그래프 */}
        {showEmotionGraphModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button className="close-modal" onClick={closeEmotionGraphModal}>
                  ✖
                </button>
                <EmotionGraph data={mockEmotionGraphData} /> {/* mock 데이터 전달 */}
              </div>
            </div>
        )}
      </div>
  );
};

export default EmotionDashboard;
