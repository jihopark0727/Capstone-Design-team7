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
                    <th>연락처</th>
                    <th>성별</th>
                    <th>나이</th>
                    <th>등록일</th>
                    <th>편집</th>
                </tr>
                </thead>
                <tbody>
                {clients.map((item, index) => {
                    const client = item?.client; // client가 있는지 확인
                    const registrationStatus = client?.registrationStatus || "N/A"; // 기본값 설정

                    return (
                        <tr key={client?.id || index}>
                            <td className={registrationStatus === "신규" ? "status-new" : "status-ongoing"}>
                                {registrationStatus}
                            </td>
                            <td>{client?.name || "N/A"}</td>
                            <td>{item?.topic || "N/A"}</td>
                            <td>{client?.contactNumber || "N/A"}</td>
                            <td>{client?.gender || "N/A"}</td>
                            <td>{client?.age || "N/A"}</td>
                            <td>{client?.registrationDate ? new Date(client.registrationDate).toLocaleDateString() : "N/A"}</td>
                            <td>
                                <span className="edit-icon" onClick={() => onEdit(client)}>✏️</span>
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
