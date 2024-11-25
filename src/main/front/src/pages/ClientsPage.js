import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import ClientTable from '../components/ClientTable';
import ClientRegistrationForm from '../components/ClientRegistrationForm';
import Modal from '../components/ClientRegistrationModal'; // 모달 컴포넌트 추가
import { ReactComponent as RegisterButtonSVG } from "../assets/RegisterButton.svg"; // 등록 버튼 SVG
import "./RegisterButton.css";
import './ClientsPage.css';

function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [showRegistrationForm, setShowRegistrationForm] = useState(false);

    // Axios 기본 설정에 Authorization 헤더 추가
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, []);

    // 내담자 데이터 가져오기
    const fetchClients = async () => {
        try {
            const response = await axios.get('/api/clients/assigned-clients');
            const fetchedClients = response.data.data;
            setClients(fetchedClients);
            setFilteredClients(fetchedClients);
        } catch (error) {
            console.error('내담자 데이터를 가져오는 중 오류 발생:', error.response || error.message);
            alert(
                error.response?.data?.message || '내담자 데이터를 가져오는 중 오류가 발생했습니다.'
            );
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    // 검색 필터 처리
    const handleSearch = (searchTerm) => {
        const filtered = clients.filter((client) =>
            Object.values(client).some((value) =>
                value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredClients(filtered);
    };

    // 내담자 등록 처리
    const handleRegistrationSubmit = async (newClient) => {
        try {
            console.log('Client data being sent:', newClient);

            // API 요청
            const response = await axios.post('/api/clients', newClient, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            alert('내담자 등록 성공!');
        } catch (error) {
            console.error('내담자를 등록하는 중 오류 발생:', error.response || error.message);
            alert(error.response?.data?.message || '내담자를 등록하는 중 오류가 발생했습니다.');
        } finally {
            setShowRegistrationForm(false);
            fetchClients(); // 등록 후 데이터 다시 가져오기
        }
    };

    // 폼 닫기 처리
    const handleRegistrationCancel = () => {
        setShowRegistrationForm(false);
        fetchClients(); // 모달 닫을 때 데이터 다시 가져오기
    };

    // 내담자 등록 폼 열기
    const handleAddClient = () => {
        setShowRegistrationForm(true);
    };

    return (
        <div className="container">
            <div className="controls">
                <SearchBar onSearch={handleSearch} />
                {/* 등록 버튼 */}
                <div className="register-button-container" onClick={handleAddClient}>
                    <RegisterButtonSVG className="register-button-svg" />
                </div>
            </div>

            {/* 모달로 폼 렌더링 */}
            <Modal isOpen={showRegistrationForm} onClose={handleRegistrationCancel}>
                <ClientRegistrationForm
                    onSubmit={handleRegistrationSubmit}
                    onCancel={handleRegistrationCancel}
                />
            </Modal>

            <ClientTable clients={filteredClients} />
        </div>
    );
}

export default ClientsPage;
