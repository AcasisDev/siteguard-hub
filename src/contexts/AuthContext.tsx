import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User, AuthContext as AuthContextType, UserRole } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserRole = async (userId: string): Promise<UserRole> => {
    console.log('Getting role for user:', userId);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();
      
      console.log('Role query result:', { data, error });
      
      if (error) {
        console.error('Error fetching user role:', error);
        return 'viewer'; // Default fallback
      }
      
      // Map database roles to app roles
      const roleMap: Record<string, UserRole> = {
        'super_admin': 'superadmin',
        'admin': 'admin',
        'editor': 'editor',
        'viewer': 'viewer'
      };
      
      const role = roleMap[data?.role] || 'viewer';
      console.log('Mapped role:', role);
      return role;
    } catch (error) {
      console.error('Exception in getUserRole:', error);
      return 'viewer';
    }
  };

  const createUserFromSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User> => {
    console.log('Creating user from Supabase user:', supabaseUser.id);
    try {
      const role = await getUserRole(supabaseUser.id);
      
      // Get profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }

      const userData = {
        id: supabaseUser.id,
        name: profile?.display_name || supabaseUser.email?.split('@')[0] || 'User',
        email: supabaseUser.email || '',
        role,
        avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.email}`,
        createdAt: supabaseUser.created_at,
        updatedAt: supabaseUser.updated_at || supabaseUser.created_at,
      };
      
      console.log('Created user data:', userData);
      return userData;
    } catch (error) {
      console.error('Exception in createUserFromSupabaseUser:', error);
      // Return a basic user object even if there are errors
      return {
        id: supabaseUser.id,
        name: supabaseUser.email?.split('@')[0] || 'User',
        email: supabaseUser.email || '',
        role: 'viewer',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.email}`,
        createdAt: supabaseUser.created_at,
        updatedAt: supabaseUser.updated_at || supabaseUser.created_at,
      };
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          const userData = await createUserFromSupabaseUser(session.user);
          setUser(userData);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const userData = await createUserFromSupabaseUser(session.user);
        setUser(userData);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
  };

  const signup = async (email: string, password: string, displayName?: string) => {
    console.log('Starting signup process for:', email);
    const redirectUrl = `${window.location.origin}/`;
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: displayName,
          },
        },
      });
      
      console.log('Signup response:', { data, error });
      
      if (error) {
        console.error('Signup error:', error);
        throw error;
      }
      
      console.log('Signup successful for:', email);
    } catch (error) {
      console.error('Caught signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    signup,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};