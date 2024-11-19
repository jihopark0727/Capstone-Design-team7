import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router를 사용하여 페이지 이동
import './FileUploadModal.css';

function FileUploadPage({ onClose }) {
    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수
    const [selectedFile, setSelectedFile] = useState(null);
    const [clients, setClients] = useState(['홍길동', '김철수', '이영희']); // 예시 내담자 목록
    const [sessions, setSessions] = useState(['1회기', '2회기', '3회기']); // 예시 회기 목록

    const [selectedClient, setSelectedClient] = useState('');
    const [isDirectClientInput, setIsDirectClientInput] = useState(false);
    const [directClientInput, setDirectClientInput] = useState('');

    const [selectedSession, setSelectedSession] = useState('');
    const [isDirectSessionInput, setIsDirectSessionInput] = useState(false);
    const [directSessionInput, setDirectSessionInput] = useState('');

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = () => {
        // 파일 업로드 로직
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
            alert('내담 회기를 선택하거나 입력해주세요.');
            return;
        }

        // 업로드 성공 시 FileAnalysisPage로 이동
        alert(`파일 업로드 성공: ${selectedFile.name}\n내담자: ${client}\n회기: ${session}`);
        navigate('/analysis'); // FileAnalysisPage로 이동
    };

    const handleClientChange = (e) => {
        const value = e.target.value;
        if (value === 'direct') {
            setIsDirectClientInput(true);
            setSelectedClient('');
        } else {
            setIsDirectClientInput(false);
            setSelectedClient(value);
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
                {/* 닫기 버튼 */}
                <button className="close-button" onClick={onClose}>
                    ×
                </button>

                {/* 제목 */}
                <div className="text--">파일 업로드</div>

                {/* 파일 업로드 박스 */}
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

                {/* 지원 파일 종류 및 크기 */}
                <div className="file-info">
                    <span className="text---mp3-wav">지원 확장자: MP3, WAV, m4a</span>
                    <span className="text----20mb">파일 최대 사이즈: 20MB</span>
                </div>

                {/* 드롭다운 메뉴 (가로 배치) */}
                <div className="dropdowns-row">
                    {/* 내담자 드롭다운 */}
                    <div className="dropdown">
                        <select
                            className="dropdown-select"
                            onChange={handleClientChange}
                            value={isDirectClientInput ? 'direct' : selectedClient}
                        >
                            <option value="" disabled>
                                내담자 선택
                            </option>
                            {clients.map((client, index) => (
                                <option key={index} value={client}>
                                    {client}
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

                    {/* 내담 회기 드롭다운 */}
                    <div className="dropdown">
                        <select
                            className="dropdown-select"
                            onChange={handleSessionChange}
                            value={isDirectSessionInput ? 'direct' : selectedSession}
                        >
                            <option value="" disabled>
                                회기 선택
                            </option>
                            {sessions.map((session, index) => (
                                <option key={index} value={session}>
                                    {session}
                                </option>
                            ))}
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

                {/* 업로드 버튼 */}
                <div className="button" onClick={handleUpload}>
                    <div className="text-">업로드</div>
                </div>
            </div>
        </div>
    );
}

export default FileUploadPage;
