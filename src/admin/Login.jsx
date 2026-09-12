import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import logo from '../assets/Best-computer-logo.webp';

export default function Login() {
  const navigate = useNavigate();
  const [view, setView] = useState('login'); // 'login', 'reset_request', 'reset_otp'
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setError(null);
    setMessage(null);
  }, [view]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: isValid, error: rpcError } = await supabase.rpc('admin_login', {
        p_email: email,
        p_password: password
      });

      if (rpcError) throw rpcError;
      
      if (isValid) {
        localStorage.setItem('adminSession', email);
        navigate('/admin');
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/send-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      
      setMessage('OTP sent to your email. Please check your inbox.');
      setView('reset_otp');
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to verify OTP');
      
      alert('Password updated successfully! You can now log in.');
      setView('login');
      setPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      <div className="card" style={{ padding: '3rem', width: '100%', maxWidth: '450px', boxShadow: 'var(--shadow-xl)' }}>
        <div className="text-center mb-8">
          <img src={logo} alt="Best Computers Logo" style={{ height: '50px', margin: '0 auto 1.5rem', objectFit: 'contain' }} />
          <h1 className="h3 text-primary-color">Admin Authentication</h1>
          <p className="text-secondary mt-2">
            {view === 'login' && 'Sign in to manage your store.'}
            {view === 'reset_request' && 'Enter your email to receive a password reset OTP.'}
            {view === 'reset_otp' && 'Enter the OTP and your new password.'}
          </p>
        </div>

        {error && <div className="mb-6 p-3 rounded text-center" style={{ backgroundColor: '#FEE2E2', color: '#991B1B', fontWeight: 500, fontSize: '0.875rem' }}>{error}</div>}
        {message && <div className="mb-6 p-3 rounded text-center" style={{ backgroundColor: '#D1FAE5', color: '#065F46', fontWeight: 500, fontSize: '0.875rem' }}>{message}</div>}
        
        {view === 'login' && (
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input 
                type="email" 
                className="input-field" 
                placeholder="admin@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group mb-2">
              <label className="input-label">Password</label>
              <input 
                type="password" 
                className="input-field" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="text-right mb-6">
              <button 
                type="button" 
                onClick={() => setView('reset_request')} 
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500 }}
              >
                Forgot Password?
              </button>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        )}

        {view === 'reset_request' && (
          <form onSubmit={handleResetRequest}>
            <div className="input-group mb-6">
              <label className="input-label">Email Address</label>
              <input 
                type="email" 
                className="input-field" 
                placeholder="admin@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary mb-4" 
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Send OTP via Email'}
            </button>
            
            <div className="text-center">
              <button 
                type="button" 
                onClick={() => setView('login')} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500 }}
              >
                Back to Login
              </button>
            </div>
          </form>
        )}

        {view === 'reset_otp' && (
          <form onSubmit={handleVerifyAndUpdate}>
            <div className="input-group mb-6">
              <label className="input-label">Enter 6-Digit OTP</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="123456" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
                style={{ letterSpacing: '0.25em', textAlign: 'center', fontSize: '1.25rem' }}
              />
            </div>

            <div className="input-group mb-6">
              <label className="input-label">New Password</label>
              <input 
                type="password" 
                className="input-field" 
                placeholder="Enter new password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary mb-4" 
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP & Update'}
            </button>
            
            <div className="text-center">
              <button 
                type="button" 
                onClick={() => setView('login')} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500 }}
              >
                Cancel Reset
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
