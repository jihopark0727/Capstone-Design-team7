// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ClientsPage from './pages/ClientsPage';
import EmotionDashboard from './pages/EmotionDashboard';
import SignUpPage from './pages/SignUpPage';
import ProtectedRoute from './components/ProtectedRoute'; // ProtectedRoute 임포트

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/signup" element={<SignUpPage />} />

                    {/* 보호된 라우트 */}
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
        </Router>
    );
}

export default App;
