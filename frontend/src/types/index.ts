import { ROLES, THEMES } from '@/config/constants';

// User types
export interface User {
  id: number;
  name: string;
  email: string;
  address?: string;
  role: Role;
  avg_rating?: number;
  created_at: string;
  updated_at: string;
}

// Store types
export interface Store {
  id: number;
  name: string;
  email: string;
  address?: string;
  owner_id?: number;
  owner_name?: string;
  avg_rating?: number;
  total_ratings?: number;
  user_rating?: number;
  user_rating_id?: number;
  created_at: string;
  updated_at: string;
}

// Rating types
export interface Rating {
  id: number;
  user_id: number;
  store_id: number;
  rating: number;
  created_at: string;
  updated_at: string;
  user_name?: string;
  store_name?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  address?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

// Form types
export interface FormFieldProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

// Component types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'admin' | 'user' | 'store_owner';
  className?: string;
  children: React.ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  children: React.ReactNode;
}

// Table types
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (row: T) => React.ReactNode;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  total?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onPageChange?: (page: number) => void;
  onSort?: (field: string) => void;
  emptyMessage?: string;
  className?: string;
}

// Query types
export interface QueryFilters {
  [key: string]: string | number | boolean | undefined;
}

export interface SortOptions {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

// Dashboard types
export interface AdminDashboardStats {
  totalUsers: number;
  totalAdmins: number;
  totalStores: number;
  totalRatings: number;
  avgRating: number;
}

export interface OwnerRater {
  id: number;
  name: string;
  email: string;
  rating: number;
  updated_at: string;
}

export interface OwnerDashboardData {
  store: Store;
  avg_rating: number;
  total_ratings: number;
  distribution: Record<number, number>;
  raters: OwnerRater[];
}

export interface UserDetail extends User {
  store_id?: number;
  store_name?: string;
  avg_rating?: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

// Theme types
export type Role = typeof ROLES[keyof typeof ROLES];
export type Theme = typeof THEMES[keyof typeof THEMES];

// Utility types
export type WithClassName<T = {}> = T & { className?: string };
export type WithChildren<T = {}> = T & { children: React.ReactNode };
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = 
  Pick<T, Exclude<keyof T, Keys>> & 
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>> }[Keys];

// Event types
export interface SearchEvent {
  query: string;
  filters?: QueryFilters;
}

export interface SortEvent {
  field: string;
  direction: 'asc' | 'desc';
}

// Error types
export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}