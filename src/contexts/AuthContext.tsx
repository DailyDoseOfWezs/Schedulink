import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { supabaseService } from '@/lib/supabaseService';
import type { User } from '@/lib/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string, role: 'teacher' | 'student') => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  changePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (authUserId: string) => {
    try {
      const profile = await supabaseService.getProfileByAuthId(authUserId);
      if (profile) {
        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.full_name,
          role: profile.role,
          password: '', // Not stored in DB
          avatarUrl: profile.avatar_url,
        });
      } else {
        console.warn('No profile found for auth user:', authUserId);
        // Profile might not exist yet - this can happen if registration didn't complete
        setUser(null);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        // Handle specific error cases
        if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
          return { success: false, error: 'Please check your email and confirm your account. Or disable email confirmation in Supabase settings.' };
        }
        if (error.message.includes('Email logins are disabled') || error.message.includes('email_disabled')) {
          return { success: false, error: 'Email authentication is disabled in Supabase. Please enable it in Authentication → Providers → Email.' };
        }
        if (error.message.includes('Invalid login credentials') || error.message.includes('invalid_credentials')) {
          return { success: false, error: 'Invalid email or password. If you just registered, confirm your email in Supabase: SQL Editor → Run: UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = \'your-email\';' };
        }
        // Check for email confirmation requirement
        if (error.status === 400 && error.message.toLowerCase().includes('confirm')) {
          return { success: false, error: 'Email confirmation required. Please check your email or disable email confirmation in Supabase.' };
        }
        return { success: false, error: error.message || 'Login failed. Please try again.' };
      }
      
      if (!data.user) {
        return { success: false, error: 'No user data returned. Please try again.' };
      }

      await loadUserProfile(data.user.id);
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'An unexpected error occurred. Please try again.' };
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: 'teacher' | 'student'
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        console.error('Registration auth error:', authError);
        if (authError.message.includes('already registered')) {
          return { success: false, error: 'This email is already registered. Please sign in instead.' };
        }
        return { success: false, error: authError.message || 'Registration failed. Please try again.' };
      }
      
      if (!authData.user) {
        return { success: false, error: 'No user data returned. Please try again.' };
      }

      // Auto-confirm email for development (bypasses email confirmation requirement)
      // In production, you might want to remove this and use email confirmation
      try {
        // This is a workaround - we'll confirm via the admin API if available
        // For now, we'll handle it by ensuring the user can log in
        // The email confirmation will be handled manually via Supabase dashboard or SQL
      } catch (confirmError) {
        console.warn('Could not auto-confirm email:', confirmError);
        // Continue anyway - user can confirm manually if needed
      }

      // Create profile
      try {
        await supabaseService.createProfile({
          auth_user_id: authData.user.id,
          email,
          full_name: name,
          role,
        });
      } catch (profileError: any) {
        console.error('Profile creation error:', profileError);
        // If profile creation fails, the user is still created in auth
        // Try to load profile anyway in case it was created
        if (profileError.message?.includes('duplicate') || profileError.code === '23505') {
          // Profile might already exist, try to load it
          await loadUserProfile(authData.user.id);
          return { success: true };
        }
        return { success: false, error: 'Account created but profile setup failed. Please contact support.' };
      }

      await loadUserProfile(authData.user.id);
      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, error: error.message || 'An unexpected error occurred. Please try again.' };
    }
  };

  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const changePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error('Password update error:', error);
        return { success: false, error: error.message || 'Failed to update password' };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Password change error:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, changePassword, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}