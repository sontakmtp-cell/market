import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const SupabaseContext = createContext(null);

export function SupabaseProvider({ children }) {
  console.log('SupabaseProvider rendering...');
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('SupabaseProvider useEffect starting...');
    let isMounted = true;

    async function init() {
      try {
        console.log('Initializing Supabase session...');
        const { data } = await supabase.auth.getSession();
        console.log('Supabase session data:', data);
        if (!isMounted) return;
        setSession(data.session ?? null);
      } catch (error) {
        console.error('Supabase initialization error:', error);
      } finally {
        if (isMounted) {
          console.log('Setting loading to false');
          setLoading(false);
        }
      }
    }

    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log('Auth state changed:', _event, newSession);
      if (isMounted) {
        setSession(newSession ?? null);
      }
    });

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(() => {
    const user = session?.user ?? null;

    return {
      supabase,
      session,
      user,
      loading,
      // Auth helpers
      signInWithPassword: (email, password) =>
        supabase.auth.signInWithPassword({ email, password }),
      signUpWithPassword: (email, password, options = {}) =>
        supabase.auth.signUp({ email, password, options }),
      signInWithProvider: (provider, options = {}) =>
        supabase.auth.signInWithOAuth({ provider, options }),
      signOut: async () => {
        try {
          console.log('Signing out...');
          const { error } = await supabase.auth.signOut();
          if (error) {
            console.error('Sign out error:', error);
            throw error;
          }
          console.log('Sign out successful');
          return { error: null };
        } catch (error) {
          console.error('Sign out failed:', error);
          return { error };
        }
      },
    };
  }, [session, loading]);

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const ctx = useContext(SupabaseContext);
  if (!ctx) throw new Error('useSupabase must be used within SupabaseProvider');
  return ctx;
}

