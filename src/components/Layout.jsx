import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, MapPin, Phone } from 'lucide-react';
import logo from '../assets/Best-computer-logo.webp';

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header style={{ 
        backgroundColor: '#FFFFFF', 
        borderBottom: '1px solid var(--border-color)', 
        position: 'sticky', 
        top: 0, 
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div className="container" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', zIndex: 110 }}>
            <img src={logo} alt="Best Computers Logo" style={{ height: '40px', objectFit: 'contain' }} />
          </Link>
          
          {/* Desktop Nav */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontWeight: 600 }}>
            <Link to="/" style={{ color: location.pathname === '/' ? 'var(--accent-primary)' : 'var(--text-primary)' }}>Home</Link>
            <Link to="/category/laptops" style={{ color: location.pathname.includes('/laptops') ? 'var(--accent-primary)' : 'var(--text-primary)' }}>Laptops</Link>
            <Link to="/category/desktops" style={{ color: location.pathname.includes('/desktops') ? 'var(--accent-primary)' : 'var(--text-primary)' }}>Desktops</Link>
            <Link to="/category/cctv" style={{ color: location.pathname.includes('/cctv') ? 'var(--accent-primary)' : 'var(--text-primary)' }}>CCTV</Link>
            <Link to="/contact" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Contact Us</Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-toggle"
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', zIndex: 110, color: 'var(--accent-primary)' }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMobileMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid var(--border-color)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            zIndex: 105
          }}>
            <Link to="/" onClick={closeMenu} style={{ padding: '0.5rem 0', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid #f1f5f9' }}>Home</Link>
            <Link to="/category/laptops" onClick={closeMenu} style={{ padding: '0.5rem 0', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid #f1f5f9' }}>Laptops</Link>
            <Link to="/category/desktops" onClick={closeMenu} style={{ padding: '0.5rem 0', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid #f1f5f9' }}>Desktops</Link>
            <Link to="/category/cctv" onClick={closeMenu} style={{ padding: '0.5rem 0', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid #f1f5f9' }}>CCTV Systems</Link>
            <Link to="/contact" onClick={closeMenu} className="btn btn-primary" style={{ marginTop: '0.5rem', justifyContent: 'center' }}>Contact Us</Link>
          </div>
        )}
      </header>
      
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      
      <footer style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', marginTop: '4rem' }}>
        <div className="container section grid-4">
          <div>
            <img src={logo} alt="Best Computers Logo" style={{ height: '40px', objectFit: 'contain', marginBottom: '1.5rem' }} />
            <p className="text-secondary mb-4" style={{ fontSize: '0.95rem' }}>
              Your trusted IT partner in Hosur. We provide top-tier Laptops, Custom Desktops, and Professional CCTV solutions for home and business.
            </p>
          </div>
          
          <div>
            <h4 className="h4 mb-4 text-primary-color">Products</h4>
            <ul className="flex-col gap-2 text-secondary" style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ padding: '0.25rem 0' }}><Link to="/category/laptops">Premium Laptops</Link></li>
              <li style={{ padding: '0.25rem 0' }}><Link to="/category/desktops">Custom Desktops</Link></li>
              <li style={{ padding: '0.25rem 0' }}><Link to="/category/cctv">CCTV Security Systems</Link></li>
              <li style={{ padding: '0.25rem 0' }}><Link to="/contact">Corporate Orders</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="h4 mb-4 text-primary-color">Company</h4>
            <ul className="flex-col gap-2 text-secondary" style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ padding: '0.25rem 0' }}><Link to="/">About Us</Link></li>
              <li style={{ padding: '0.25rem 0' }}><Link to="/contact">Contact</Link></li>
              <li style={{ padding: '0.25rem 0' }}><Link to="/contact">Store Location</Link></li>
              <li style={{ padding: '0.25rem 0' }}><Link to="/admin">Admin Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="h4 mb-4 text-primary-color">Contact Info</h4>
            <ul className="flex-col gap-4 text-secondary" style={{ listStyle: 'none', padding: 0 }}>
              <li className="flex items-start gap-2" style={{ flexWrap: 'nowrap' }}>
                <MapPin size={20} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>#201, Thirumala Lodge, Fish Market, Bangalore By Pass Rd, Hosur, Tamil Nadu 635109</span>
              </li>
              <li className="flex items-center gap-2" style={{ flexWrap: 'nowrap' }}>
                <Phone size={20} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                <a href="tel:07200040017" className="font-bold text-primary-color" style={{ fontSize: '1.1rem' }}>072000 40017</a>
              </li>
            </ul>
          </div>
        </div>
        <div style={{ padding: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--border-color)' }}>
          <p className="text-secondary" style={{ fontSize: '0.875rem' }}>© {new Date().getFullYear()} Best Computers. All rights reserved.</p>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}} />
    </>
  );
}
