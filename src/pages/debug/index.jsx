import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import { useSupabase } from '../../contexts/SupabaseContext';

function SupabaseDemo() {
  const { user, loading, signInWithPassword, signUpWithPassword, signOut, supabase } = useSupabase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [table, setTable] = useState('profiles');
  const [rows, setRows] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const onSignIn = async () => {
    setBusy(true); setMessage('');
    const { error } = await signInWithPassword(email, password);
    if (error) setMessage(error.message);
    setBusy(false);
  };

  const onSignUp = async () => {
    setBusy(true); setMessage('');
    const { error } = await signUpWithPassword(email, password, { emailRedirectTo: window.location.origin });
    if (!error) setMessage('Đăng ký thành công. Kiểm tra email để xác nhận.');
    else setMessage(error.message);
    setBusy(false);
  };

  const onSignOut = async () => {
    setBusy(true); setMessage('');
    const { error } = await signOut();
    if (error) setMessage(error.message);
    setBusy(false);
  };

  const fetchRows = async () => {
    setBusy(true); setMessage(''); setRows(null);
    const { data, error } = await supabase.from(table).select('*').limit(5);
    if (error) setMessage(error.message);
    setRows(data || []);
    setBusy(false);
  };

  return (
    <div className="bg-card p-6 rounded-lg border mb-8">
      <h2 className="text-xl font-semibold mb-4">Supabase Demo</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Đăng nhập/đăng ký bằng email & mật khẩu, sau đó thử query.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        <input
          className="border rounded px-3 py-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2"
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex gap-3 mt-3">
        <Button onClick={onSignIn} disabled={busy || loading} variant="outline">Đăng nhập</Button>
        <Button onClick={onSignUp} disabled={busy || loading} variant="outline">Đăng ký</Button>
        <Button onClick={onSignOut} disabled={busy || loading || !user} variant="destructive">Đăng xuất</Button>
      </div>
      <div className="mt-3 text-sm">
        <p><strong>Trạng thái:</strong> {loading ? 'Đang tải...' : (user ? `Đã đăng nhập: ${user.email}` : 'Chưa đăng nhập')}</p>
        {message && <p className="text-red-600 mt-1">{message}</p>}
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto] items-end">
        <input
          className="border rounded px-3 py-2"
          type="text"
          placeholder="Tên bảng (vd: profiles, todos)"
          value={table}
          onChange={(e) => setTable(e.target.value)}
        />
        <Button onClick={fetchRows} disabled={busy} variant="default">Fetch 5 rows</Button>
      </div>
      {rows && (
        <pre className="mt-4 text-xs bg-muted p-3 rounded overflow-auto max-h-64">{JSON.stringify(rows, null, 2)}</pre>
      )}
    </div>
  );
}

const DebugPage = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState({
    authToken: null,
    userRole: null,
    userEmail: null
  });

  useEffect(() => {
    // Load current auth state
    const authToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');
    
    setAuthState({
      authToken,
      userRole,
      userEmail
    });
  }, []);

  const handleMockLogin = (role) => {
    const mockCredentials = {
      freelancer: { email: "freelancer@techmarket.vn", token: "mock-freelancer-token" },
      client: { email: "client@techmarket.vn", token: "mock-client-token" },
      employer: { email: "employer@techmarket.vn", token: "mock-employer-token" },
      candidate: { email: "candidate@techmarket.vn", token: "mock-candidate-token" }
    };

    const cred = mockCredentials[role];
    if (cred) {
      localStorage.setItem('authToken', cred.token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userEmail', cred.email);
      
      setAuthState({
        authToken: cred.token,
        userRole: role,
        userEmail: cred.email
      });
      
      alert(`Đã đăng nhập thành công với vai trò: ${role}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    
    setAuthState({
      authToken: null,
      userRole: null,
      userEmail: null
    });
    
    alert('Đã đăng xuất thành công');
  };

  const isAuthenticated = !!authState.authToken;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold mb-8">Debug & Test Page</h1>

        {/* Supabase Demo */}
        <SupabaseDemo />
        
        {/* Authentication Status */}
        <div className="bg-card p-6 rounded-lg border mb-8">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <p><strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
            {isAuthenticated && (
              <>
                <p><strong>Role:</strong> {authState.userRole}</p>
                <p><strong>Email:</strong> {authState.userEmail}</p>
                <p><strong>Token:</strong> {authState.authToken?.substring(0, 20)}...</p>
              </>
            )}
          </div>
        </div>

        {/* Mock Login Buttons */}
        <div className="bg-card p-6 rounded-lg border mb-8">
          <h2 className="text-xl font-semibold mb-4">Mock Login (For Testing)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              onClick={() => handleMockLogin('freelancer')}
              variant="outline"
            >
              Login as Freelancer
            </Button>
            <Button 
              onClick={() => handleMockLogin('client')}
              variant="outline"
            >
              Login as Client
            </Button>
            <Button 
              onClick={() => handleMockLogin('employer')}
              variant="outline"
            >
              Login as Employer
            </Button>
            <Button 
              onClick={() => handleMockLogin('candidate')}
              variant="outline"
            >
              Login as Candidate
            </Button>
          </div>
          {isAuthenticated && (
            <div className="mt-4">
              <Button 
                onClick={handleLogout}
                variant="destructive"
              >
                Logout
              </Button>
            </div>
          )}
        </div>

        {/* Profile Navigation */}
        <div className="bg-card p-6 rounded-lg border mb-8">
          <h2 className="text-xl font-semibold mb-4">Profile Navigation Test</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Link to="/profile">
                <Button variant="default">
                  Go to /profile (should redirect to /profile/manage)
                </Button>
              </Link>
              <span className="text-muted-foreground">
                {isAuthenticated ? '✅ Should work' : '❌ Will redirect to login'}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/profile/manage">
                <Button variant="outline">
                  Go to /profile/manage (direct)
                </Button>
              </Link>
              <span className="text-muted-foreground">
                {isAuthenticated ? '✅ Should work' : '❌ Will redirect to login'}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/profile/public">
                <Button variant="outline">
                  Go to /profile/public (new route)
                </Button>
              </Link>
              <span className="text-muted-foreground">
                ✅ Should work (no auth required)
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/profile/johndoe">
                <Button variant="outline">
                  Go to /profile/johndoe (public profile with username)
                </Button>
              </Link>
              <span className="text-muted-foreground">
                ✅ Should work (no auth required)
              </span>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Current URL: {window.location.href}</p>
            <p>Current Path: {window.location.pathname}</p>
            <p>LocalStorage Keys: {Object.keys(localStorage).join(', ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
