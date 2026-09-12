import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Monitor, ShieldCheck, Wrench, ArrowRight, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import logo from '../assets/Best-computer-logo.webp';
import heroImage from '../assets/hero-image.png';

export default function Home() {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);
        
        if (error) throw error;
        setLatestProducts(data || []);
      } catch (err) {
        console.error('Error fetching latest products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)', position: 'relative', overflow: 'hidden' }}>
        {/* Dynamic Background Elements */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0) 70%)', filter: 'blur(60px)', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, rgba(249,115,22,0) 70%)', filter: 'blur(60px)', zIndex: 0 }}></div>

        <div className="container hero-flex" style={{ position: 'relative', padding: '6rem 1.5rem', display: 'flex', alignItems: 'center', minHeight: '650px', gap: '3rem', zIndex: 10 }}>
          
          <div style={{ flex: '1 1 50%', zIndex: 10 }}>
            <div style={{ display: 'inline-block', background: 'rgba(59, 130, 246, 0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)', marginBottom: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <span className="font-bold" style={{ color: 'var(--accent-primary)', fontSize: '0.875rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>IT Services & Solutions in Hosur</span>
            </div>
            <h1 className="h1 mb-6 hero-title" style={{ maxWidth: '600px', color: 'var(--text-primary)' }}>
              Your Trusted <span style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>Technology</span> Partner.
            </h1>
            <p className="mb-8 h4 hero-subtitle" style={{ maxWidth: '550px', fontWeight: 400, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              From high-performance laptops and custom desktops to comprehensive CCTV security installations. We bring premium IT solutions directly to you.
            </p>
            <div className="hero-buttons">
              <Link to="/category/laptops" className="btn btn-primary" style={{ padding: '1rem 2.5rem', justifyContent: 'center', fontSize: '1.125rem', transition: 'all 0.3s ease' }}>Shop Now</Link>
              <Link to="/contact" className="btn btn-hero-outline" style={{ display: 'inline-flex', alignItems: 'center', padding: '1rem 2.5rem', justifyContent: 'center', fontSize: '1.125rem', color: 'var(--accent-primary)', border: '2px solid var(--accent-primary)', borderRadius: '9999px', transition: 'all 0.3s ease' }}>Get a Quote</Link>
            </div>
          </div>

          <div className="hero-image-container" style={{ flex: '1 1 50%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', border: '1px solid rgba(0,0,0,0.05)', transform: 'perspective(1000px) rotateY(-5deg)', transition: 'transform 0.5s ease' }} className="hero-img-wrapper">
              <img src={heroImage} alt="Premium Tech Devices" style={{ display: 'block', maxWidth: '100%', height: 'auto', objectFit: 'cover' }} />
              {/* Glass reflection overlay */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)', pointerEvents: 'none' }}></div>
            </div>
          </div>

        </div>
      </section>

      {/* Services/Features */}
      <section className="section container">
        <div className="text-center page-header">
          <h2 className="h2 text-primary-color mb-4">Why Choose Best Computers?</h2>
          <p className="text-secondary mx-auto" style={{ maxWidth: '600px', margin: '0 auto' }}>
            We don't just sell boxes. We provide end-to-end IT consultation, setup, and dedicated post-sales support in Hosur.
          </p>
        </div>

        <div className="grid-3 mt-8">
          {[
            { icon: <Monitor size={48} color="var(--accent-primary)" strokeWidth={1.5} />, title: 'Expert Consultation', desc: 'Not sure what specs you need? Our experts will guide you to the perfect machine for your workload and budget.' },
            { icon: <ShieldCheck size={48} color="var(--accent-secondary)" strokeWidth={1.5} />, title: 'Trusted Warranty', desc: 'All products come with official brand warranties. Plus, we handle the RMA process so you don\'t have to worry.' },
            { icon: <Wrench size={48} color="var(--accent-primary)" strokeWidth={1.5} />, title: 'Professional Setup', desc: 'From clean OS installations on new PCs to complete wiring and setup for multi-camera CCTV networks.' }
          ].map((feature, idx) => (
            <div key={idx} className="card glass-panel" style={{ padding: '2.5rem 2rem', textAlign: 'center', borderTop: `4px solid ${idx === 1 ? 'var(--accent-secondary)' : 'var(--accent-primary)'}` }}>
              <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>{feature.icon}</div>
              <h3 className="h3 mb-3 text-primary-color">{feature.title}</h3>
              <p className="text-secondary">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section-alt" style={{ background: 'linear-gradient(to bottom, var(--bg-secondary), var(--bg-main))' }}>
        <div className="container">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="h2 text-primary-color">Our Product Range</h2>
              <p className="text-secondary mt-2">Explore our extensive catalog of genuine IT hardware.</p>
            </div>
          </div>
          
          <div className="grid-3">
            {[
              { title: 'Laptops', slug: 'laptops', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800', desc: 'Business, Gaming & Student Laptops' },
              { title: 'Desktops', slug: 'desktops', img: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&q=80&w=800', desc: 'Custom Builds & Branded Towers' },
              { title: 'CCTV Systems', slug: 'cctv', img: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800', desc: 'HD Security & Surveillance' }
            ].map((cat) => (
              <Link to={`/category/${cat.slug}`} key={cat.slug} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ height: '220px', overflow: 'hidden' }}>
                  <img src={cat.img} alt={cat.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="hover-scale" />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 className="h3 text-primary-color mb-1">{cat.title}</h3>
                  <p className="text-secondary mb-4">{cat.desc}</p>
                  <span className="font-bold text-secondary-color flex items-center gap-2">
                    Browse Catalog <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Arrivals */}
      <section className="section container">
        <div className="page-header text-center">
          <h2 className="h2 text-primary-color">Recently Added</h2>
          <p className="text-secondary mt-2">Check out the newest stock in our Hosur showroom.</p>
        </div>
        
        {loading ? (
          <p className="text-center text-muted">Loading...</p>
        ) : latestProducts.length > 0 ? (
          <div className="grid-4">
            {latestProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-muted text-center" style={{ padding: '2rem 0' }}>No products available yet.</p>
        )}
        
        <div className="text-center mt-12">
          <Link to="/contact" className="btn btn-secondary">Looking for something specific? Contact Us</Link>
        </div>
      </section>
      
      {/* CTA & Location Section */}
      <section className="section" style={{ backgroundColor: 'var(--bg-main)', position: 'relative' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', backgroundColor: 'var(--bg-secondary)' }} className="cta-flex">
            
            <div style={{ flex: '1 1 45%', minWidth: '300px', backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '4rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ maxWidth: '600px', width: '100%' }} className="cta-content">
                <h2 className="h2 mb-6 text-primary-color">Ready to upgrade your tech?</h2>
                <p className="text-secondary mb-8 h4" style={{ fontWeight: 400, lineHeight: 1.6 }}>
                  Visit our store at Thirumala Lodge, Fish Market, Bangalore By Pass Rd, Hosur, or call us directly.
                </p>
                
                <div className="flex gap-4 flex-wrap mt-4 cta-buttons">
                  <a href="tel:07200040017" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                    <Phone size={20} />
                    Call 072000 40017
                  </a>
                  <Link to="/contact" className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Contact Support</Link>
                </div>
              </div>
            </div>

            <div style={{ flex: '1 1 45%', minWidth: '300px', minHeight: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3891.675747146883!2d77.82774637507246!3d12.734563787559438!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae71f5b6345311%3A0x99cc01cfb43d1142!2sBest%20Computer!5e0!3m2!1sen!2sin!4v1789194728512!5m2!1sen!2sin" width="100%" height="100%" style={{ border: 0, minHeight: '400px', filter: 'grayscale(0.2) contrast(1.1)' }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>

          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .hover-scale:hover { transform: scale(1.05); }
        .hero-buttons { display: flex; gap: 1rem; }
        .hero-img-wrapper:hover { transform: perspective(1000px) rotateY(0deg) !important; }
        .btn-hero-outline:hover { background-color: var(--accent-primary); color: #FFFFFF !important; }
        @media (max-width: 768px) {
          .hero-flex { flex-direction: column; text-align: center; gap: 2rem !important; padding: 4rem 1.5rem !important; }
          .hero-buttons { flex-direction: column; width: 100%; }
          .hero-buttons .btn, .hero-buttons .btn-hero-outline { width: 100%; justify-content: center; display: flex; }
          .hero-title { font-size: 2.25rem !important; margin-left: auto; margin-right: auto; }
          .hero-subtitle { font-size: 1.1rem !important; margin-left: auto; margin-right: auto; }
          .cta-flex { flex-direction: column; }
          .cta-content { text-align: center !important; margin: 0 auto; }
          .cta-buttons { justify-content: center; }
        }
      `}} />
    </div>
  );
}
