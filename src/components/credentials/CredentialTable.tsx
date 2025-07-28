import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Search, Eye, Edit, Trash2, Key, EyeOff, AlertCircle } from 'lucide-react';
import { Credential } from '@/types/data';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_PERMISSIONS } from '@/types/auth';
import { useCredentials } from '@/hooks/useCredentials';

const CredentialTable: React.FC = () => {
  const { user } = useAuth();
  const { credentials, loading, error } = useCredentials();
  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());

  if (!user) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You need to be logged in to view credentials.
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading credentials: {error}
        </AlertDescription>
      </Alert>
    );
  }

  const permissions = ROLE_PERMISSIONS[user.role];

  const filteredCredentials = credentials.filter(credential =>
    credential.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
    credential.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    credential.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeBadge = (type: string) => {
    const variants: Record<string, string> = {
      ftp: 'bg-info/10 text-info',
      smtp: 'bg-success/10 text-success',
      cpanel: 'bg-warning/10 text-warning',
      database: 'bg-destructive/10 text-destructive',
      ssh: 'bg-muted text-muted-foreground',
      other: 'bg-accent/10 text-accent-foreground',
    };
    
    return variants[type] || variants.other;
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
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-muted-foreground">Loading credentials...</div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Host</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Password</TableHead>
                    <TableHead>Port</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCredentials.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {credentials.length === 0 
                          ? "No credentials found. Add your first credential to get started." 
                          : "No credentials match your search."}
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
                        <TableCell className="font-mono text-sm">
                          {credential.websites?.name || 'Unknown'}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CredentialTable;