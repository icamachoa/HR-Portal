import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import PublicJobsView from './components/PublicJobsView';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import { Admin } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<Admin | null>(null);
  const [view, setView] = useState<'public' | 'login' | 'register' | 'forgotPassword'>('public');

  const handleLoginSuccess = useCallback((admin: Admin) => {
    setCurrentUser(admin);
    setView('public');
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
  }, []);
  
  const openLoginModal = () => setView('login');
  const openRegisterModal = () => setView('register');
  const openForgotPasswordModal = () => setView('forgotPassword');
  const closeModal = () => setView('public');


  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans text-gray-800">
      <Header 
        currentUser={currentUser} 
        onLoginClick={openLoginModal}
        onRegisterClick={openRegisterModal}
        onLogoutClick={handleLogout}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        {currentUser ? <AdminDashboard currentUser={currentUser} /> : <PublicJobsView />}
      </main>
      <Footer />

      {view === 'login' && <LoginModal onSuccess={handleLoginSuccess} onSwitchToRegister={openRegisterModal} onForgotPassword={openForgotPasswordModal} onClose={closeModal} />}
      {view === 'register' && <RegisterModal onSuccess={handleLoginSuccess} onSwitchToLogin={openLoginModal} onClose={closeModal} />}
      {view === 'forgotPassword' && <ForgotPasswordModal onSwitchToLogin={openLoginModal} onClose={closeModal} />}
    </div>
  );
};

export default App;