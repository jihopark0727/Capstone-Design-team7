import React from 'react';
import { useNavigate } from 'react-router-dom';  // useHistory 대신 useNavigate 사용
import './ClientTable.css';

function ClientTable({ clients, onEdit }) {
    const navigate = useNavigate();  // useNavigate 훅 초기화

    // "상담기록보기" 버튼 클릭 시 호출되는 함수
    const handleViewRecords = (clientId) => {
        // 해당 내담자의 상담 기록 페이지로 이동
        navigate(`/dashboard/${clientId}`);
    };

    return (
        <div className="table-container">
            <table className="data-grid">
                <thead>
                <tr>
                    <th>상태</th>
                    <th>이름</th>
                    <th>상담 주제</th>
                    <th>연락처</th>
                    <th>성별</th>
                    <th>나이</th>
                    <th>등록일</th>
                    <th>편집</th>
                    <th>상담기록</th> {/* 버튼을 위한 새로운 열 추가 */}
                </tr>
                </thead>
                <tbody>
                {clients.map((client, index) => {
                    const registrationStatus = client?.registrationStatus || "N/A"; // 기본값 설정

                    return (
                        <tr key={client?.id || index}>
                            <td className={registrationStatus === "신규" ? "status-new" : "status-ongoing"}>
                                {registrationStatus}
                            </td>
                            <td>{client?.name || "N/A"}</td>
                            <td>{client?.topic || "N/A"}</td> {/* topic 필드 바로 사용 */}
                            <td>{client?.contactNumber || "N/A"}</td>
                            <td>{client?.gender || "N/A"}</td>
                            <td>{client?.age || "N/A"}</td>
                            <td>{client?.registrationDate ? new Date(client.registrationDate).toLocaleDateString() : "N/A"}</td>
                            <td>
                                <span className="edit-icon" onClick={() => onEdit(client)}>✏️</span>
                            </td>
                            <td>
                                <button className="view-records-button" onClick={() => handleViewRecords(client?.id)}>
                                    상담기록보기
                                </button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}

export default ClientTable;