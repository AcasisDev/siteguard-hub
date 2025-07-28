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

interface AddServerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddServerForm: React.FC<AddServerFormProps> = ({ open, onOpenChange, onSuccess }) => {
  const [formData, setFormData] = useState({
    website_id: '',
    provider: '',
    ip_address: '',
    status: 'online' as const,
    ssh_username: '',
    ssh_password: '',
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
        .from('servers')
        .insert([{
          ...formData,
          user_id: user.id
        }]);

      if (error) throw error;

      toast({
        title: 'Server added successfully',
        description: `Server ${formData.ip_address} has been added.`,
      });

      setFormData({
        website_id: '',
        provider: '',
        ip_address: '',
        status: 'online',
        ssh_username: '',
        ssh_password: '',
        notes: ''
      });
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error adding server',
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
          <DialogTitle>Add New Server</DialogTitle>
          <DialogDescription>
            Add a new server to your infrastructure. Fill in the details below.
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
            <Label htmlFor="provider">Hosting Provider</Label>
            <Input
              id="provider"
              value={formData.provider}
              onChange={(e) => handleInputChange('provider', e.target.value)}
              placeholder="DigitalOcean, AWS, Linode, etc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ip_address">IP Address</Label>
            <Input
              id="ip_address"
              value={formData.ip_address}
              onChange={(e) => handleInputChange('ip_address', e.target.value)}
              placeholder="192.168.1.1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ssh_username">SSH Username (Optional)</Label>
            <Input
              id="ssh_username"
              value={formData.ssh_username}
              onChange={(e) => handleInputChange('ssh_username', e.target.value)}
              placeholder="root, ubuntu, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ssh_password">SSH Password (Optional)</Label>
            <Input
              id="ssh_password"
              type="password"
              value={formData.ssh_password}
              onChange={(e) => handleInputChange('ssh_password', e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes about this server..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.website_id}>
              {isLoading ? 'Adding...' : 'Add Server'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddServerForm;