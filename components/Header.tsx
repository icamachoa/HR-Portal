import React from 'react';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { Admin } from '../types';

interface HeaderProps {
  currentUser: Admin | null;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onLogoutClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, onLoginClick, onRegisterClick, onLogoutClick }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <BriefcaseIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">HR Portal</h1>
        </div>
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              <span className="text-sm font-medium text-gray-600">Hola, {currentUser.name.split(' ')[0]} ({currentUser.role})</span>
              <button onClick={onLogoutClick} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 text-sm font-semibold transition-colors">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <button onClick={onLoginClick} className="text-gray-600 hover:text-blue-600 font-semibold text-sm transition-colors">
                Iniciar Sesión
              </button>
              <button onClick={onRegisterClick} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-semibold transition-colors">
                Registrarse
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
