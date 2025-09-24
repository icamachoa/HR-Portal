import React, { useState } from 'react';
import { Modal } from './Modal';
import { requestPasswordReset } from '../services/mockApi';

interface ForgotPasswordModalProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ onClose, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    try {
      await requestPasswordReset(email);
      setMessage('Si existe una cuenta con ese correo, se ha enviado un enlace para restablecer la contraseña.');
    } catch (e) {
      setMessage('Ocurrió un error. Por favor, inténtelo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title="Recuperar Contraseña" onClose={onClose}>
      {message ? (
         <div className="text-center">
            <p className="text-green-700 bg-green-100 p-3 rounded-md">{message}</p>
             <button onClick={onClose} className="mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700">
                Cerrar
            </button>
         </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-600">Introduzca su correo electrónico y le enviaremos instrucciones para restablecer su contraseña.</p>
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
            <div className="pt-2">
                <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                {isLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
                </button>
            </div>
            <p className="text-sm text-center text-gray-600">
                ¿Recuerda su contraseña?{' '}
                <button type="button" onClick={onSwitchToLogin} className="font-medium text-blue-600 hover:underline">
                    Iniciar sesión
                </button>
            </p>
        </form>
      )}
    </Modal>
  );
};

export default ForgotPasswordModal;