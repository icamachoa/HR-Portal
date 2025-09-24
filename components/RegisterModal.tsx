import React, { useState } from 'react';
import { Modal } from './Modal';
import { registerAdmin } from '../services/mockApi';
import { Admin } from '../types';

interface RegisterModalProps {
  onSuccess: (admin: Admin) => void;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onSuccess, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const newAdmin = await registerAdmin(formData);
      onSuccess(newAdmin);
    } catch (e) {
      setError('Ocurrió un error durante el registro.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title="Registrar Nuevo Administrador" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Nombre completo" value={formData.name} onChange={handleChange} className="p-2 bg-gray-50 border border-gray-300 rounded-md" required />
            <input type="text" name="company" placeholder="Nombre de la empresa" value={formData.company} onChange={handleChange} className="p-2 bg-gray-50 border border-gray-300 rounded-md" required />
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="tel" name="phone" placeholder="Número de teléfono" value={formData.phone} onChange={handleChange} className="p-2 bg-gray-50 border border-gray-300 rounded-md" required />
            <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} className="p-2 bg-gray-50 border border-gray-300 rounded-md" required />
        </div>
        <div>
            <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} className="p-2 bg-gray-50 border border-gray-300 rounded-md w-full" required />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="pt-2">
            <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400">
                {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>
        </div>
         <p className="text-sm text-center text-gray-600">
            ¿Ya tiene una cuenta?{' '}
            <button type="button" onClick={onSwitchToLogin} className="font-medium text-blue-600 hover:underline">
                Inicie sesión aquí
            </button>
        </p>
      </form>
    </Modal>
  );
};

export default RegisterModal;