import React, { useState } from 'react';

function ClientRegistrationForm({ onSubmit, onCancel }) {
    const [client, setClient] = useState({
        status: '신규',
        name: '',
        topic: '',
        affiliation: '',
        contact: '',
        gender: '',
        age: '',
        registrationDate: new Date().toISOString().split('T')[0],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClient((prevClient) => ({
            ...prevClient,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(client);
        // 폼 초기화
        setClient({
            status: '신규',
            name: '',
            topic: '',
            affiliation: '',
            contact: '',
            gender: '',
            age: '',
            registrationDate: new Date().toISOString().split('T')[0],
        });
    };

    return (
        <form onSubmit={handleSubmit} className="client-form">
            <h2>내담자 등록</h2>
            <div>
                <label>상태:</label>
                <select name="status" value={client.status} onChange={handleChange}>
                    <option value="신규">신규</option>
                    <option value="진행중">진행중</option>
                </select>
            </div>
            <div>
                <label>이름:</label>
                <input type="text" name="name" value={client.name} onChange={handleChange} required />
            </div>
            <div>
                <label>상담 주제:</label>
                <input type="text" name="topic" value={client.topic} onChange={handleChange} required />
            </div>
            <div>
                <label>소속:</label>
                <input type="text" name="affiliation" value={client.affiliation} onChange={handleChange} />
            </div>
            <div>
                <label>연락처:</label>
                <input
                    type="tel"
                    name="contact"
                    value={client.contact}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>성별:</label>
                <select name="gender" value={client.gender} onChange={handleChange} required>
                    <option value="">선택</option>
                    <option value="남">남</option>
                    <option value="여">여</option>
                </select>
            </div>
            <div>
                <label>나이:</label>
                <input type="number" name="age" value={client.age} onChange={handleChange} required />
            </div>
            <div>
                <label>등록일:</label>
                <input
                    type="date"
                    name="registrationDate"
                    value={client.registrationDate}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-buttons">
                <button type="submit">등록</button>
                <button type="button" onClick={() => { onCancel(); setClient({ status: '신규', name: '', topic: '', affiliation: '', contact: '', gender: '', age: '', registrationDate: new Date().toISOString().split('T')[0] }); }}>취소</button>
            </div>
        </form>
    );
}

export default ClientRegistrationForm;
