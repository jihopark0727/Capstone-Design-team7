import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FileUploadModal.css';

function FileUploadPage({ onClose }) {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [clients, setClients] = useState([]);
    const [sessions, setSessions] = useState([]);

    const [selectedClient, setSelectedClient] = useState('');
    const [isDirectClientInput, setIsDirectClientInput] = useState(false);
    const [directClientInput, setDirectClientInput] = useState('');

    const [selectedSession, setSelectedSession] = useState('');
    const [isDirectSessionInput, setIsDirectSessionInput] = useState(false);
    const [directSessionInput, setDirectSessionInput] = useState('');

    // 내담자 목록 불러오기
    // 내담자 목록 불러오기
        useEffect(() => {
            const fetchClients = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get('/api/clients/assigned-client-names', {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    // 백엔드에서 "data"가 이름 목록임
                    const clientNames = response.data.data;
                    setClients(clientNames);

                    // 디버깅: 불러온 이름 리스트 출력
                    console.log('Fetched client names:', clientNames);
                } catch (error) {
                    console.error('내담자 목록 불러오기 실패:', error);
                    setClients([]); // 실패 시 빈 배열로 초기화
                }
            };

            fetchClients();
        }, []);

    // 내담자 변경 시 세션 목록 업데이트
    const handleClientChange = async (e) => {
        const value = e.target.value;
        setSelectedClient(value);

        if (value === 'direct') {
            setIsDirectClientInput(true);
            setSessions([]);
            setSelectedSession('');
        } else {
            setIsDirectClientInput(false);

            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`/api/sessions/client/${value}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const sessionsData = response.data.data;
                setSessions(sessionsData.map((session) => session.name));

                // 다음 회차 자동 선택
                if (sessionsData.length === 0) {
                    setSelectedSession('1회차');
                } else {
                    const nextSessionNumber = sessionsData.length + 1;
                    setSelectedSession(`${nextSessionNumber}회차`);
                }
            } catch (error) {
                console.error('세션 목록 불러오기 실패:', error);
                setSessions([]);
                setSelectedSession('1회차');
            }
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // 파일 업로드 처리
    const handleUpload = async () => {
        if (!selectedFile) {
            alert('파일을 선택해주세요.');
            return;
        }

        const client = isDirectClientInput ? directClientInput : selectedClient;
        const session = isDirectSessionInput ? directSessionInput : selectedSession;

        if (!client) {
            alert('내담자를 선택하거나 입력해주세요.');
            return;
        }

        if (!session) {
            alert('회기를 선택하거나 입력해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('clientName', client);
        formData.append('sessionNumber', session);
        formData.append('file', selectedFile);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/sessions/upload-and-analyze', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            // 분석 진행 페이지로 이동
            if (response.status === 200) {
                navigate('/file-analysis', { state: { reportId: response.data.reportId } });
            }
        } catch (error) {
            console.error('파일 업로드 실패:', error);
            alert('파일 업로드 중 오류가 발생했습니다.');
        }
    };

    const handleSessionChange = (e) => {
        const value = e.target.value;
        if (value === 'direct') {
            setIsDirectSessionInput(true);
            setSelectedSession('');
        } else {
            setIsDirectSessionInput(false);
            setSelectedSession(value);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="file-upload-page">
                <button className="close-button" onClick={onClose}>
                    ×
                </button>
                <div className="text--">파일 업로드</div>
                <div className="container3">
                    <input
                        type="file"
                        id="file-input"
                        onChange={handleFileChange}
                        className="file-input"
                    />
                    <label htmlFor="file-input" className="text------">
                        파일을 업로드하려면 클릭하세요.
                    </label>
                </div>
                <div className="file-info">
                    <span className="text---mp3-wav">지원 확장자: MP3, WAV, m4a</span>
                    <span className="text----20mb">파일 최대 사이즈: 20MB</span>
                </div>
                <div className="dropdowns-row">
                    <div className="dropdown">
                        <select
                            className="dropdown-select"
                            onChange={handleClientChange}
                            value={isDirectClientInput ? 'direct' : selectedClient}
                        >
                            <option value="" disabled>
                                내담자 선택
                            </option>
                            {/* clients 배열이 문자열 배열일 경우 수정 */}
                            {clients.map((client, index) => (
                                <option key={index} value={client}>
                                    {client} {/* 문자열 자체를 렌더링 */}
                                </option>
                            ))}
                            <option value="direct">직접 입력</option>
                        </select>
                        {isDirectClientInput && (
                            <input
                                type="text"
                                className="direct-input"
                                placeholder="내담자 이름 입력"
                                value={directClientInput}
                                onChange={(e) => setDirectClientInput(e.target.value)}
                            />
                        )}
                    </div>

                    <div className="dropdown">
                        <select
                            className="dropdown-select"
                            onChange={handleSessionChange}
                            value={isDirectSessionInput ? 'direct' : selectedSession}
                        >
                            <option value="" disabled>
                                회기 선택
                            </option>
                            {sessions.length === 0 ? (
                                <option value="1회차">1회차</option>
                            ) : (
                                sessions.map((session, index) => (
                                    <option key={index} value={session}>
                                        {session}
                                    </option>
                                ))
                            )}
                            <option value="direct">직접 입력</option>
                        </select>
                        {isDirectSessionInput && (
                            <input
                                type="text"
                                className="direct-input"
                                placeholder="회기 정보 입력"
                                value={directSessionInput}
                                onChange={(e) => setDirectSessionInput(e.target.value)}
                            />
                        )}
                    </div>
                </div>
                <div className="button" onClick={handleUpload}>
                    <div className="text-">업로드</div>
                </div>
            </div>
        </div>
    );
}

export default FileUploadPage;
