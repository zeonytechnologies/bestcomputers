import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [activeTab, setActiveTab] = useState('specs');

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, category:categories(name, slug)')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setMainImage(data.images[0]);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="container section text-center" style={{ padding: '8rem 0' }}>
      <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      <p className="text-muted mt-4 font-bold">Loading product details...</p>
      <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 100% { transform: rotate(360deg); } }`}} />
    </div>
  );
  
  if (!product) return (
    <div className="container section text-center" style={{ padding: '8rem 0' }}>
      <h2 className="h2 text-danger">Product not found.</h2>
      <p className="text-secondary mt-4">The product you are looking for might have been removed or is unavailable.</p>
      <button className="btn btn-primary mt-6" onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );

  return (
    <div className="container section">
      <div className="flex items-center gap-2 mb-6 text-muted" style={{ fontSize: '0.875rem' }}>
        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
        <span>/</span>
        <span style={{ cursor: 'pointer' }} onClick={() => navigate(`/category/${product.category?.slug}`)}>{product.category?.name}</span>
        <span>/</span>
        <span className="text-primary-color font-bold">{product.name}</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
        
        {/* Image Gallery */}
        <div style={{ flex: '1 1 450px' }}>
          <div className="card" style={{ padding: '2rem', backgroundColor: '#FFFFFF', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
            <div style={{ position: 'relative', paddingTop: '75%' }}>
              <img 
                src={mainImage || 'https://via.placeholder.com/600x450?text=No+Image'} 
                alt={product.name} 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }} 
              />
            </div>
          </div>
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {product.images.map((img, idx) => (
                <div 
                  key={idx} 
                  className="card"
                  style={{ 
                    width: '90px', height: '70px', flexShrink: 0, cursor: 'pointer', padding: '0.25rem',
                    borderColor: mainImage === img ? 'var(--accent-primary)' : 'var(--border-color)',
                    borderWidth: mainImage === img ? '2px' : '1px'
                  }}
                  onClick={() => setMainImage(img)}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={{ flex: '1 1 450px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <p className="font-bold text-secondary-color" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                {product.brand || 'Generic'}
              </p>
              <h1 className="h1 text-primary-color mb-4" style={{ fontSize: '2.5rem' }}>{product.name}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-6" style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <span className="h2 font-bold" style={{ color: 'var(--text-primary)' }}>
              ₹{product.price?.toLocaleString('en-IN') || 'Price on request'}
            </span>
            <div style={{ marginLeft: 'auto' }}>
              {product.in_stock ? (
                <span className="badge badge-success" style={{ fontSize: '0.875rem', padding: '0.35rem 1rem' }}>In Stock</span>
              ) : (
                <span className="badge badge-danger" style={{ fontSize: '0.875rem', padding: '0.35rem 1rem' }}>Out of Stock</span>
              )}
            </div>
          </div>

          <p className="text-secondary mb-8" style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
            Experience top-tier performance with the {product.brand} {product.name}. Built for reliability and backed by Best Computers Hosur's dedicated support.
          </p>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', marginBottom: '1rem', boxShadow: 'var(--shadow-md)' }}
            onClick={() => navigate('/contact', { state: { productId: product.id, productName: product.name } })}
          >
            Enquire About This Product
          </button>
          <div className="flex justify-center gap-2 text-muted mb-8" style={{ fontSize: '0.875rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            100% Genuine Products
            <span style={{ margin: '0 0.5rem' }}>•</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            Secure Enquiry
          </div>

          {/* Tabs */}
          <div style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', display: 'flex', gap: '2rem' }}>
            <button 
              onClick={() => setActiveTab('specs')} 
              style={{ padding: '0.75rem 0', fontWeight: 600, border: 'none', backgroundColor: 'transparent', cursor: 'pointer', borderBottom: activeTab === 'specs' ? '2px solid var(--accent-primary)' : '2px solid transparent', color: activeTab === 'specs' ? 'var(--accent-primary)' : 'var(--text-muted)' }}
            >
              Technical Specifications
            </button>
            <button 
              onClick={() => setActiveTab('shipping')} 
              style={{ padding: '0.75rem 0', fontWeight: 600, border: 'none', backgroundColor: 'transparent', cursor: 'pointer', borderBottom: activeTab === 'shipping' ? '2px solid var(--accent-primary)' : '2px solid transparent', color: activeTab === 'shipping' ? 'var(--accent-primary)' : 'var(--text-muted)' }}
            >
              Support & Delivery
            </button>
          </div>

          <div style={{ minHeight: '300px' }}>
            {activeTab === 'specs' && (
              <div>
                {product.specs && Object.keys(product.specs).length > 0 ? (
                  <div className="card" style={{ border: '1px solid var(--border-color)', boxShadow: 'none' }}>
                    <table className="data-table">
                      <tbody>
                        {Object.entries(product.specs).map(([key, value]) => (
                          <tr key={key}>
                            <td style={{ width: '40%', fontWeight: 600, color: 'var(--text-primary)', backgroundColor: 'var(--bg-secondary)' }}>{key}</td>
                            <td className="text-secondary">{value || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted p-4 bg-secondary rounded">No detailed specifications available.</p>
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="text-secondary" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h4 className="font-bold text-primary-color mb-1">Local Pickup in Hosur</h4>
                  <p>You can visit our store at Thirumala Lodge to pick up your product immediately. We can also assist with unboxing and basic setup at the store.</p>
                </div>
                <div>
                  <h4 className="font-bold text-primary-color mb-1">Professional Installation</h4>
                  <p>For desktops and CCTV systems, we offer professional at-home or in-office installation across Hosur and surrounding areas.</p>
                </div>
                <div>
                  <h4 className="font-bold text-primary-color mb-1">Warranty & Support</h4>
                  <p>All products come with standard manufacturer warranties. We act as your local point of contact for any warranty claims or service requests.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
