import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Key, Server, AlertTriangle } from 'lucide-react';

const DashboardStats: React.FC = () => {
  const stats = [
    {
      title: 'Websites',
      value: '24',
      change: '+2 this month',
      icon: Globe,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      title: 'Credentials',
      value: '156',
      change: '+12 this week',
      icon: Key,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Active Servers',
      value: '18',
      change: '2 offline',
      icon: Server,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Expiring Domains',
      value: '3',
      change: 'Next 30 days',
      icon: AlertTriangle,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="shadow-soft hover:shadow-medium transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`w-8 h-8 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;