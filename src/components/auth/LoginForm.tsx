import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Lock, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-dashboard.jpg';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('admin@siteguard.com');
  const [password, setPassword] = useState('password');
  const [role, setRole] = useState<UserRole>('admin');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password, role);
      toast({
        title: 'Login successful',
        description: `Welcome back! Logged in as ${role}.`,
      });
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero image */}
      <div className="hidden lg:flex flex-1 relative">
        <img 
          src={heroImage} 
          alt="SiteGuard Dashboard" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sidebar/90 to-sidebar-accent/90"></div>
        <div className="relative z-10 flex flex-col justify-center p-12">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-sidebar-foreground mb-4">
              SiteGuard Hub
            </h1>
            <p className="text-xl text-sidebar-foreground/80 mb-8">
              Secure website data management and credential protection for teams
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sidebar-foreground/70">
                <Shield className="h-5 w-5" />
                <span>Role-based access control</span>
              </div>
              <div className="flex items-center space-x-3 text-sidebar-foreground/70">
                <Lock className="h-5 w-5" />
                <span>Encrypted credential storage</span>
              </div>
              <div className="flex items-center space-x-3 text-sidebar-foreground/70">
                <User className="h-5 w-5" />
                <span>Team collaboration tools</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-primary">
        <Card className="w-full max-w-md shadow-large">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your SiteGuard account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Login as</Label>
                <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="superadmin">Superadmin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Demo credentials: admin@siteguard.com / password
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;