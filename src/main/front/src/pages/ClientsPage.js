import React, { useState } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import ClientTable from '../components/ClientTable';
import ClientRegistrationForm from '../components/ClientRegistrationForm';

// 리액트에서 상태관리는 어떤 라이브러리를 사용하시나요?

function ClientsPage() {
  const [clients, setClients] = useState([
    { status: "신규", name: "김철수", topic: "우울증", affiliation: "A대학교", contact: "010-1234-5678", gender: "남", age: 25, registrationDate: "2023-05-01" },
    { status: "진행중", name: "이영희", topic: "불안장애", affiliation: "B회사", contact: "010-2345-6789", gender: "여", age: 30, registrationDate: "2023-04-15" },
    // ... 기존 클라이언트 데이터
  ]);

  const [filteredClients, setFilteredClients] = useState(clients);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

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

  const handleRegistrationSubmit = (newClient) => {
    setClients([...clients, newClient]);
    setFilteredClients([...clients, newClient]);
    setShowRegistrationForm(false);
  };

  const handleRegistrationCancel = () => {
    setShowRegistrationForm(false);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
  };

  const handleEditSubmit = (editedClient) => {
    const updatedClients = clients.map(c => 
      c.name === editedClient.name ? editedClient : c
    );
    setClients(updatedClients);
    setFilteredClients(updatedClients);
    setEditingClient(null);
  };

  const handleEditCancel = () => {
    setEditingClient(null);
  };

  return (
    <div className="container">
      <Header />
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