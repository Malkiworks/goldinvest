import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import KycVerification from './pages/KycVerification';
import Investment from './pages/Investment';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={5000} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          
          <Route path="/kyc" element={
            <PrivateRoute>
              <KycVerification />
            </PrivateRoute>
          } />
          
          <Route path="/investments/:id" element={
            <PrivateRoute>
              <Investment />
            </PrivateRoute>
          } />
          
          <Route path="/admin" element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          } />
          
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App; 