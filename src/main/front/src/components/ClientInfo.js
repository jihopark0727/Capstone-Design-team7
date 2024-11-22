import React from 'react';

const ClientInfo = ({ client }) => {
    // client 객체가 없을 경우 처리
    if (!client) {
        return <div className="client-info">내담자 정보가 없습니다.</div>;
    }

    return (
        <div className="client-info-card">
            <div className="client-info-row single">
                <h3>{client.name}</h3>
            </div>
            <div className="client-info-row">
                <span>상담 주제:</span>
                <span>{client.topic || 'N/A'}</span>
            </div>
            <div className="client-info-row">
                <span>성별:</span>
                <span>{client.gender}</span>
            </div>
            <div className="client-info-row">
                <span>나이:</span>
                <span>{client.age}</span>
            </div>
        </div>
    );
};

export default ClientInfo;
