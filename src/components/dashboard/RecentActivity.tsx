import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, Clock, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface ActivityItem {
  id: string;
  type: 'website' | 'credential' | 'domain' | 'server';
  action: 'created' | 'updated' | 'deleted';
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

const RecentActivity: React.FC = () => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      // Get recent records from all tables
      const [websites, credentials, domains, servers] = await Promise.all([
        supabase.from('websites').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('credentials').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('domains').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('servers').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      const activityItems: ActivityItem[] = [];

      // Transform websites data
      websites.data?.forEach(item => {
        activityItems.push({
          id: item.id,
          type: 'website',
          action: 'created',
          description: `Website "${item.name}" was added to the system`,
          timestamp: item.created_at,
          status: item.status === 'active' ? 'success' : item.status === 'maintenance' ? 'warning' : 'info'
        });
      });

      // Transform credentials data
      credentials.data?.forEach(item => {
        activityItems.push({
          id: item.id,
          type: 'credential',
          action: 'created',
          description: `${item.type.toUpperCase()} credentials added for ${item.host}`,
          timestamp: item.created_at,
          status: 'info'
        });
      });

      // Transform domains data
      domains.data?.forEach(item => {
        activityItems.push({
          id: item.id,
          type: 'domain',
          action: 'created',
          description: `Domain "${item.domain_name}" registered with ${item.registrar}`,
          timestamp: item.created_at,
          status: item.status === 'active' ? 'success' : item.status === 'expired' ? 'error' : 'warning'
        });
      });

      // Transform servers data
      servers.data?.forEach(item => {
        activityItems.push({
          id: item.id,
          type: 'server',
          action: 'created',
          description: `${item.provider} server added at ${item.ip_address}`,
          timestamp: item.created_at,
          status: item.status === 'online' ? 'success' : item.status === 'offline' ? 'error' : 'warning'
        });
      });

      // Sort by timestamp and return top 10
      return activityItems
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);
    }
  });

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'website': return Activity;
      case 'credential': return CheckCircle;
      case 'domain': return Info;
      case 'server': return AlertCircle;
      default: return Activity;
    }
  };

  const getStatusColor = (status: ActivityItem['status']) => {
    switch (status) {
      case 'success': return 'bg-success/10 text-success';
      case 'warning': return 'bg-warning/10 text-warning';
      case 'error': return 'bg-destructive/10 text-destructive';
      case 'info': return 'bg-info/10 text-info';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {activities && activities.length > 0 ? (
              activities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground font-medium">
                        {activity.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDistanceToNow(new Date(activity.timestamp))} ago
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;