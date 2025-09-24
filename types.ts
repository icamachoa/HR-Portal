export enum JobStatus {
  Active = 'Activa',
  Inactive = 'Inactiva',
}

export type AdminRole = 'Admin' | 'Super Admin';
export type UserStatus = 'Activo' | 'Bloqueado';

export interface Admin {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  companyId: string;
  role: AdminRole;
  status: UserStatus;
  password?: string; // Should not be sent to client
}

export interface Company {
  id: string;
  name: string;
  status: UserStatus;
}

export interface JobVacancy {
  id: string;
  title: string;
  category: string;
  description: string;
  requirements: string[];
  location: string;
  type: 'Tiempo completo' | 'Medio tiempo' | 'Contrato';
  status: JobStatus;
  companyId: string;
}

export interface Candidate {
  id: string;
  jobId: string;
  fullName: string;
  professionalTitle: string;
  yearsOfExperience: number;
  location: string;
  email: string;
  phone: string;
  cvFile: File | null;
  cvFileName: string;
  applicationDate: string;
}