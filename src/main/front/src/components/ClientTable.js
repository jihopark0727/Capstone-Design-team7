import React from 'react';

function ClientTable({ clients, onEdit }) {
    return (
        <div className="table-container">
            <table className="data-grid">
                <thead>
                <tr>
                    <th>상태</th>
                    <th>이름</th>
                    <th>상담 주제</th>
                    <th>소속</th>
                    <th>연락처</th>
                    <th>성별</th>
                    <th>나이</th>
                    <th>등록일</th>
                    <th>편집</th>
                </tr>
                </thead>
                <tbody>
                {clients.map((client) => (
                    <tr key={client.id}>
                        <td className={client.registrationStatus === '신규' ? 'status-new' : 'status-ongoing'}>
                            {client.registrationStatus}
                        </td>
                        <td>{client.name}</td>
                        <td>{client.topic || 'N/A'}</td> {/* topic 데이터가 없을 경우 "N/A"로 표시 */}
                        <td>{client.affiliation || 'N/A'}</td> {/* affiliation 데이터가 없을 경우 "N/A"로 표시 */}
                        <td>{client.contact || 'N/A'}</td> {/* contact 데이터가 없을 경우 "N/A"로 표시 */}
                        <td>{client.gender}</td>
                        <td>{client.age}</td>
                        <td>{client.registrationDate}</td>
                        <td>
                            <span className="edit-icon" onClick={() => onEdit(client)}>✏️</span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default ClientTable;
