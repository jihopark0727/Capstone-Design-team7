import React from "react";
import "./FileAnalysisPage.css"

function FileAnalysisPage() {
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
