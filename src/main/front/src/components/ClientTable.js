import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ClientTable.css';

function ClientTable({ clients, onEdit }) {
    const navigate = useNavigate();

    const handleViewRecords = (clientId) => {
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
                        <th>상담기록</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client, index) => {
                        const registrationStatus = client?.registrationStatus || "N/A";

                        return (
                            <tr
                                key={client?.id || index}
                                className={index % 2 === 0 ? 'even' : 'odd'} /* Zebra Stripes */
                            >
                                <td className={registrationStatus === "신규" ? "status-new" : "status-ongoing"}>
                                    {registrationStatus}
                                </td>
                                <td>{client?.name || "N/A"}</td>
                                <td>{client?.topic || "N/A"}</td>
                                <td>{client?.contactNumber || "N/A"}</td>
                                <td>{client?.gender || "N/A"}</td>
                                <td>{client?.age || "N/A"}</td>
                                <td>
                                    {client?.registrationDate
                                        ? new Date(client.registrationDate).toLocaleDateString()
                                        : "N/A"}
                                </td>
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
