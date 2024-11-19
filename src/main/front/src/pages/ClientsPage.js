import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import ClientTable from '../components/ClientTable';
import ClientRegistrationForm from '../components/ClientRegistrationForm';

function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [counselorName, setCounselorName] = useState('');

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
  useEffect(() => {
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
      console.log('Submitting new client data:', newClient);

      // counselingTopics를 문자열로 변환
      const formattedClient = {
        ...newClient,
        counselingTopics: Array.isArray(newClient.counselingTopics)
            ? newClient.counselingTopics.join(',') // 배열을 문자열로 변환
            : newClient.counselingTopics, // 이미 문자열이면 그대로 사용
      };

      console.log('Formatted client data:', formattedClient);

      // JWT 토큰 가져오기
      const token = localStorage.getItem('token');
      if (!token) {
        alert('인증 토큰이 없습니다. 다시 로그인하세요.');
        return;
      }

      // JWT 포함한 POST 요청
      const response = await axios.post('/api/clients', formattedClient, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const savedClient = response.data.data;

      setClients((prevClients) => [...prevClients, savedClient]);
      setFilteredClients((prevFiltered) => [...prevFiltered, savedClient]);

      alert('내담자 등록 성공!');
    } catch (error) {
      console.error('내담자를 등록하는 중 오류 발생:', error.response || error.message);
      alert(error.response?.data?.message || '내담자를 등록하는 중 오류가 발생했습니다.');
    }
    setShowRegistrationForm(false);
  };

  // 폼 닫기 처리
  const handleRegistrationCancel = () => setShowRegistrationForm(false);

  // 내담자 등록 폼 열기
  const handleAddClient = () => {
    setShowRegistrationForm(true);
  };

  return (
      <div className="container">
        <Header counselorName={counselorName} />
        <div className="controls">
          <SearchBar onSearch={handleSearch} />
          <button className="add-client" onClick={handleAddClient}>
            내담자 등록
          </button>
        </div>
        {showRegistrationForm && (
            <ClientRegistrationForm
                onSubmit={handleRegistrationSubmit}
                onCancel={handleRegistrationCancel}
            />
        )}
        <ClientTable clients={filteredClients} />
      </div>
  );
}

export default ClientsPage;
