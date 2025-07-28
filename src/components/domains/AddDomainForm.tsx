import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AddDomainFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddDomainForm: React.FC<AddDomainFormProps> = ({ open, onOpenChange, onSuccess }) => {
  const [formData, setFormData] = useState({
    website_id: '',
    domain_name: '',
    registrar: '',
    status: 'active' as const,
    register_date: undefined as Date | undefined,
    expire_date: undefined as Date | undefined,
    nameservers: [] as string[]
  });
  const [websites, setWebsites] = useState<any[]>([]);
  const [nameserverInput, setNameserverInput] = useState('');
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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addNameserver = () => {
    if (nameserverInput.trim() && !formData.nameservers.includes(nameserverInput.trim())) {
      setFormData(prev => ({
        ...prev,
        nameservers: [...prev.nameservers, nameserverInput.trim()]
      }));
      setNameserverInput('');
    }
  };

  const removeNameserver = (ns: string) => {
    setFormData(prev => ({
      ...prev,
      nameservers: prev.nameservers.filter(n => n !== ns)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('domains')
        .insert([{
          website_id: formData.website_id,
          domain_name: formData.domain_name,
          registrar: formData.registrar,
          status: formData.status,
          register_date: formData.register_date?.toISOString().split('T')[0],
          expire_date: formData.expire_date?.toISOString().split('T')[0],
          nameservers: formData.nameservers,
          user_id: user.id
        }]);

      if (error) throw error;

      toast({
        title: 'Domain added successfully',
        description: `${formData.domain_name} has been added to your domains.`,
      });

      setFormData({
        website_id: '',
        domain_name: '',
        registrar: '',
        status: 'active',
        register_date: undefined,
        expire_date: undefined,
        nameservers: []
      });
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error adding domain',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Domain</DialogTitle>
          <DialogDescription>
            Add a new domain registration. Fill in the details below.
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
            <Label htmlFor="domain_name">Domain Name</Label>
            <Input
              id="domain_name"
              value={formData.domain_name}
              onChange={(e) => handleInputChange('domain_name', e.target.value)}
              placeholder="example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrar">Registrar</Label>
            <Input
              id="registrar"
              value={formData.registrar}
              onChange={(e) => handleInputChange('registrar', e.target.value)}
              placeholder="GoDaddy, Namecheap, etc."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Registration Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.register_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.register_date ? format(formData.register_date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.register_date}
                    onSelect={(date) => handleInputChange('register_date', date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Expiry Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.expire_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expire_date ? format(formData.expire_date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.expire_date}
                    onSelect={(date) => handleInputChange('expire_date', date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Nameservers</Label>
            <div className="flex space-x-2">
              <Input
                value={nameserverInput}
                onChange={(e) => setNameserverInput(e.target.value)}
                placeholder="ns1.example.com"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addNameserver())}
              />
              <Button type="button" onClick={addNameserver} size="sm">
                Add
              </Button>
            </div>
            {formData.nameservers.length > 0 && (
              <div className="space-y-1">
                {formData.nameservers.map((ns, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted p-2 rounded text-sm">
                    <span>{ns}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNameserver(ns)}
                      className="h-6 w-6 p-0"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.website_id}>
              {isLoading ? 'Adding...' : 'Add Domain'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDomainForm;