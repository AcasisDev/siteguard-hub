import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search, Eye, Edit, Trash2, Server, Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_PERMISSIONS } from '@/types/auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import AddServerForm from './AddServerForm';

const ServerTable: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  if (!user) return null;

  const permissions = ROLE_PERMISSIONS[user.role];

  const { data: servers, isLoading, refetch } = useQuery({
    queryKey: ['servers', searchTerm],
    queryFn: async () => {
      let query = supabase.from('servers').select('*, websites(name)');
      
      if (searchTerm) {
        query = query.or(`provider.ilike.%${searchTerm}%,ip_address.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['servers'] });
    refetch();
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      online: 'bg-success/10 text-success',
      offline: 'bg-destructive/10 text-destructive',
      maintenance: 'bg-warning/10 text-warning',
    };
    
    return variants[status as keyof typeof variants] || 'bg-muted text-muted-foreground';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return CheckCircle;
      case 'offline': return AlertCircle;
      case 'maintenance': return Clock;
      default: return Activity;
    }
  };

  const handleAction = async (action: string, serverId: string) => {
    toast({
      title: "Action triggered",
      description: `${action} action for server ${serverId}`,
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

  const filteredServers = servers?.filter(server =>
    server.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    server.ip_address.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Servers</h2>
          <p className="text-muted-foreground">Monitor and manage server infrastructure</p>
        </div>
        
        {permissions.servers.create && (
          <Button 
            className="flex items-center space-x-2"
            onClick={() => setIsAddFormOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Add Server</span>
          </Button>
        )}
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center space-x-2">
              <Server className="h-5 w-5" />
              <span>All Servers</span>
            </CardTitle>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search servers..."
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
                  <TableHead>Provider</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>SSH Access</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No servers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredServers.map((server) => {
                    const StatusIcon = getStatusIcon(server.status);
                    return (
                      <TableRow key={server.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Server className="h-4 w-4 text-muted-foreground" />
                            <span>{server.provider}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {server.ip_address}
                        </TableCell>
                        <TableCell>
                          {(server as any).websites?.name || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <StatusIcon className="h-4 w-4" />
                            <Badge className={getStatusBadge(server.status)}>
                              {server.status.charAt(0).toUpperCase() + server.status.slice(1)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {server.ssh_username ? (
                            <Badge variant="outline" className="text-xs bg-success/10 text-success">
                              Available
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              N/A
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDistanceToNow(new Date(server.created_at))} ago
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleAction('view', server.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {permissions.servers.update && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleAction('edit', server.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            {permissions.servers.delete && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleAction('delete', server.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddServerForm
        open={isAddFormOpen}
        onOpenChange={setIsAddFormOpen}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default ServerTable;