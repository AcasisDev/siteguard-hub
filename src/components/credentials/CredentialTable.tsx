import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search, Eye, Edit, Trash2, Key, EyeOff } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_PERMISSIONS } from '@/types/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import AddCredentialForm from './AddCredentialForm';

const CredentialTable: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  if (!user) return null;

  const permissions = ROLE_PERMISSIONS[user.role];

  const { data: credentials, isLoading, refetch } = useQuery({
    queryKey: ['credentials', searchTerm],
    queryFn: async () => {
      let query = supabase.from('credentials').select('*, websites(name, domain)');
      
      if (searchTerm) {
        query = query.or(`host.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%,type.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['credentials'] });
    refetch();
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      ftp: 'bg-info/10 text-info',
      smtp: 'bg-success/10 text-success',
      cpanel: 'bg-warning/10 text-warning',
      database: 'bg-destructive/10 text-destructive',
      ssh: 'bg-muted text-muted-foreground',
      admin: 'bg-accent/10 text-accent-foreground',
      other: 'bg-accent/10 text-accent-foreground',
    };
    
    return variants[type as keyof typeof variants] || 'bg-accent/10 text-accent-foreground';
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-64" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredCredentials = credentials?.filter(credential =>
    credential.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
    credential.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    credential.type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Credentials</h2>
          <p className="text-muted-foreground">Secure access credentials management</p>
        </div>
        
        {permissions.credentials.create && (
          <Button 
            className="flex items-center space-x-2"
            onClick={() => setIsAddFormOpen(true)}
          >
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

      <AddCredentialForm
        open={isAddFormOpen}
        onOpenChange={setIsAddFormOpen}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default CredentialTable;