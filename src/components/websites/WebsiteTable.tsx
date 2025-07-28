import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search, Eye, Edit, Trash2, Globe } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_PERMISSIONS } from '@/types/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import AddWebsiteForm from './AddWebsiteForm';

const WebsiteTable: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  if (!user) return null;

  const permissions = ROLE_PERMISSIONS[user.role];

  const { data: websites, isLoading, refetch } = useQuery({
    queryKey: ['websites', searchTerm],
    queryFn: async () => {
      let query = supabase.from('websites').select('*');
      
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,domain.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['websites'] });
    refetch();
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-success/10 text-success',
      inactive: 'bg-muted text-muted-foreground',
      maintenance: 'bg-warning/10 text-warning',
    };
    
    return variants[status as keyof typeof variants] || 'bg-muted text-muted-foreground';
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

  const filteredWebsites = websites?.filter(website =>
    website.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    website.domain.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Websites</h2>
          <p className="text-muted-foreground">Manage your website portfolio</p>
        </div>
        
        {permissions.websites.create && (
          <Button 
            className="flex items-center space-x-2"
            onClick={() => setIsAddFormOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Add Website</span>
          </Button>
        )}
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>All Websites</span>
            </CardTitle>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search websites..."
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
                  <TableHead>Website</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Server IP</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWebsites.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No websites found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWebsites.map((website) => (
                    <TableRow key={website.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{website.name}</div>
                          {website.notes && (
                            <div className="text-sm text-muted-foreground">{website.notes}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{website.domain}</TableCell>
                      <TableCell>{website.provider}</TableCell>
                      <TableCell className="font-mono text-sm">{website.server_ip}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(website.status)}>
                          {website.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {permissions.websites.update && (
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {permissions.websites.delete && (
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

      <AddWebsiteForm
        open={isAddFormOpen}
        onOpenChange={setIsAddFormOpen}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default WebsiteTable;