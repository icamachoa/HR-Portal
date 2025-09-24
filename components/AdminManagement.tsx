import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getAdmins, updateAdmin, deleteAdmin, resetAdminPassword, getCompanies, addAdmin } from '../services/mockApi';
import { Admin, Company, AdminRole, UserStatus } from '../types';
import { Modal } from './Modal';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { PlusIcon } from './icons/PlusIcon';


const AdminForm: React.FC<{
  initialData: Admin | null;
  companies: Company[];
  onSubmit: (data: Partial<Admin>) => void;
  onCancel: () => void;
}> = ({ initialData, companies, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    companyId: initialData?.companyId || '',
    role: initialData?.role || 'Admin',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...updates } = formData; // don't submit password if empty
        onSubmit({ ...initialData, ...updates, ...(formData.password && { password: formData.password }) });
    } else {
        onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Nombre completo" value={formData.name} onChange={handleChange} className="p-2 bg-gray-50 border border-gray-300 rounded-md" required />
            <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} className="p-2 bg-gray-50 border border-gray-300 rounded-md" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="tel" name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} className="p-2 bg-gray-50 border border-gray-300 rounded-md" required />
            <select name="companyId" value={formData.companyId} onChange={handleChange} className="p-2 bg-gray-50 border border-gray-300 rounded-md" required>
                <option value="" disabled>Seleccione compañía</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <select name="role" value={formData.role} onChange={handleChange} className="p-2 bg-gray-50 border border-gray-300 rounded-md" required>
                <option value="Admin">Admin</option>
                <option value="Super Admin">Super Admin</option>
            </select>
            <input type="password" name="password" placeholder={initialData ? 'Nueva contraseña (opcional)' : 'Contraseña'} value={formData.password} onChange={handleChange} className="p-2 bg-gray-50 border border-gray-300 rounded-md" required={!initialData} />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">{initialData ? 'Actualizar' : 'Crear'} Administrador</button>
        </div>
    </form>
  )
}


const AdminManagement: React.FC<{ currentUser: Admin }> = ({ currentUser }) => {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

    const companyMap = useMemo(() => {
        return companies.reduce((acc, company) => {
            acc[company.id] = company.name;
            return acc;
        }, {} as Record<string, string>);
    }, [companies]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const [adminsData, companiesData] = await Promise.all([getAdmins(), getCompanies()]);
        setAdmins(adminsData.filter(a => a.id !== currentUser.id)); // Super admin cannot edit itself
        setCompanies(companiesData);
        setLoading(false);
    }, [currentUser.id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenModal = (admin: Admin | null) => {
        setEditingAdmin(admin);
        setIsModalOpen(true);
    }

    const handleFormSubmit = async (data: Partial<Admin>) => {
        if(editingAdmin) { // Update
            await updateAdmin(editingAdmin.id, data);
        } else { // Create
            await addAdmin(data as Omit<Admin, 'id' | 'status'>);
        }
        fetchData();
        setIsModalOpen(false);
        setEditingAdmin(null);
    }

    const handleToggleStatus = async (admin: Admin) => {
        const newStatus: UserStatus = admin.status === 'Activo' ? 'Bloqueado' : 'Activo';
        if (window.confirm(`¿Está seguro que desea ${newStatus === 'Activo' ? 'desbloquear' : 'bloquear'} a ${admin.name}?`)) {
            await updateAdmin(admin.id, { status: newStatus });
            fetchData();
        }
    };
    
    const handleDelete = async (adminId: string) => {
        if (window.confirm('¿Está seguro que desea eliminar este administrador? Esta acción no se puede deshacer.')) {
            await deleteAdmin(adminId);
            fetchData();
        }
    };
    
    const handleResetPassword = async (admin: Admin) => {
        if (window.confirm(`¿Está seguro que desea resetear la contraseña de ${admin.name}?`)) {
            await resetAdminPassword(admin.id);
            alert(`La contraseña para ${admin.name} ha sido reseteada a la predeterminada.`);
        }
    };
    
    if (loading) return <p>Cargando administradores...</p>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-700">Gestionar Administradores</h2>
                <button onClick={() => handleOpenModal(null)} className="flex items-center bg-blue-600 text-black px-4 py-2 rounded-md hover:bg-blue-700 transition">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Nuevo Administrador
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-3 text-sm font-semibold text-black uppercase">Nombre</th>
                            <th className="p-3 text-sm font-semibold text-black uppercase">Compañía</th>
                            <th className="p-3 text-sm font-semibold text-black uppercase">Email</th>
                            <th className="p-3 text-sm font-semibold text-black uppercase">Rol</th>
                            <th className="p-3 text-sm font-semibold text-black uppercase">Estado</th>
                            <th className="p-3 text-sm font-semibold text-black uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map(admin => (
                            <tr key={admin.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 text-black font-medium">{admin.name}</td>
                                <td className="p-3 text-black">{companyMap[admin.companyId] || 'N/A'}</td>
                                <td className="p-3 text-black">{admin.email}</td>
                                <td className="p-3 text-black">{admin.role}</td>
                                <td className="p-3">
                                    <span 
                                        onClick={() => handleToggleStatus(admin)}
                                        className={`cursor-pointer px-3 py-1 text-sm rounded-full ${admin.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {admin.status}
                                    </span>
                                </td>
                                <td className="p-3 flex items-center space-x-2">
                                    <button onClick={() => handleOpenModal(admin)} title="Editar" className="p-2 text-gray-500 hover:text-green-600"><PencilIcon className="w-5 h-5"/></button>
                                    <button onClick={() => handleResetPassword(admin)} title="Resetear Contraseña" className="p-2 text-gray-500 hover:text-orange-600"><LockClosedIcon className="w-5 h-5"/></button>
                                    <button onClick={() => handleDelete(admin.id)} title="Eliminar" className="p-2 text-gray-500 hover:text-red-600"><TrashIcon className="w-5 h-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <Modal title={editingAdmin ? 'Editar Administrador' : 'Crear Nuevo Administrador'} onClose={() => setIsModalOpen(false)}>
                    <AdminForm 
                        initialData={editingAdmin} 
                        companies={companies}
                        onSubmit={handleFormSubmit} 
                        onCancel={() => setIsModalOpen(false)} 
                    />
                </Modal>
            )}
        </div>
    );
};

export default AdminManagement;