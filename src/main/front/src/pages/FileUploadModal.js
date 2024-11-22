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
    const [isUploading, setIsUploading] = useState(false); // 업로드 진행 상태

    // 내담자 목록 불러오기
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/clients/assigned-clients', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // 전체 Client 객체에서 id와 name만 추출하여 저장
                const clientData = response.data.data.map((client) => ({
                    id: client.id,
                    name: client.name,
                }));

                setClients(clientData); // [{ id, name }] 형식으로 저장
            } catch (error) {
                console.error('내담자 목록 불러오기 실패:', error);
                setClients([]);
            }
        };

        fetchClients();
    }, []);

    const handleClientChange = async (e) => {
        const value = e.target.value;
        setSelectedClient(value);

        if (value === 'direct') {
            setIsDirectClientInput(true);
            setSessions([]);
            setSelectedSession('1회차');
        } else {
            setIsDirectClientInput(false);

            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`/api/sessions/client/${value}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // 세션 번호 추출 및 다음 회차 계산
                const sessionsData = response.data.data; // 세션 목록
                const sessionNumbers = sessionsData.map((session) => Number(session.sessionNumber));
                const nextSessionNumber = sessionNumbers.length > 0 ? Math.max(...sessionNumbers) + 1 : 1;

                setSessions(sessionNumbers); // 세션 번호 저장
                setSelectedSession(`${nextSessionNumber}회차`); // 다음 회차를 기본값으로 설정
            } catch (error) {
                console.error('세션 목록 불러오기 실패:', error);
                setSessions([]);
                setSelectedSession('1회차'); // 기본값 설정
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

        const clientId = isDirectClientInput ? directClientInput : selectedClient;
        const sessionNumber = isDirectSessionInput
            ? directSessionInput
            : selectedSession.replace(/[^0-9]/g, '');

        if (!clientId) {
            alert('내담자를 선택해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('clientId', clientId);
        formData.append('sessionNumber', sessionNumber);

        const token = localStorage.getItem('token');
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        // 페이지 이동 먼저 처리
        navigate('/analysis', { state: { uploadStatus: 'uploading' } });

        try {
            setIsUploading(true);

            const response = await axios.post(
                `/api/sessions/${clientId}/${sessionNumber}/analyze-recording`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 200) {
                // 업로드 성공 상태 전달
                navigate('/analysis', { state: { uploadStatus: 'success' } });
            }
        } catch (error) {
            console.error('파일 업로드 실패:', error);
            // 업로드 실패 상태 전달
            navigate('/analysis', { state: { uploadStatus: 'failure' } });
        } finally {
            setIsUploading(false);
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
            {isUploading ? (
                <div className="loading-page">파일을 분석 중입니다. 잠시만 기다려주세요...</div>
            ) : (
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
                            {selectedFile ? (
                                <div className="file-preview">
                                    <span className="file-icon">📄</span> {/* 파일 아이콘 */}
                                    <span className="file-name">{selectedFile.name}</span> {/* 파일 이름 */}
                                </div>
                            ) : (
                                "파일을 업로드하려면 클릭하세요."
                            )}
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
                                {clients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.name} {/* 화면에는 이름 표시 */}
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
                                        <option key={index} value={`${session}회차`}>
                                            {`${session}회차`}
                                        </option>
                                    ))
                                )}
                                <option value={`${sessions.length + 1}회차`} selected>
                                    {`${sessions.length + 1}회차`} {/* 다음 회차 자동 설정 */}
                                </option>
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
            )}
        </div>
    );
}

export default FileUploadPage;
