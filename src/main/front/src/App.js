import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header'; // Header 컴포넌트 임포트
import HomePage from './pages/HomePage';
import ClientsPage from './pages/ClientsPage';
import EmotionDashboard from './pages/EmotionDashboard';
import SignUpPage from './pages/SignUpPage';
import LoginForm from './components/LoginForm'; // LoginForm 임포트
import ProtectedRoute from './components/ProtectedRoute';
import UploadPage from './pages/UploadPage';
import FileAnalysisPage from './pages/FileAnalysisPage';
import './App.css'; // App 전체 스타일

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token')); // 로그인 상태 관리
    const counselorName = localStorage.getItem('name'); // 상담사 이름 가져오기

    return (
        <Router>
            <div className="App">
                {/* 공통 Header */}
                <Header
                    isLoggedIn={isLoggedIn}
                    setIsLoggedIn={setIsLoggedIn}
                    counselorName={counselorName}
                />

                {/* 페이지 콘텐츠 */}
                <div className="content-container">
                    <Routes>
                        {/* 로그인 상태에 따라 리다이렉션 */}
                        <Route
                            path="/"
                            element={
                                isLoggedIn ? (
                                    <Navigate to="/upload" replace />
                                ) : (
                                    <HomePage setIsLoggedIn={setIsLoggedIn} />
                                )
                            }
                        />

                        <Route
                            path="/signup"
                            element={<SignUpPage />}
                        />
                        <Route
                            path="/login"
                            element={<LoginForm />}
                        />
                        <Route
                            path="/upload"
                            element={<UploadPage />}
                        />
                        <Route
                            path="/analysis"
                            element={<FileAnalysisPage />}
                        />
                        <Route
                            path="/clients"
                            element={
                                <ProtectedRoute isLoggedIn={isLoggedIn}>
                                    <ClientsPage />
                                </ProtectedRoute>
                            }
                        />
                        {/* 내담자별 대시보드 라우팅 */}
                        <Route
                            path="/dashboard/:clientId"
                            element={
                                <ProtectedRoute isLoggedIn={isLoggedIn}>
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