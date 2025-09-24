import { JobVacancy, Candidate, JobStatus, Admin, Company, UserStatus, AdminRole } from '../types';

let companies: Company[] = [
    { id: 'comp1', name: 'Tech Solutions Inc.', status: 'Activo' },
    { id: 'comp2', name: 'Innovate Creations', status: 'Activo' },
    { id: 'comp3', name: 'Marketing Masters', status: 'Activo' },
];

let admins: Admin[] = [
    { id: 'admin1', name: 'Alice Johnson', email: 'alice@techsolutions.com', phone: '111-222-3333', company: 'Tech Solutions Inc.', companyId: 'comp1', role: 'Admin', status: 'Activo', password: 'password123' },
    { id: 'admin2', name: 'Bob Williams', email: 'bob@innovate.com', phone: '444-555-6666', company: 'Innovate Creations', companyId: 'comp2', role: 'Admin', status: 'Activo', password: 'password123' },
    { id: 'admin3', name: 'Charlie Brown', email: 'charlie@techsolutions.com', phone: '111-222-4444', company: 'Tech Solutions Inc.', companyId: 'comp1', role: 'Admin', status: 'Bloqueado', password: 'password123' },
    { id: 'super1', name: 'Super Admin', email: 'super@admin.com', phone: '777-888-9999', company: 'Global Corp', companyId: 'corp0', role: 'Super Admin', status: 'Activo', password: 'superadmin' },
];

let vacancies: JobVacancy[] = [
  {
    id: '1',
    title: 'Ingeniero de Software Senior (React)',
    category: 'Tecnología',
    description: 'Buscamos un desarrollador de React experimentado para unirse a nuestro equipo de frontend. Serás responsable de construir interfaces de usuario complejas y de alto rendimiento.',
    requirements: ['5+ años de experiencia con React', 'TypeScript', 'Gestión de estado (Redux/Zustand)', 'Pruebas unitarias'],
    location: 'Remoto',
    type: 'Tiempo completo',
    status: JobStatus.Active,
    companyId: 'comp1',
  },
  {
    id: '2',
    title: 'Diseñador UI/UX',
    category: 'Diseño',
    description: 'Buscamos un diseñador UI/UX creativo para diseñar interfaces intuitivas y atractivas para nuestras aplicaciones web y móviles.',
    requirements: ['Portafolio sólido de proyectos de diseño', 'Experiencia con Figma/Sketch', 'Comprensión de los principios de diseño centrado en el usuario'],
    location: 'Ciudad de México',
    type: 'Tiempo completo',
    status: JobStatus.Active,
    companyId: 'comp2',
  },
  {
    id: '3',
    title: 'Gerente de Producto',
    category: 'Producto',
    description: 'Estamos contratando a un Gerente de Producto para liderar la estrategia y la hoja de ruta de uno de nuestros productos principales.',
    requirements: ['Experiencia previa como Gerente de Producto', 'Fuertes habilidades de comunicación', 'Experiencia en metodologías ágiles'],
    location: 'Remoto',
    type: 'Contrato',
    status: JobStatus.Inactive,
    companyId: 'comp1',
  },
   {
    id: '4',
    title: 'Especialista en Marketing Digital',
    category: 'Marketing',
    description: 'Buscamos un especialista en marketing para nuestra nueva campaña.',
    requirements: ['SEO', 'SEM', 'Redes Sociales'],
    location: 'Remoto',
    type: 'Tiempo completo',
    status: JobStatus.Active,
    companyId: 'comp3', // This vacancy belongs to a blocked company
  },
];

let candidates: Candidate[] = [
    { id: 'c1', jobId: '1', fullName: 'Ana García', professionalTitle: 'Desarrolladora Frontend', yearsOfExperience: 6, location: 'Madrid, España', email: 'ana.garcia@email.com', phone: '+34 123 456 789', cvFile: null, cvFileName: 'Ana_Garcia_CV.pdf', applicationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'c2', jobId: '1', fullName: 'Carlos Rodriguez', professionalTitle: 'Ingeniero de Software', yearsOfExperience: 8, location: 'Bogotá, Colombia', email: 'carlos.r@email.com', phone: '+57 310 123 4567', cvFile: null, cvFileName: 'Carlos_Rodriguez_HojaDeVida.docx', applicationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'c3', jobId: '2', fullName: 'Sofía Martínez', professionalTitle: 'Diseñadora de Experiencia de Usuario', yearsOfExperience: 4, location: 'Buenos Aires, Argentina', email: 'sofia.m@email.com', phone: '+54 9 11 1234 5678', cvFile: null, cvFileName: 'SofiaMartinez_Portfolio_CV.pdf', applicationDate: new Date().toISOString() },
];

const simulateDelay = <T,>(data: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), 500));

// --- Auth & Admin Management ---
export const login = async (email: string, password: string): Promise<Admin | { error: string }> => {
    const admin = admins.find(a => a.email.toLowerCase() === email.toLowerCase() && a.password === password);
    if (!admin) return simulateDelay({ error: 'Credenciales incorrectas.' });
    if (admin.status === 'Bloqueado') return simulateDelay({ error: 'Su cuenta ha sido bloqueada.' });
    
    const company = companies.find(c => c.id === admin.companyId);
    if (company && company.status === 'Bloqueado') return simulateDelay({ error: 'La compañía asociada a su cuenta ha sido bloqueada.' });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...adminWithoutPassword } = admin;
    return simulateDelay(adminWithoutPassword);
};

export const registerAdmin = async (data: Omit<Admin, 'id' | 'role' | 'companyId' | 'status'>): Promise<Admin> => {
    let company = companies.find(c => c.name.toLowerCase() === data.company.toLowerCase());
    if (!company) {
        company = { id: `comp${new Date().getTime()}`, name: data.company, status: 'Activo' };
        companies.push(company);
    }
    const newAdmin: Admin = { ...data, id: `admin${new Date().getTime()}`, role: 'Admin', status: 'Activo', companyId: company.id };
    admins.push(newAdmin);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...adminWithoutPassword } = newAdmin;
    return simulateDelay(adminWithoutPassword);
};

export const addAdmin = async (adminData: Omit<Admin, 'id' | 'status'>): Promise<Admin> => {
    const selectedCompany = companies.find(c => c.id === adminData.companyId);
    const newAdmin: Admin = {
      ...adminData,
      id: `admin${new Date().getTime()}`,
      status: 'Activo',
      company: selectedCompany?.name || 'N/A'
    };
    admins.push(newAdmin);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...adminWithoutPassword } = newAdmin;
    return simulateDelay(adminWithoutPassword);
};

export const getAdmins = async (): Promise<Admin[]> => {
    return simulateDelay(admins.map(({ password, ...rest }) => rest));
};

export const updateAdmin = async (id: string, updates: Partial<Omit<Admin, 'id' | 'password'>>): Promise<Admin | null> => {
    const index = admins.findIndex(a => a.id === id);
    if (index === -1) return simulateDelay(null);
    
    if (updates.companyId) {
        const company = companies.find(c => c.id === updates.companyId);
        updates.company = company?.name || admins[index].company;
    }

    admins[index] = { ...admins[index], ...updates };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...updatedAdmin } = admins[index];
    return simulateDelay(updatedAdmin);
};

export const deleteAdmin = async (id: string): Promise<boolean> => {
    const initialLength = admins.length;
    admins = admins.filter(a => a.id !== id);
    return simulateDelay(admins.length < initialLength);
};

export const resetAdminPassword = async (id: string): Promise<boolean> => {
    const index = admins.findIndex(a => a.id === id);
    if (index === -1) return simulateDelay(false);
    admins[index].password = 'password123'; // Reset to a default password
    console.log(`Password for ${admins[index].email} has been reset.`);
    return simulateDelay(true);
};

export const requestPasswordReset = async (email: string): Promise<boolean> => {
    console.log(`Password reset requested for ${email}. In a real app, an email would be sent.`);
    return simulateDelay(true);
};

// --- Company Management ---
export const getCompanies = async (): Promise<Company[]> => {
    return simulateDelay([...companies]);
};

export const addCompany = async (companyData: { name: string }): Promise<Company> => {
    const newCompany: Company = {
        id: `comp${new Date().getTime()}`,
        name: companyData.name,
        status: 'Activo',
    };
    companies.push(newCompany);
    return simulateDelay(newCompany);
};


export const updateCompany = async (id: string, updates: Partial<Omit<Company, 'id'>>): Promise<Company | null> => {
    const index = companies.findIndex(c => c.id === id);
    if (index === -1) return simulateDelay(null);
    companies[index] = { ...companies[index], ...updates };
    return simulateDelay(companies[index]);
};

// --- Vacancy API ---
export const getPublicVacancies = async (): Promise<JobVacancy[]> => {
    const activeCompanies = companies.filter(c => c.status === 'Activo').map(c => c.id);
    const publicVacancies = vacancies.filter(v => v.status === JobStatus.Active && activeCompanies.includes(v.companyId));
    return simulateDelay(publicVacancies);
}

export const getAllVacancies = async (): Promise<JobVacancy[]> => {
    return simulateDelay([...vacancies]);
};

export const getVacancy = async (id: string): Promise<JobVacancy | undefined> => {
    return simulateDelay(vacancies.find(v => v.id === id));
};

export const addVacancy = async (vacancyData: Omit<JobVacancy, 'id'>): Promise<JobVacancy> => {
    const newVacancy: JobVacancy = { ...vacancyData, id: new Date().getTime().toString() };
    vacancies.push(newVacancy);
    return simulateDelay(newVacancy);
};

export const updateVacancy = async (id: string, updates: Partial<JobVacancy>): Promise<JobVacancy | null> => {
    const index = vacancies.findIndex(v => v.id === id);
    if (index === -1) return simulateDelay(null);
    vacancies[index] = { ...vacancies[index], ...updates };
    return simulateDelay(vacancies[index]);
};

// --- Candidate API ---
export const getCandidatesForJob = async (jobId: string): Promise<Candidate[]> => {
    return simulateDelay(candidates.filter(c => c.jobId === jobId));
};

export const addCandidate = async (candidateData: Omit<Candidate, 'id' | 'applicationDate'>): Promise<Candidate> => {
    const newCandidate: Candidate = { ...candidateData, id: `c${new Date().getTime()}`, applicationDate: new Date().toISOString() };
    candidates.push(newCandidate);
    return simulateDelay(newCandidate);
};