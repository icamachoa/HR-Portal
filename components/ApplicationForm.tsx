
import React, { useState, useRef, useCallback } from 'react';
import { JobVacancy } from '../types';
import { addCandidate } from '../services/mockApi';
import { UploadIcon } from './icons/UploadIcon';

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
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const processFile = (file: File | undefined | null) => {
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (allowedTypes.includes(file.type)) {
      setCvFile(file);
      setError('');
    } else {
      setError('Formato de archivo no válido. Por favor suba PDF, DOC, DOCX, o TXT.');
      setCvFile(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFile(e.target.files?.[0]);
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }, [isDragging]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  }, []);

  const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCvFile(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
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
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
          className={`relative border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors duration-200 ease-in-out ${cvFile ? 'border-green-300 bg-green-50' : isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
        >
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
            />
             {cvFile ? (
                <div className="flex flex-col items-center justify-center">
                    <p className="text-sm font-medium text-gray-700">Archivo seleccionado:</p>
                    <p className="text-md font-semibold text-green-700 mt-1">{cvFile.name}</p>
                    <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="mt-3 bg-red-100 text-red-700 px-3 py-1 text-xs font-semibold rounded-full hover:bg-red-200"
                    >
                        Quitar archivo
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-gray-500">
                    <UploadIcon className="w-10 h-10 mx-auto text-gray-400" />
                    <p className="mt-2 font-semibold text-gray-700">Arrastre y suelte su archivo aquí</p>
                    <p className="text-sm">o <span className="text-blue-600 font-medium">haga clic para seleccionar</span></p>
                    <p className="text-xs text-gray-500 mt-2">Formatos permitidos: PDF, DOC, DOCX, TXT.</p>
                </div>
            )}
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400">
        {isSubmitting ? 'Enviando...' : 'Enviar Postulación'}
      </button>
    </form>
  );
};
