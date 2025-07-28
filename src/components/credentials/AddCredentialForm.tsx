import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AddCredentialFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddCredentialForm: React.FC<AddCredentialFormProps> = ({ open, onOpenChange, onSuccess }) => {
  const [formData, setFormData] = useState({
    website_id: '',
    type: 'ssh' as const,
    host: '',
    username: '',
    password: '',
    port: '',
    notes: ''
  });
  const [websites, setWebsites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (open && user) {
      fetchWebsites();
    }
  }, [open, user]);

  const fetchWebsites = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('websites')
      .select('id, name, domain')
      .eq('user_id', user.id);
    
    setWebsites(data || []);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('credentials')
        .insert([{
          ...formData,
          port: formData.port ? parseInt(formData.port) : null,
          user_id: user.id
        }]);

      if (error) throw error;

      toast({
        title: 'Credential added successfully',
        description: `New ${formData.type} credential has been added.`,
      });

      setFormData({
        website_id: '',
        type: 'ssh',
        host: '',
        username: '',
        password: '',
        port: '',
        notes: ''
      });
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error adding credential',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Credential</DialogTitle>
          <DialogDescription>
            Add a new credential for website access. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="website_id">Website</Label>
            <Select value={formData.website_id} onValueChange={(value) => handleInputChange('website_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a website" />
              </SelectTrigger>
              <SelectContent>
                {websites.map((website) => (
                  <SelectItem key={website.id} value={website.id}>
                    {website.name} ({website.domain})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Credential Type</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ssh">SSH</SelectItem>
                <SelectItem value="ftp">FTP</SelectItem>
                <SelectItem value="database">Database</SelectItem>
                <SelectItem value="admin">Admin Panel</SelectItem>
                <SelectItem value="cpanel">cPanel</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="host">Host/Server</Label>
            <Input
              id="host"
              value={formData.host}
              onChange={(e) => handleInputChange('host', e.target.value)}
              placeholder="server.example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="admin"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="port">Port (Optional)</Label>
            <Input
              id="port"
              type="number"
              value={formData.port}
              onChange={(e) => handleInputChange('port', e.target.value)}
              placeholder="22, 21, 3306, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes about this credential..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.website_id}>
              {isLoading ? 'Adding...' : 'Add Credential'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCredentialForm;