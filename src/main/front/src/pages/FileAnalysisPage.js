import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./FileAnalysisPage.css";

function FileAnalysisPage() {
    const location = useLocation();
    const uploadStatus = location.state?.uploadStatus;

    useEffect(() => {
        if (uploadStatus === 'success') {
            alert('파일 업로드 및 분석이 완료되었습니다.');
        } else if (uploadStatus === 'failure') {
            alert('파일 업로드에 실패했습니다. 다시 시도해주세요.');
        }
    }, [uploadStatus]);

    return (
        <div className="file-analysis-container">
            {/* 메인 콘텐츠 */}
            <div className="analysis-content">
                <h1>내담자의 감정을 분석하고 있어요.</h1>
                <p>내담자 감정 분석까지는 최대 10분이 소요될 수 있어요.</p>
                <p>감정 분석이 완료되면 알려드릴게요!</p>

                {/* 분석 진행 중 메시지 */}
                <div className="progress-message">감정 분석 중...</div>

                {/* 진행 상태 표시 바 */}
                <div className="progress-indicator">
                    <div className="progress-bar">
                        <div className="progress"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FileAnalysisPage;
