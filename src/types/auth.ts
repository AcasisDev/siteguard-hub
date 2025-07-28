export type UserRole = 'superadmin' | 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContext {
  user: User | null;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const ROLE_PERMISSIONS = {
  superadmin: {
    dashboard: true,
    websites: { create: true, read: true, update: true, delete: true },
    credentials: { create: true, read: true, update: true, delete: true },
    domains: { create: true, read: true, update: true, delete: true },
    servers: { create: true, read: true, update: true, delete: true },
    users: { create: true, read: true, update: true, delete: true }
  },
  admin: {
    dashboard: true,
    websites: { create: true, read: true, update: true, delete: true },
    credentials: { create: true, read: true, update: true, delete: true },
    domains: { create: true, read: true, update: true, delete: true },
    servers: { create: true, read: true, update: true, delete: true },
    users: { create: false, read: true, update: false, delete: false }
  },
  editor: {
    dashboard: true,
    websites: { create: true, read: true, update: true, delete: false },
    credentials: { create: true, read: true, update: true, delete: false },
    domains: { create: false, read: true, update: false, delete: false },
    servers: { create: false, read: true, update: false, delete: false },
    users: { create: false, read: false, update: false, delete: false }
  },
  viewer: {
    dashboard: true,
    websites: { create: false, read: true, update: false, delete: false },
    credentials: { create: false, read: true, update: false, delete: false },
    domains: { create: false, read: true, update: false, delete: false },
    servers: { create: false, read: true, update: false, delete: false },
    users: { create: false, read: false, update: false, delete: false }
  }
} as const;