import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Key, Database, Server, TrendingUp, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardStats: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [websites, credentials, domains, servers] = await Promise.all([
        supabase.from('websites').select('id, status'),
        supabase.from('credentials').select('id, type'),
        supabase.from('domains').select('id, status'),
        supabase.from('servers').select('id, status')
      ]);

      const websiteStats = {
        total: websites.data?.length || 0,
        active: websites.data?.filter(w => w.status === 'active').length || 0,
        maintenance: websites.data?.filter(w => w.status === 'maintenance').length || 0
      };

      const credentialStats = {
        total: credentials.data?.length || 0,
        ftp: credentials.data?.filter(c => c.type === 'ftp').length || 0,
        database: credentials.data?.filter(c => c.type === 'database').length || 0
      };

      const domainStats = {
        total: domains.data?.length || 0,
        active: domains.data?.filter(d => d.status === 'active').length || 0,
        expired: domains.data?.filter(d => d.status === 'expired').length || 0
      };

      const serverStats = {
        total: servers.data?.length || 0,
        online: servers.data?.filter(s => s.status === 'online').length || 0,
        offline: servers.data?.filter(s => s.status === 'offline').length || 0
      };

      return { websiteStats, credentialStats, domainStats, serverStats };
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="shadow-soft">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-16" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Websites',
      value: stats?.websiteStats.total || 0,
      description: `${stats?.websiteStats.active || 0} active, ${stats?.websiteStats.maintenance || 0} maintenance`,
      icon: Globe,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Credentials',
      value: stats?.credentialStats.total || 0,
      description: `${stats?.credentialStats.ftp || 0} FTP, ${stats?.credentialStats.database || 0} database`,
      icon: Key,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Domains',
      value: stats?.domainStats.total || 0,
      description: `${stats?.domainStats.active || 0} active, ${stats?.domainStats.expired || 0} expired`,
      icon: Database,
      color: 'text-info',
      bgColor: 'bg-info/10'
    },
    {
      title: 'Servers',
      value: stats?.serverStats.total || 0,
      description: `${stats?.serverStats.online || 0} online, ${stats?.serverStats.offline || 0} offline`,
      icon: Server,
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="shadow-soft hover:shadow-soft-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;