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
          {clients.map((client, index) => (
            <tr key={index}>
              <td className={client.status === '신규' ? 'status-new' : 'status-ongoing'}>{client.status}</td>
              <td>{client.name}</td>
              <td>{client.topic}</td>
              <td>{client.affiliation}</td>
              <td>{client.contact}</td>
              <td>{client.gender}</td>
              <td>{client.age}</td>
              <td>{client.registrationDate}</td>
              <td><span className="edit-icon" onClick={() => onEdit(client)}>✏️</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClientTable;