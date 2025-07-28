export interface Website {
  id: string;
  name: string;
  domain: string;
  provider: string;
  serverIp: string;
  notes?: string;
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

export interface Credential {
  id: string;
  websiteId: string;
  type: 'ftp' | 'smtp' | 'cpanel' | 'database' | 'ssh' | 'other';
  host: string;
  username: string;
  password: string;
  port?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Domain {
  id: string;
  websiteId: string;
  domainName: string;
  registrar: string;
  registerDate: string;
  expireDate: string;
  nameservers: string[];
  status: 'active' | 'expired' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface Server {
  id: string;
  websiteId: string;
  provider: string;
  ipAddress: string;
  sshUsername?: string;
  sshPassword?: string;
  notes?: string;
  status: 'online' | 'offline' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteAccess {
  userId: string;
  websiteId: string;
  createdAt: string;
}