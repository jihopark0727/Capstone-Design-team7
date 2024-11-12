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
  const [editingClient, setEditingClient] = useState(null);
  const [counselorName, setCounselorName] = useState('');

  useEffect(() => {
    // 로그인된 상담사 정보 가져오기
    const fetchCounselorInfo = async () => {
      try {
        const response = await axios.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setCounselorName(response.data.data.name); // 상담사 이름 설정
      } catch (error) {
        console.error("상담사 정보를 가져오는 중 오류 발생:", error);
      }
    };

    const fetchClients = async () => {
      try {
        const response = await axios.get('/api/clients/counselor', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const fetchedClients = response.data.data;
        setClients(fetchedClients);
        setFilteredClients(fetchedClients);
      } catch (error) {
        console.error("내담자 데이터를 가져오는 중 오류 발생:", error);
        alert("내담자 데이터를 가져오는 중 오류가 발생했습니다.");
      }
    };

    fetchCounselorInfo();
    fetchClients();
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = clients.filter(client =>
        Object.values(client).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredClients(filtered);
  };

  const handleAddClient = () => {
    setShowRegistrationForm(true);
  };

  const handleRegistrationSubmit = async (newClient) => {
    try {
      const response = await axios.post('/api/clients', newClient);
      const savedClient = response.data.data;
      setClients([...clients, savedClient]);
      setFilteredClients([...clients, savedClient]);
    } catch (error) {
      console.error("내담자를 등록하는 중 오류 발생:", error);
      alert("내담자를 등록하는 중 오류가 발생했습니다.");
    }
    setShowRegistrationForm(false);
  };

  const handleRegistrationCancel = () => {
    setShowRegistrationForm(false);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
  };

  const handleEditSubmit = async (editedClient) => {
    try {
      const response = await axios.put(`/api/clients/${editedClient.id}`, editedClient);
      const updatedClient = response.data.data;
      const updatedClients = clients.map(c =>
          c.id === updatedClient.id ? updatedClient : c
      );
      setClients(updatedClients);
      setFilteredClients(updatedClients);
    } catch (error) {
      console.error("내담자 정보를 수정하는 중 오류 발생:", error);
      alert("내담자 정보를 수정하는 중 오류가 발생했습니다.");
    }
    setEditingClient(null);
  };

  const handleEditCancel = () => {
    setEditingClient(null);
  };

  return (
      <div className="container">
        <Header counselorName={counselorName} />
        <div className="controls">
          <SearchBar onSearch={handleSearch} />
          <button className="add-client" onClick={handleAddClient}>내담자 등록</button>
        </div>
        {showRegistrationForm && (
            <ClientRegistrationForm
                onSubmit={handleRegistrationSubmit}
                onCancel={handleRegistrationCancel}
            />
        )}
        {editingClient && (
            <ClientRegistrationForm
                client={editingClient}
                onSubmit={handleEditSubmit}
                onCancel={handleEditCancel}
            />
        )}
        <ClientTable
            clients={filteredClients}
            onEdit={handleEdit}
        />
      </div>
  );
}

export default ClientsPage;
