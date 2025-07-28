import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardStats from '../dashboard/DashboardStats';
import RecentActivity from '../dashboard/RecentActivity';
import WebsiteTable from '../websites/WebsiteTable';
import CredentialTable from '../credentials/CredentialTable';
import UserTable from '../users/UserTable';
import DomainTable from '../domains/DomainTable';
import ServerTable from '../servers/ServerTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Server } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Overview of your website management system</p>
            </div>
            <DashboardStats />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentActivity />
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <h3 className="font-medium">Add New Website</h3>
                      <p className="text-sm text-muted-foreground">Register a new website in the system</p>
                    </div>
                    <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <h3 className="font-medium">Create Credentials</h3>
                      <p className="text-sm text-muted-foreground">Add new access credentials</p>
                    </div>
                    <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <h3 className="font-medium">Check Domains</h3>
                      <p className="text-sm text-muted-foreground">Review domain expiration dates</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'websites':
        return <WebsiteTable />;
      case 'credentials':
        return <CredentialTable />;
      case 'domains':
        return <DomainTable />;
      case 'servers':
        return <ServerTable />;
      case 'users':
        return <UserTable />;
      default:
        return <div>Content not found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;