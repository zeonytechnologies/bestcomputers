import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from '../assets/Best-computer-logo.webp';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Check active custom session
    const adminSession = localStorage.getItem('adminSession');
    
    if (!adminSession) {
      navigate('/admin/login');
    } else {
      setSession(adminSession);
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
        <p className="text-muted font-bold">Verifying authentication...</p>
      </div>
    );
  }

  // If we're somehow still here without a session, don't render the layout
  if (!session) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      <aside style={{ width: '280px', background: 'var(--bg-main)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <img src={logo} alt="Best Computers Logo" style={{ height: '40px', objectFit: 'contain', marginBottom: '1rem' }} />
          <h2 className="text-secondary font-bold" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Control Panel</h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
          <Link 
            to="/admin" 
            className={`btn ${location.pathname === '/admin' ? 'btn-primary' : 'btn-ghost'}`} 
            style={{ justifyContent: 'flex-start', marginBottom: '0.5rem', width: '100%' }}
          >
            Dashboard
          </Link>
          <Link 
            to="/admin/products" 
            className={`btn ${location.pathname === '/admin/products' ? 'btn-primary' : 'btn-ghost'}`} 
            style={{ justifyContent: 'flex-start', marginBottom: '0.5rem', width: '100%' }}
          >
            Manage Products
          </Link>
          <Link 
            to="/admin/enquiries" 
            className={`btn ${location.pathname === '/admin/enquiries' ? 'btn-primary' : 'btn-ghost'}`} 
            style={{ justifyContent: 'flex-start', marginBottom: '0.5rem', width: '100%' }}
          >
            View Enquiries
          </Link>
        </nav>
        
        <div style={{ padding: '1.5rem', marginTop: 'auto', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
            Logout
          </button>
          <Link to="/" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
            Back to Website
          </Link>
        </div>
      </aside>
      
      <main style={{ flex: 1, padding: '3rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <Outlet />
      </main>
    </div>
  );
}
