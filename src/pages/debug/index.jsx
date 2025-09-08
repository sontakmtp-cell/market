import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';

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
