import React from 'react';

const ClientInfo = ({ client }) => {
    // client 객체가 없을 경우 처리
    if (!client) {
        return <div className="client-info">내담자 정보가 없습니다.</div>;
    }

    return (
        <div className="client-info">
            <h2>{client.name}</h2>
            <p>상태: {client.registrationStatus}</p>
            <p>상담 주제: {client.topic || 'N/A'}</p>
            <p>소속: {client.affiliation || 'N/A'}</p>
            <p>연락처: {client.contact || 'N/A'}</p>
            <p>성별: {client.gender}</p>
            <p>나이: {client.age}</p>
            <p>등록일: {client.registrationDate}</p>
        </div>
    );
};

export default ClientInfo;
