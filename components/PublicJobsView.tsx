import React, { useState, useEffect, useMemo } from 'react';
import { getPublicVacancies } from '../services/mockApi';
import { JobVacancy } from '../types';
import { JobCard } from './JobCard';
import { Modal } from './Modal';
import { ApplicationForm } from './ApplicationForm';
import { FilterIcon } from './icons/FilterIcon';

const PublicJobsView: React.FC = () => {
  const [vacancies, setVacancies] = useState<JobVacancy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedVacancy, setSelectedVacancy] = useState<JobVacancy | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  useEffect(() => {
    const fetchVacancies = async () => {
      setLoading(true);
      const data = await getPublicVacancies();
      setVacancies(data);
      setLoading(false);
    };
    fetchVacancies();
  }, []);

  const categories = useMemo(() => {
    const allCategories = vacancies.map(v => v.category);
    return ['All', ...Array.from(new Set(allCategories))];
  }, [vacancies]);

  const filteredVacancies = useMemo(() => {
    return vacancies.filter(vacancy => {
      const matchesSearch = vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) || vacancy.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || vacancy.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [vacancies, searchTerm, categoryFilter]);

  const handleApplyClick = (vacancy: JobVacancy) => {
    setSelectedVacancy(vacancy);
  };

  const closeModal = () => {
    setSelectedVacancy(null);
  };

  if (loading) {
    return <div className="text-center p-10">Cargando vacantes...</div>;
  }

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Encuentra tu próximo desafío</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Buscar por título o palabra clave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="col-span-1 md:col-span-2 p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          <div className="relative">
            <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-3 pl-10 bg-gray-50 border border-gray-300 rounded-md appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat === 'All' ? 'Todas las categorías' : cat}</option>)}
            </select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVacancies.length > 0 ? (
          filteredVacancies.map(vacancy => (
            <JobCard key={vacancy.id} vacancy={vacancy} onApplyClick={handleApplyClick} />
          ))
        ) : (
          <p className="md:col-span-3 text-center text-gray-500">No se encontraron vacantes con los criterios actuales.</p>
        )}
      </div>

      {selectedVacancy && (
        <Modal title={`Aplicar para: ${selectedVacancy.title}`} onClose={closeModal}>
          <ApplicationForm vacancy={selectedVacancy} onFormSubmit={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default PublicJobsView;