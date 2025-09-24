import React, { useState } from 'react';
import { Modal } from './Modal';
import { login } from '../services/mockApi';
import { Admin } from '../types';

interface LoginModalProps {
  onSuccess: (admin: Admin) => void;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onSuccess, onClose, onSwitchToRegister, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if ('id' in result) {
        onSuccess(result);
      } else {
        setError(result.error);
      }
    } catch (e) {
      setError('Ocurrió un error. Por favor, inténtelo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title="Iniciar Sesión de Administrador" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <button type="button" onClick={onForgotPassword} className="text-sm text-blue-600 hover:underline">
              ¿Olvidó su contraseña?
            </button>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="pt-2">
            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
        </div>
        <p className="text-sm text-center text-gray-600">
            ¿No tiene una cuenta?{' '}
            <button type="button" onClick={onSwitchToRegister} className="font-medium text-blue-600 hover:underline">
                Regístrese aquí
            </button>
        </p>
      </form>
    </Modal>
  );
};

export default LoginModal;