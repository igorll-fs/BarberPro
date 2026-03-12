// Types for BarberPro Web

export type UserRole = 'cliente' | 'dono' | 'funcionario' | 'dev';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  shopId?: string;
}

export interface Barbershop {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  photoUrl?: string;
  ownerUid: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description?: string;
  photoUrl?: string;
}

export interface Appointment {
  id: string;
  shopId: string;
  serviceId: string;
  serviceName: string;
  staffId?: string;
  staffName?: string;
  customerId: string;
  customerName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  price: number;
}

export interface Staff {
  uid: string;
  name: string;
  email?: string;
  photoUrl?: string;
  shopId: string;
}
