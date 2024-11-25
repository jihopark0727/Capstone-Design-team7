import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ClientInfo from '../components/ClientInfo';
import EmotionKeywords from '../components/EmotionKeywords';
import GptSummary from '../components/GptSummary';
import EmotionGraph from '../components/EmotionGraph';
import axios from 'axios';
import './EmotionDashboard.css';

const EmotionDashboard = () => {
  const { clientId } = useParams(); // URL에서 clientId를 받아옴
  const [activeMenu, setActiveMenu] = useState('상담 정보');
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [clientInfo, setClientInfo] = useState(null); // 내담자 정보 상태
  const [sessions, setSessions] = useState([]); // 초기값을 빈 배열로 설정
  const [selectedTranscript, setSelectedTranscript] = useState(null); // 선택된 축어록 데이터
  const [showTranscriptModal, setShowTranscriptModal] = useState(false); // 축어록 모달 상태
  const [showEmotionGraphModal, setShowEmotionGraphModal] = useState(false); // 감정 그래프 모달 상태

  // Mock Data (백엔드가 없을 때 사용하는 임시 데이터)
  const mockSessions = [
    {
      id: 1,
      date: '2024-11-13 14:00',
      transcript: '축어록 1',
      emotionWave: '감정 파도 1',
    },
    {
      id: 2,
      date: '2024-11-14 15:30',
      transcript: '축어록 2',
      emotionWave: '감정 파도 2',
    },
  ];

  const mockTranscriptData = [
    { speaker: '내담자', text: '안녕하세요. 요즘 스트레스를 많이 받고 있어요.' },
    { speaker: '상담사', text: '안녕하세요. 스트레스의 원인이 무엇인지 이야기해볼까요?' },
    { speaker: '내담자', text: '일과 가족 문제 때문에요.' },
  ];

  const mockEmotionGraphData = {
    // 임시 감정 그래프 데이터
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


  // 내담자 정보 및 회기 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 내담자 정보 가져오기
        const clientResponse = await axios.get(`/api/clients/${clientId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log("Fetched Client Info:", clientResponse.data.data);
        setClientInfo(clientResponse.data.data);

        // 회기 데이터 가져오기
        const sessionsResponse = await axios.get(`/api/clients/${clientId}/sessions`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        const formattedSessions = sessionsResponse.data.data.map((session) => ({
          id: session.id,
          sessionDate: new Date(session.sessionDate).toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
          sessionNumber: session.sessionNumber,
        }));

        setSessions(formattedSessions);
      } catch (error) {
        console.error("Error fetching sessions:", error.message);
      }
    };

    fetchData(); // 비동기 함수 호출
  }, [clientId]);


  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  const handleStartDashboard = () => {
    setIsFirstVisit(false);
    localStorage.setItem('hasVisitedDashboard', 'true');
  };

  const openTranscriptModal = (sessionId) => {
    setSelectedTranscript(mockTranscriptData);
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
                  {clientInfo ? (
                      <div className="client-info-card">
                        <div className="client-info-row single">
                          <h3>{clientInfo.name}</h3>
                        </div>
                        <div className="client-info-row">
                          <span>상담 주제:</span>
                          <span>{clientInfo.topic || 'N/A'}</span>
                        </div>
                        <div className="client-info-row">
                          <span>연락처:</span>
                          <span>{clientInfo.contactNumber || 'N/A'}</span>
                        </div>
                        <div className="client-info-row">
                          <span>성별:</span>
                          <span>{clientInfo.gender || 'N/A'}</span>
                        </div>
                        <div className="client-info-row">
                          <span>나이:</span>
                          <span>{clientInfo.age || 'N/A'}</span>
                        </div>
                        <div className="client-info-row">
                          <span>등록일:</span>
                          <span>{clientInfo.registrationDate || 'N/A'}</span>
                        </div>
                      </div>
                  ) : (
                    <p className="loading-message">내담자 정보</p>
                  )}

                  <div className="summary-and-graph">
                    <GptSummary />
                    <EmotionKeywords keywords={['임시값']} />                  </div>
                </>
            )}
            {activeMenu === '회기별 정보' && (
                <div className="list">
                  {sessions && sessions.length > 0 ? (
                      sessions.map((session, index) => (
                          <div className="formitem" key={index}>
                            <div className="list-header">
                              <div className="number">
                                <div className="text-2024-11-13-oooo">{session.id}</div>
                              </div>
                              <div className="time">
                                <div className="text-2024-11-13-oooo">{session.sessionDate}</div>
                              </div>
                              <div className="divider"></div>
                            </div>
                            <div className="task">
                              <div className="task-1">
                                <div className="sessionTopic">
                                  상담 주제가 추가될 공간입니다.
                                </div>
                                <div
                                    className="verbatim-button"
                                    onClick={() => openTranscriptModal(session.id)}
                                >
                                  축어록 {session.id}
                                </div>
                                <div
                                    className="emotiongraph-button-1"
                                    onClick={openEmotionGraphModal}
                                >
                                  감정파도
                                </div>
                              </div>
                            </div>
                          </div>
                      ))
                  ) : (
                      <p>등록된 회기 데이터가 없습니다.</p>
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
                <EmotionGraph data={mockEmotionGraphData} /> {/* 임시 데이터 전달 */}
              </div>
            </div>
        )}
      </div>
  );
};

export default EmotionDashboard;
