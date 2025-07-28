import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search, Eye, Edit, Trash2, Database, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_PERMISSIONS } from '@/types/auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow, differenceInDays } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const DomainTable: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  if (!user) return null;

  const permissions = ROLE_PERMISSIONS[user.role];

  const { data: domains, isLoading, refetch } = useQuery({
    queryKey: ['domains', searchTerm],
    queryFn: async () => {
      let query = supabase.from('domains').select('*');
      
      if (searchTerm) {
        query = query.ilike('domain_name', `%${searchTerm}%`);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const getStatusBadge = (status: string, expireDate: string) => {
    const daysUntilExpiry = differenceInDays(new Date(expireDate), new Date());
    
    if (status === 'expired') {
      return 'bg-destructive/10 text-destructive';
    }
    
    if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
      return 'bg-warning/10 text-warning';
    }
    
    if (status === 'active') {
      return 'bg-success/10 text-success';
    }
    
    return 'bg-muted text-muted-foreground';
  };

  const getStatusText = (status: string, expireDate: string) => {
    const daysUntilExpiry = differenceInDays(new Date(expireDate), new Date());
    
    if (status === 'expired') {
      return 'Expired';
    }
    
    if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
      return 'Expiring Soon';
    }
    
    if (status === 'active') {
      return 'Active';
    }
    
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleAction = async (action: string, domainId: string) => {
    toast({
      title: "Action triggered",
      description: `${action} action for domain ${domainId}`,
    });
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

  const filteredDomains = domains?.filter(domain =>
    domain.domain_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    domain.registrar.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Domains</h2>
          <p className="text-muted-foreground">Manage domain registrations and DNS settings</p>
        </div>
        
        {permissions.domains.create && (
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Domain</span>
          </Button>
        )}
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>All Domains</span>
            </CardTitle>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search domains..."
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
                  <TableHead>Domain</TableHead>
                  <TableHead>Registrar</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDomains.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No domains found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDomains.map((domain) => (
                    <TableRow key={domain.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Database className="h-4 w-4 text-muted-foreground" />
                          <span>{domain.domain_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{domain.registrar}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(domain.status, domain.expire_date)}>
                          {getStatusText(domain.status, domain.expire_date)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDistanceToNow(new Date(domain.register_date))} ago
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(domain.expire_date).toLocaleDateString()}
                          </span>
                          {differenceInDays(new Date(domain.expire_date), new Date()) <= 30 && (
                            <AlertTriangle className="h-4 w-4 text-warning" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleAction('view', domain.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {permissions.domains.update && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleAction('edit', domain.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {permissions.domains.delete && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleAction('delete', domain.id)}
                            >
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

export default DomainTable;