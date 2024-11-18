// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header'; // Header 컴포넌트 임포트
import HomePage from './pages/HomePage';
import ClientsPage from './pages/ClientsPage';
import EmotionDashboard from './pages/EmotionDashboard';
import SignUpPage from './pages/SignUpPage';
import ProtectedRoute from './components/ProtectedRoute';
import UploadPage from './pages/UploadPage';
import FileAnalysisPage from "./pages/FileAnalysisPage";
import './App.css'; // App 전체 스타일

function App() {
    return (
        <Router>
            <div className="App">
                {/* 공통 Header */}
                <Header />
                
                {/* 페이지 콘텐츠 */}
                <div className="content-container">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="/upload" element={<UploadPage />} />
                        <Route path="/analysis" element={<FileAnalysisPage />} />
                        <Route
                            path="/clients"
                            element={
                                <ProtectedRoute>
                                    <ClientsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <EmotionDashboard />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
