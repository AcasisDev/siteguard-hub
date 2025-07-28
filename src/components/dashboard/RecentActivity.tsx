import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target: string;
  type: 'create' | 'update' | 'delete' | 'access';
  timestamp: string;
}

const RecentActivity: React.FC = () => {
  const activities: ActivityItem[] = [
    {
      id: '1',
      user: { name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john' },
      action: 'created',
      target: 'example.com website',
      type: 'create',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      user: { name: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane' },
      action: 'updated',
      target: 'FTP credentials',
      type: 'update',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      user: { name: 'Mike Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike' },
      action: 'accessed',
      target: 'database server',
      type: 'access',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      user: { name: 'Sarah Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
      action: 'deleted',
      target: 'old backup server',
      type: 'delete',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const getActionBadge = (type: ActivityItem['type']) => {
    const variants = {
      create: 'bg-success/10 text-success',
      update: 'bg-info/10 text-info',
      delete: 'bg-destructive/10 text-destructive',
      access: 'bg-warning/10 text-warning',
    };
    
    return variants[type] || variants.access;
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback className="bg-muted">
                  {activity.user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity.user.name}</span>
                  {' '}{activity.action}{' '}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
              
              <Badge className={getActionBadge(activity.type)}>
                {activity.type}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;