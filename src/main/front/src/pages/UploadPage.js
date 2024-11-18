import React, { useState } from 'react';
import FileUploadPage from './FileUploadPage';
import './UploadPage.css'; 

function UploadPage({ name = '사용자' }) {

    const [isFileUploadOpen, setFileUploadOpen] = useState(false);

        // 파일 업로드 팝업 열기
        const handleOpenFileUpload = () => {
            setFileUploadOpen(true);
        };

            // 파일 업로드 팝업 닫기
    const handleCloseFileUpload = () => {
        setFileUploadOpen(false);
    };
    
    return (
        <div className="upload-container">
            {/* 클라이언트 페이지 메인 콘텐츠 */}
            <div className="upload-content">
                <div className="upload-text">
                    <h1>안녕하세요 {name}님!</h1>
                    <p>분석할 음성 파일을 업로드하세요.</p>
                </div>
                <div className="upload-description">
                    <p>내담자 감정 분석까지는 최대 10분이 소요될 수 있어요.</p>
                    <p>감정 분석이 완료되면 알려드릴게요!</p>
                </div>
                <div className="upload-action">
                    <button className="upload-button" onClick={handleOpenFileUpload}>
                        파일 업로드
                    </button>
                </div>
            </div>

            {/* 파일 업로드 팝업 */}
            {isFileUploadOpen && <FileUploadPage onClose={handleCloseFileUpload} />}
        </div>
    );
}

export default UploadPage;
