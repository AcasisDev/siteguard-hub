import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search, Eye, Edit, Trash2, Key, EyeOff } from 'lucide-react';
import { Credential } from '@/types/data';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_PERMISSIONS } from '@/types/auth';

const CredentialTable: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());

  if (!user) return null;

  const permissions = ROLE_PERMISSIONS[user.role];

  // Mock data
  const credentials: Credential[] = [
    {
      id: '1',
      websiteId: '1',
      type: 'ftp',
      host: 'ftp.example.com',
      username: 'admin',
      password: 'SecurePass123!',
      port: 21,
      notes: 'Main FTP access',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
    },
    {
      id: '2',
      websiteId: '1',
      type: 'smtp',
      host: 'smtp.gmail.com',
      username: 'noreply@example.com',
      password: 'EmailPass456!',
      port: 587,
      notes: 'Email sending service',
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-18T16:45:00Z',
    },
    {
      id: '3',
      websiteId: '2',
      type: 'cpanel',
      host: 'cpanel.example.com',
      username: 'cpanel_user',
      password: 'CpanelSecure789!',
      notes: 'Control panel access',
      createdAt: '2024-01-05T11:00:00Z',
      updatedAt: '2024-01-22T08:15:00Z',
    },
  ];

  const filteredCredentials = credentials.filter(credential =>
    credential.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
    credential.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    credential.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeBadge = (type: Credential['type']) => {
    const variants = {
      ftp: 'bg-info/10 text-info',
      smtp: 'bg-success/10 text-success',
      cpanel: 'bg-warning/10 text-warning',
      database: 'bg-destructive/10 text-destructive',
      ssh: 'bg-muted text-muted-foreground',
      other: 'bg-accent/10 text-accent-foreground',
    };
    
    return variants[type];
  };

  const togglePasswordVisibility = (id: string) => {
    const newVisible = new Set(visiblePasswords);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisiblePasswords(newVisible);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Credentials</h2>
          <p className="text-muted-foreground">Secure access credentials management</p>
        </div>
        
        {permissions.credentials.create && (
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Credential</span>
          </Button>
        )}
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5" />
              <span>All Credentials</span>
            </CardTitle>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search credentials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Host</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead>Port</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCredentials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No credentials found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCredentials.map((credential) => (
                    <TableRow key={credential.id}>
                      <TableCell>
                        <Badge className={getTypeBadge(credential.type)}>
                          {credential.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{credential.host}</TableCell>
                      <TableCell className="font-mono text-sm">{credential.username}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm">
                            {visiblePasswords.has(credential.id) 
                              ? credential.password 
                              : '••••••••'
                            }
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePasswordVisibility(credential.id)}
                            className="h-6 w-6 p-0"
                          >
                            {visiblePasswords.has(credential.id) ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {credential.port || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {permissions.credentials.update && (
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {permissions.credentials.delete && (
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CredentialTable;