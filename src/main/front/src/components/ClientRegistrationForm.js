import React, { useState } from 'react';

// ENUM 값 정의
const TOPIC_OPTIONS = [
    '가족',
    '친구',
    '직장',
    '학교',
    '진로',
    '연애',
    '우울',
    '불안',
    '스트레스',
    '재정 관리',
    '부부 갈등',
    '자기 계발',
    '중독',
];

function ClientRegistrationForm({ onSubmit, onCancel }) {
    const [client, setClient] = useState({
        registrationStatus: '신규',
        name: '',
        topic: '',
        contactNumber: '',
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

        const formattedClient = {
            ...client,
        };

        console.log('Formatted client data:', formattedClient); // 디버깅용
        onSubmit(formattedClient);

        // 폼 초기화
        setClient({
            registrationStatus: '신규',
            name: '',
            topic: '',
            contactNumber: '',
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
                <select name="registrationStatus" value={client.registrationStatus} onChange={handleChange}>
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
                <select
                    name="topic"
                    value={client.topic}
                    onChange={handleChange}
                    required
                >
                    <option value="">주제를 선택하세요</option>
                    {TOPIC_OPTIONS.map((topic) => (
                        <option key={topic} value={topic}>
                            {topic}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>연락처:</label>
                <input
                    type="tel"
                    name="contactNumber"
                    value={client.contactNumber}
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
                <input
                    type="number"
                    name="age"
                    value={client.age}
                    onChange={handleChange}
                    required
                />
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
            <button className="view-records-button" type="submit">등록</button>
        </form>
    );
}

export default ClientRegistrationForm;