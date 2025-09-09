import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthTest = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        setMessage(`Session error: ${error.message}`);
      } else {
        setUser(session?.user || null);
        if (session?.user) {
          setMessage(`Logged in as: ${session.user.email}`);
        }
      }
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      setUser(session?.user || null);
      if (session?.user) {
        setMessage(`${event}: ${session.user.email}`);
      } else {
        setMessage(`${event}`);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage('Creating account...');
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(`Signup error: ${error.message}`);
    } else {
      setMessage('Check your email for confirmation link!');
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setMessage('Signing in...');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`Login error: ${error.message}`);
    } else {
      setMessage('Successfully logged in!');
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setMessage(`Logout error: ${error.message}`);
    } else {
      setMessage('Logged out successfully');
    }
  };

  const testProjectCreation = async () => {
    setMessage('Testing project creation...');
    
    try {
      const testProject = {
        title: 'Test Project',
        shortDescription: 'This is a test project',
        fullDescription: 'Testing if project creation works',
        category: 'other',
        budgetMin: 1000,
        budgetMax: 5000,
        currency: 'VND',
        deadline: '2025-12-31',
        client: {
          name: 'Test Client',
          company: 'Test Company',
          rating: 5,
          reviewCount: 0,
          location: 'Test Location'
        }
      };

      const { data, error } = await supabase
        .from('marketplace_projects')
        .insert([{
          ...testProject,
          client_user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        setMessage(`Project creation error: ${error.message} (Code: ${error.code})`);
        console.error('Full error:', error);
      } else {
        setMessage(`Project created successfully! ID: ${data.id}`);
      }
    } catch (error) {
      setMessage(`Unexpected error: ${error.message}`);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4">Authentication Test</h2>
      
      {message && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
          {message}
        </div>
      )}

      {!user ? (
        <div>
          <form onSubmit={handleSignIn} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="space-y-2">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={handleSignUp}
                className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-green-600">✅ User logged in: {user.email}</p>
          <p className="text-sm text-gray-600">User ID: {user.id}</p>
          
          <div className="space-y-2">
            <button
              onClick={testProjectCreation}
              className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
            >
              Test Project Creation
            </button>
            <button
              onClick={handleSignOut}
              className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthTest;
