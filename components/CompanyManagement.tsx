import React, { useState, useEffect, useCallback } from 'react';
import { getCompanies, updateCompany, addCompany, deleteCompany } from '../services/mockApi';
import { Company, UserStatus } from '../types';
import { Modal } from './Modal';
import { PlusIcon } from './icons/PlusIcon';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';

const CompanyForm: React.FC<{
    initialData: Company | null;
    onSubmit: (data: { name: string }) => void;
    onCancel: () => void;
}> = ({ initialData, onSubmit, onCancel }) => {
    const [name, setName] = useState(initialData?.name || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name });
    };
    
    return (
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Nombre de la Compañía</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2" required />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">{initialData ? 'Actualizar' : 'Crear'} Compañía</button>
            </div>
        </form>
    )
}

const CompanyManagement: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState<Company | null>(null);
    const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
    const [companyToToggleStatus, setCompanyToToggleStatus] = useState<Company | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const companiesData = await getCompanies();
        setCompanies(companiesData);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenModal = (company: Company | null) => {
        setEditingCompany(company);
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (data: { name: string }) => {
        if (editingCompany) {
            await updateCompany(editingCompany.id, { name: data.name });
        } else {
            await addCompany(data);
        }
        fetchData();
        setIsModalOpen(false);
        setEditingCompany(null);
    }

    const handleToggleStatus = async () => {
        if (!companyToToggleStatus) return;
        const newStatus: UserStatus = companyToToggleStatus.status === 'Activo' ? 'Bloqueado' : 'Activo';
        await updateCompany(companyToToggleStatus.id, { status: newStatus });
        fetchData();
        setCompanyToToggleStatus(null);
    };
    
    const handleDelete = async () => {
        if (!companyToDelete) return;

        const result = await deleteCompany(companyToDelete.id);
        if (result.success) {
            fetchData();
        } else {
            alert(result.message || 'No se pudo eliminar la compañía. Verifique que no tenga administradores o vacantes asociadas.');
        }
        setCompanyToDelete(null);
    };

    if (loading) return <p>Cargando compañías...</p>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-700">Gestionar Compañías</h2>
                <button onClick={() => handleOpenModal(null)} className="flex items-center bg-blue-600 text-black px-4 py-2 rounded-md hover:bg-blue-700 transition">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Nueva Compañía
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-3 text-sm font-semibold text-black uppercase">Nombre de la Compañía</th>
                            <th className="p-3 text-sm font-semibold text-black uppercase">Estado</th>
                            <th className="p-3 text-sm font-semibold text-black uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map(company => (
                            <tr key={company.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 text-black font-medium">{company.name}</td>
                                <td className="p-3">
                                    <span className={`cursor-pointer px-3 py-1 text-sm rounded-full ${company.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`} onClick={() => setCompanyToToggleStatus(company)}>
                                        {company.status}
                                    </span>
                                </td>
                                <td className="p-3 flex items-center space-x-2">
                                     <button 
                                        onClick={() => setCompanyToToggleStatus(company)} 
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-md text-white ${company.status === 'Activo' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                                        {company.status === 'Activo' ? 'Bloquear' : 'Desbloquear'}
                                    </button>
                                    <button onClick={() => handleOpenModal(company)} title="Editar Nombre" className="p-2 text-gray-500 hover:text-green-600">
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => setCompanyToDelete(company)} title="Eliminar Compañía" className="p-2 text-gray-500 hover:text-red-600">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <Modal title={editingCompany ? 'Editar Compañía' : 'Crear Nueva Compañía'} onClose={() => setIsModalOpen(false)}>
                    <CompanyForm 
                        initialData={editingCompany}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </Modal>
            )}
            {companyToDelete && (
                <Modal title="Confirmar Eliminación" onClose={() => setCompanyToDelete(null)}>
                    <div>
                        <p className="text-gray-600 mb-6">
                            ¿Está seguro que desea eliminar la compañía "{companyToDelete.name}"? Esta acción no se puede deshacer. Solo se pueden eliminar compañías sin vacantes o administradores asociados.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setCompanyToDelete(null)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
                            <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Eliminar</button>
                        </div>
                    </div>
                </Modal>
            )}
            {companyToToggleStatus && (
                <Modal title="Confirmar Cambio de Estado" onClose={() => setCompanyToToggleStatus(null)}>
                    <div>
                        <p className="text-gray-600 mb-6">
                            ¿Está seguro que desea {companyToToggleStatus.status === 'Activo' ? 'bloquear' : 'desbloquear'} la compañía "{companyToToggleStatus.name}"?
                            {companyToToggleStatus.status === 'Activo' && ' Esto bloqueará a sus administradores y pondrá sus vacantes en estado inactivo.'}
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setCompanyToToggleStatus(null)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
                            <button onClick={handleToggleStatus} className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">Confirmar</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default CompanyManagement;