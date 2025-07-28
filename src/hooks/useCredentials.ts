import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Credential = Database['public']['Tables']['credentials']['Row'] & {
  websites: {
    name: string;
  } | null;
};

export const useCredentials = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('credentials')
        .select(`
          *,
          websites (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching credentials:', error);
        setError(error.message);
        return;
      }

      setCredentials(data || []);
    } catch (err) {
      console.error('Error fetching credentials:', err);
      setError('Failed to fetch credentials');
    } finally {
      setLoading(false);
    }
  };

  const addCredential = async (credentialData: Omit<Database['public']['Tables']['credentials']['Insert'], 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('credentials')
        .insert({
          ...credentialData,
          user_id: user.id,
        });

      if (error) throw error;
      
      await fetchCredentials();
    } catch (err) {
      console.error('Error adding credential:', err);
      throw err;
    }
  };

  const updateCredential = async (id: string, updates: Partial<Omit<Database['public']['Tables']['credentials']['Update'], 'id' | 'created_at' | 'updated_at' | 'user_id'>>) => {
    try {
      const { error } = await supabase
        .from('credentials')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      await fetchCredentials();
    } catch (err) {
      console.error('Error updating credential:', err);
      throw err;
    }
  };

  const deleteCredential = async (id: string) => {
    try {
      const { error } = await supabase
        .from('credentials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchCredentials();
    } catch (err) {
      console.error('Error deleting credential:', err);
      throw err;
    }
  };

  return {
    credentials,
    loading,
    error,
    fetchCredentials,
    addCredential,
    updateCredential,
    deleteCredential,
  };
};