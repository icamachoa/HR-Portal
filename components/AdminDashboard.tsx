import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getAllVacancies, updateVacancy, getCandidatesForJob, addVacancy, getCompanies, deleteVacancy } from '../services/mockApi';
import { JobVacancy, Candidate, JobStatus, Admin, Company } from '../types';
import { Modal } from './Modal';
import { PlusIcon } from './icons/PlusIcon';
import { PencilIcon } from './icons/PencilIcon';
import { EyeIcon } from './icons/EyeIcon';
import { UserGroupIcon } from './icons/UserGroupIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { OfficeBuildingIcon } from './icons/OfficeBuildingIcon';
import { TrashIcon } from './icons/TrashIcon';
import AdminManagement from './AdminManagement';
import CompanyManagement from './CompanyManagement';

const VacancyForm: React.FC<{
  initialData?: JobVacancy | null;
  currentUser: Admin;
  companies: Company[];
  onSubmit: (vacancy: Omit<JobVacancy, 'id'> | JobVacancy) => void;
  onCancel: () => void;
}> = ({ initialData, currentUser, companies, onSubmit, onCancel }) => {
  const [vacancy, setVacancy] = useState({
    title: initialData?.title || '',
    category: initialData?.category || '',
    location: initialData?.location || '',
    type: initialData?.type || 'Tiempo completo',
    description: initialData?.description || '',
    requirements: initialData?.requirements?.join('\n') || '',
    status: initialData?.status || JobStatus.Active,
    companyId: initialData?.companyId || currentUser.companyId,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVacancy(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const processedVacancy = {
        ...vacancy,
        requirements: vacancy.requirements.split('\n').filter(r => r.trim() !== '')
    };
    if (initialData) {
        onSubmit({ ...initialData, ...processedVacancy });
    } else {
        onSubmit(processedVacancy);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {currentUser.role === 'Super Admin' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Compañía</label>
          <select name="companyId" value={vacancy.companyId} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2" required>
            <option value="" disabled>Seleccione una compañía</option>
            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">Título del puesto</label>
        <input type="text" name="title" value={vacancy.title} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2" required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Categoría</label>
          <input type="text" name="category" value={vacancy.category} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ubicación</label>
          <input type="text" name="location" value={vacancy.location} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2" required />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de contrato</label>
          <select name="type" value={vacancy.type} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2">
            <option>Tiempo completo</option>
            <option>Medio tiempo</option>
            <option>Contrato</option>
          </select>
        </div>
         <div>
          <label className="block text-sm font-medium text-gray-700">Estado</label>
          <select name="status" value={vacancy.status} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2">
            <option>{JobStatus.Active}</option>
            <option>{JobStatus.Inactive}</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea name="description" value={vacancy.description} onChange={handleChange} rows={4} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2"></textarea>
      </div>
       <div>
        <label className="block text-sm font-medium text-gray-700">Requisitos (uno por línea)</label>
        <textarea name="requirements" value={vacancy.requirements} onChange={handleChange} rows={4} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2"></textarea>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">{initialData ? 'Actualizar' : 'Crear'} Vacante</button>
      </div>
    </form>
  );
};


const CandidateDetailsModal: React.FC<{ candidate: Candidate; onClose: () => void }> = ({ candidate, onClose }) => {
    return (
        <Modal title="Detalles del Candidato" onClose={onClose}>
            <div className="space-y-4">
                <p><strong>Nombre:</strong> {candidate.fullName}</p>
                <p><strong>Título Profesional:</strong> {candidate.professionalTitle}</p>
                <p><strong>Años de Experiencia:</strong> {candidate.yearsOfExperience}</p>
                <p><strong>Ubicación:</strong> {candidate.location}</p>
                <p><strong>Email:</strong> <a href={`mailto:${candidate.email}`} className="text-blue-500 hover:underline">{candidate.email}</a></p>
                <p><strong>Teléfono:</strong> {candidate.phone}</p>
                <p><strong>Fecha de postulación:</strong> {new Date(candidate.applicationDate).toLocaleDateString()}</p>
                <p><strong>CV:</strong> <span className="text-blue-500">{candidate.cvFileName}</span> (Funcionalidad de descarga no implementada en la maqueta)</p>
            </div>
        </Modal>
    );
};

const VacanciesView: React.FC<{ currentUser: Admin }> = ({ currentUser }) => {
    const [allVacancies, setAllVacancies] = useState<JobVacancy[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loadingVacancies, setLoadingVacancies] = useState(true);
    const [loadingCandidates, setLoadingCandidates] = useState(false);
    const [selectedVacancy, setSelectedVacancy] = useState<JobVacancy | null>(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingVacancy, setEditingVacancy] = useState<JobVacancy | null>(null);
    const [viewingCandidate, setViewingCandidate] = useState<Candidate | null>(null);
    const [vacancyCandidatesCount, setVacancyCandidatesCount] = useState<Record<string, number>>({});
    const [vacancyToDelete, setVacancyToDelete] = useState<JobVacancy | null>(null);

    const companyMap = useMemo(() => {
        return companies.reduce((acc, company) => {
            acc[company.id] = company.name;
            return acc;
        }, {} as Record<string, string>);
    }, [companies]);

    const fetchAllData = useCallback(async () => {
        setLoadingVacancies(true);
        const [vacanciesData, companiesData] = await Promise.all([getAllVacancies(), getCompanies()]);
        
        setAllVacancies(vacanciesData);
        setCompanies(companiesData);
        setLoadingVacancies(false);

        for (const vacancy of vacanciesData) {
            const jobCandidates = await getCandidatesForJob(vacancy.id);
            setVacancyCandidatesCount(prev => ({...prev, [vacancy.id]: jobCandidates.length}));
        }
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const filteredVacancies = useMemo(() => {
        if (currentUser.role === 'Super Admin') {
            return allVacancies;
        }
        return allVacancies.filter(v => v.companyId === currentUser.companyId);
    }, [allVacancies, currentUser]);


    const handleSelectVacancy = async (vacancy: JobVacancy) => {
        setSelectedVacancy(vacancy);
        setLoadingCandidates(true);
        const data = await getCandidatesForJob(vacancy.id);
        setCandidates(data);
        setLoadingCandidates(false);
    };

    const handleToggleStatus = async (vacancy: JobVacancy) => {
        const newStatus = vacancy.status === JobStatus.Active ? JobStatus.Inactive : JobStatus.Active;
        const updatedVacancy = await updateVacancy(vacancy.id, { status: newStatus });
        if (updatedVacancy) {
            setAllVacancies(prev => prev.map(v => v.id === vacancy.id ? updatedVacancy : v));
        }
    };
    
    const handleOpenFormModal = (vacancy: JobVacancy | null) => {
        setEditingVacancy(vacancy);
        setIsFormModalOpen(true);
    };

    const handleFormSubmit = async (data: Omit<JobVacancy, 'id'> | JobVacancy) => {
        if ('id' in data) { // Editing
            await updateVacancy(data.id, data);
        } else { // Creating
            await addVacancy(data);
        }
        await fetchAllData();
        setIsFormModalOpen(false);
        setEditingVacancy(null);
    };
    
    const handleDeleteVacancy = async () => {
        if (!vacancyToDelete) return;
        const success = await deleteVacancy(vacancyToDelete.id);
        if (success) {
            await fetchAllData();
            if (selectedVacancy?.id === vacancyToDelete.id) {
                setSelectedVacancy(null);
                setCandidates([]);
            }
        } else {
            alert('No se pudo eliminar la vacante. Intente de nuevo.');
        }
        setVacancyToDelete(null);
    };

     return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-700">Gestionar Vacantes</h2>
                    <button onClick={() => handleOpenFormModal(null)} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Nueva Vacante
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3">Puesto</th>
                                {currentUser.role === 'Super Admin' && <th className="p-3">Compañía</th>}
                                <th className="p-3">Estado</th>
                                <th className="p-3">Postulantes</th>
                                <th className="p-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingVacancies ? (
                                <tr><td colSpan={currentUser.role === 'Super Admin' ? 5 : 4} className="p-4 text-center">Cargando...</td></tr>
                            ) : (
                                filteredVacancies.map(v => (
                                    <tr key={v.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-medium">{v.title}<br/><span className="text-sm text-gray-500">{v.category}</span></td>
                                        {currentUser.role === 'Super Admin' && <td className="p-3 text-sm text-gray-600">{companyMap[v.companyId] || v.companyId}</td>}
                                        <td className="p-3">
                                            <span onClick={() => handleToggleStatus(v)} className={`cursor-pointer px-3 py-1 text-sm rounded-full ${v.status === JobStatus.Active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{v.status}</span>
                                        </td>
                                        <td className="p-3 text-center">{vacancyCandidatesCount[v.id] || 0}</td>
                                        <td className="p-3 flex items-center space-x-2">
                                            <button onClick={() => handleSelectVacancy(v)} title="Ver Postulantes" className="p-2 text-gray-500 hover:text-blue-600"><EyeIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleOpenFormModal(v)} title="Editar Vacante" className="p-2 text-gray-500 hover:text-green-600"><PencilIcon className="w-5 h-5"/></button>
                                            <button onClick={() => setVacancyToDelete(v)} title="Eliminar Vacante" className="p-2 text-gray-500 hover:text-red-600"><TrashIcon className="w-5 h-5"/></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center">
                   <UserGroupIcon className="w-6 h-6 mr-2" />
                    Postulantes
                </h2>
                {selectedVacancy ? (
                    <div>
                        <h3 className="font-bold text-lg mb-3">{selectedVacancy.title}</h3>
                        {loadingCandidates ? <p>Cargando postulantes...</p> : (
                            <ul className="space-y-3 max-h-[60vh] overflow-y-auto">
                                {candidates.length > 0 ? candidates.map(c => (
                                    <li key={c.id} onClick={() => setViewingCandidate(c)} className="p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-blue-100 transition">
                                        <p className="font-semibold">{c.fullName}</p>
                                        <p className="text-sm text-gray-600">{c.professionalTitle}</p>
                                    </li>
                                )) : <p className="text-gray-500">No hay postulantes para esta vacante.</p>}
                            </ul>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                        <EyeIcon className="w-16 h-16 text-gray-300 mb-4" />
                        <p>Seleccione una vacante para ver a los postulantes.</p>
                    </div>
                )}
            </div>

            {isFormModalOpen && (
                <Modal title={editingVacancy ? 'Editar Vacante' : 'Crear Nueva Vacante'} onClose={() => setIsFormModalOpen(false)}>
                    <VacancyForm
                        initialData={editingVacancy}
                        currentUser={currentUser}
                        companies={companies}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setIsFormModalOpen(false)}
                    />
                </Modal>
            )}

            {viewingCandidate && (
                <CandidateDetailsModal candidate={viewingCandidate} onClose={() => setViewingCandidate(null)} />
            )}

            {vacancyToDelete && (
                <Modal title="Confirmar Eliminación" onClose={() => setVacancyToDelete(null)}>
                    <div>
                        <p className="text-gray-600 mb-6">
                            ¿Está seguro que desea eliminar la vacante "{vacancyToDelete.title}"? Esta acción eliminará también a todos sus postulantes y no se puede deshacer.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setVacancyToDelete(null)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
                            <button onClick={handleDeleteVacancy} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Eliminar</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}


const AdminDashboard: React.FC<{ currentUser: Admin }> = ({ currentUser }) => {
    const [activeTab, setActiveTab] = useState<'vacancies' | 'admins' | 'companies'>('vacancies');

    if (currentUser.role !== 'Super Admin') {
        return <VacanciesView currentUser={currentUser} />;
    }
    
    const renderTabContent = () => {
        switch (activeTab) {
            case 'vacancies':
                return <VacanciesView currentUser={currentUser} />;
            case 'admins':
                return <AdminManagement currentUser={currentUser} />;
            case 'companies':
                return <CompanyManagement />;
            default:
                return null;
        }
    }

    const getTabClass = (tabName: typeof activeTab) => 
        `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === tabName 
            ? 'bg-blue-600 text-white' 
            : 'text-black hover:bg-gray-200'
        }`;

    return (
        <div>
            <div className="mb-6 bg-white p-2 rounded-lg shadow-md inline-flex space-x-2">
                <button onClick={() => setActiveTab('vacancies')} className={getTabClass('vacancies')}>
                    <BriefcaseIcon className="w-5 h-5 mr-2" />
                    Vacantes
                </button>
                 <button onClick={() => setActiveTab('admins')} className={getTabClass('admins')}>
                    <ShieldCheckIcon className="w-5 h-5 mr-2" />
                    Administradores
                </button>
                 <button onClick={() => setActiveTab('companies')} className={getTabClass('companies')}>
                    <OfficeBuildingIcon className="w-5 h-5 mr-2" />
                    Compañías
                </button>
            </div>
            {renderTabContent()}
        </div>
    );
};

export default AdminDashboard;