import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search, Eye, Edit, Trash2, Globe } from 'lucide-react';
import { Website } from '@/types/data';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_PERMISSIONS } from '@/types/auth';

const WebsiteTable: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  if (!user) return null;

  const permissions = ROLE_PERMISSIONS[user.role];

  // Mock data
  const websites: Website[] = [
    {
      id: '1',
      name: 'Example Corp',
      domain: 'example.com',
      provider: 'AWS',
      serverIp: '192.168.1.100',
      status: 'active',
      notes: 'Main corporate website',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
    },
    {
      id: '2',
      name: 'Blog Site',
      domain: 'blog.example.com',
      provider: 'DigitalOcean',
      serverIp: '192.168.1.101',
      status: 'active',
      notes: 'WordPress blog',
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-18T16:45:00Z',
    },
    {
      id: '3',
      name: 'Dev Environment',
      domain: 'dev.example.com',
      provider: 'Linode',
      serverIp: '192.168.1.102',
      status: 'maintenance',
      notes: 'Development testing',
      createdAt: '2024-01-05T11:00:00Z',
      updatedAt: '2024-01-22T08:15:00Z',
    },
  ];

  const filteredWebsites = websites.filter(website =>
    website.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    website.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: Website['status']) => {
    const variants = {
      active: 'bg-success/10 text-success',
      inactive: 'bg-muted text-muted-foreground',
      maintenance: 'bg-warning/10 text-warning',
    };
    
    return variants[status];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Websites</h2>
          <p className="text-muted-foreground">Manage your website portfolio</p>
        </div>
        
        {permissions.websites.create && (
          <Button className="flex items-center space-x-2">
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
                      <TableCell className="font-mono text-sm">{website.serverIp}</TableCell>
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
    </div>
  );
};

export default WebsiteTable;