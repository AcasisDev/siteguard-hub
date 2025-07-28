import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  Globe, 
  Key, 
  Database, 
  Server, 
  Users, 
  LogOut,
  Shield,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_PERMISSIONS } from '@/types/auth';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const permissions = ROLE_PERMISSIONS[user.role];

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      show: permissions.dashboard,
    },
    {
      id: 'websites',
      label: 'Websites',
      icon: Globe,
      show: permissions.websites.read,
    },
    {
      id: 'credentials',
      label: 'Credentials',
      icon: Key,
      show: permissions.credentials.read,
    },
    {
      id: 'domains',
      label: 'Domains',
      icon: Database,
      show: permissions.domains.read,
    },
    {
      id: 'servers',
      label: 'Servers',
      icon: Server,
      show: permissions.servers.read,
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      show: permissions.users.read,
    },
  ];

  return (
    <div className="w-64 bg-gradient-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">SiteGuard</h1>
            <p className="text-xs text-sidebar-foreground/60">Security Hub</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            if (!item.show) return null;
            
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start space-x-3 h-10",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user.name}
            </p>
            <p className="text-xs text-sidebar-foreground/60 capitalize">
              {user.role}
            </p>
          </div>
          <ChevronDown className="h-4 w-4 text-sidebar-foreground/60" />
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start space-x-2 text-sidebar-foreground/70 hover:text-sidebar-foreground cursor-pointer"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;