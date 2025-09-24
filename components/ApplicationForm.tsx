
import React, { useState } from 'react';
import { JobVacancy } from '../types';
import { addCandidate } from '../services/mockApi';

interface ApplicationFormProps {
  vacancy: JobVacancy;
  onFormSubmit: () => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ vacancy, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    professionalTitle: '',
    yearsOfExperience: '',
    location: '',
    email: '',
    phone: '',
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if(allowedTypes.includes(file.type)) {
        setCvFile(file);
        setError('');
      } else {
        setError('Formato de archivo no válido. Por favor suba PDF, DOC, DOCX, o TXT.');
        setCvFile(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) {
      setError('Por favor, suba su hoja de vida (CV).');
      return;
    }
    setError('');
    setIsSubmitting(true);
    
    try {
      await addCandidate({
        jobId: vacancy.id,
        ...formData,
        yearsOfExperience: parseInt(formData.yearsOfExperience, 10),
        cvFile,
        cvFileName: cvFile.name,
      });
      alert('¡Aplicación enviada con éxito!');
      onFormSubmit();
    } catch (err) {
      setError('Hubo un error al enviar su aplicación. Por favor, intente de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" name="fullName" placeholder="Nombre completo" value={formData.fullName} onChange={handleChange} className="p-2 bg-gray-50 border border-gray-300 rounded-md" required />
        <input type="text" name="professionalTitle" placeholder="Título profesional" value={formData.professionalTitle} onChange={handleChange} className="p-2 bg-gray-50 border border-gray-300 rounded-md" required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="number" name="yearsOfExperience" placeholder="Años de experiencia" value={formData.yearsOfExperience} onChange={handleChange} className="p-2 bg-gray-50 border border-gray-300 rounded-md" required />
        <input type="text" name="location" placeholder="Ubicación (Ciudad, País)" value={formData.location} onChange={handleChange} className="p-2 bg-gray-50 border border-gray-300 rounded-md" required />
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} className="p-2 bg-gray-50 border border-gray-300 rounded-md" required />
        <input type="tel" name="phone" placeholder="Teléfono de contacto" value={formData.phone} onChange={handleChange} className="p-2 bg-gray-50 border border-gray-300 rounded-md" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Hoja de vida (CV)</label>
        <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" accept=".pdf,.doc,.docx,.txt" required />
        <p className="text-xs text-gray-500 mt-1">Formatos permitidos: PDF, DOC, DOCX, TXT.</p>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400">
        {isSubmitting ? 'Enviando...' : 'Enviar Postulación'}
      </button>
    </form>
  );
};