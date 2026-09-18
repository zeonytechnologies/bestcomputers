import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

export default function Category() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');

  // Filters
  const [selectedBrand, setSelectedBrand] = useState('');
  const [brands, setBrands] = useState([]);

  // Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [enquiryForm, setEnquiryForm] = useState({ name: '', phone: '', message: '' });
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (catError) throw catError;
        setCategoryName(catData.name);

        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', catData.id)
          .order('created_at', { ascending: false });
        
        if (prodError) throw prodError;
        setProducts(prodData || []);
        
        const uniqueBrands = [...new Set(prodData.map(p => p.brand).filter(Boolean))];
        setBrands(uniqueBrands);
        setSelectedBrand('');

      } catch (err) {
        console.error('Error fetching category data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  const filteredProducts = selectedBrand 
    ? products.filter(p => p.brand === selectedBrand)
    : products;

  const getCategoryDesc = () => {
    switch (slug) {
      case 'laptops': return 'Find the perfect laptop for your needs. We carry premium brands for business professionals, heavy-duty gaming rigs, and affordable student laptops.';
      case 'desktops': return 'Custom-built powerhouses and reliable branded towers. Whether you need a workstation for CAD or a basic home PC, we have it.';
      case 'cctv': return 'Secure your premises with our high-definition CCTV systems. We provide complete kits including cameras, DVRs, and professional installation services.';
      default: return `Explore our selection of ${categoryName || slug}.`;
    }
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setEnquiryForm({ name: '', phone: '', message: `I am interested in this product.` });
    setIsRedirecting(false);
  };

  const closeModal = () => {
    if (isRedirecting) return;
    setSelectedProduct(null);
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setIsRedirecting(true);
    
    const waNumber = "917200040017";
    const text = `Hi Best Computers, I'm interested in the following product:\n\n*Product:* ${selectedProduct.name}\n*Brand:* ${selectedProduct.brand || 'N/A'}\n*Category:* ${categoryName}\n\n*My Details:*\nName: ${enquiryForm.name}\nPhone: ${enquiryForm.phone}\nMessage: ${enquiryForm.message}`;
    
    // Call the email API in the background
    try {
      await fetch('/api/send-enquiry-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: enquiryForm.name,
          phone: enquiryForm.phone,
          message: enquiryForm.message,
          productName: selectedProduct.name
        })
      });
    } catch (error) {
      console.error('Failed to send email:', error);
    }

    // Save to Supabase for the Admin Panel
    try {
      await supabase.from('enquiries').insert([{
        product_id: selectedProduct.id,
        name: enquiryForm.name,
        phone: enquiryForm.phone,
        message: enquiryForm.message,
        status: 'new'
      }]);
    } catch (error) {
      console.error('Failed to save to Supabase:', error);
    }

    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    
    setTimeout(() => {
      window.location.href = waUrl;
      setTimeout(() => {
        closeModal();
      }, 1000);
    }, 1500);
  };

  return (
    <div>
      <div className="section-alt" style={{ padding: '4rem 0', borderBottom: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '60%', height: '200%', background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, rgba(59,130,246,0) 70%)', filter: 'blur(40px)', zIndex: 0 }}></div>
        <div className="container text-center" style={{ position: 'relative', zIndex: 10 }}>
          <h1 className="h1 text-primary-color capitalize mb-4">{categoryName || slug}</h1>
          <p className="text-secondary h4" style={{ fontWeight: 400, maxWidth: '800px', margin: '0 auto' }}>
            {getCategoryDesc()}
          </p>
        </div>
      </div>

      <div className="container section">
        <div className="flex justify-between items-center mb-8 glass-panel" style={{ padding: '1rem 1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="font-bold text-secondary">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <label className="text-primary-color font-bold" style={{ fontSize: '0.875rem' }}>Filter by Brand:</label>
            <select 
              className="input-field" 
              style={{ width: 'auto', minWidth: '200px', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="">All Brands</option>
              {brands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center" style={{ padding: '4rem 0' }}>
            <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p className="text-muted mt-4 font-bold">Loading catalog...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            {/* Moving Carousel */}
            <div style={{ marginBottom: '4rem' }}>
              <h3 className="h3 text-primary-color mb-6">Featured {categoryName || slug}</h3>
              <Swiper
                spaceBetween={30}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 4 }
                }}
                autoplay={{ delay: 0, disableOnInteraction: false }}
                speed={5000}
                loop={filteredProducts.length > 4}
                freeMode={true}
                allowTouchMove={true}
                modules={[Autoplay, FreeMode]}
                className="continuous-slider"
                style={{ paddingBottom: '3rem' }}
              >
                {filteredProducts.map(product => (
                  <SwiperSlide key={`featured-${product.id}`} style={{ height: 'auto' }}>
                    <ProductCard product={product} onClick={openModal} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* All Products Listing */}
            <div>
              <h3 className="h3 text-primary-color mb-6">Browse All Products</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                {filteredProducts.map(product => (
                  <ProductCard key={`grid-${product.id}`} product={product} onClick={openModal} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="card glass-panel" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>📦</div>
            <h3 className="h3 text-primary-color">No products found.</h3>
            <p className="text-secondary mt-2">We couldn't find any products matching your current filters.</p>
            {selectedBrand && (
              <button className="btn btn-outline mt-6" onClick={() => setSelectedBrand('')}>Clear Filters</button>
            )}
          </div>
        )}
      </div>

      {/* Enquiry Modal */}
      {selectedProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ width: '100%', maxWidth: '550px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <button 
              onClick={closeModal}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.background = 'var(--danger)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--danger)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-main)'; e.currentTarget.style.color = 'inherit'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
            >
              <X size={20} />
            </button>
            
            <div style={{ padding: '2.5rem', overflowY: 'auto' }}>
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', alignItems: 'center', padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: '100px', height: '100px', flexShrink: 0, backgroundColor: 'transparent' }}>
                  <img src={selectedProduct.images?.[0] || 'https://via.placeholder.com/150'} alt={selectedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <p className="font-bold" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-secondary)' }}>{selectedProduct.brand}</p>
                  <h3 className="h4 text-primary-color mt-1" style={{ lineHeight: 1.3 }}>{selectedProduct.name}</h3>
                </div>
              </div>

              {isRedirecting ? (
                <div className="text-center" style={{ padding: '3rem 0' }}>
                  <div style={{ display: 'inline-block', width: '48px', height: '48px', border: '4px solid rgba(37, 211, 102, 0.2)', borderTopColor: '#25D366', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  <h3 className="h3 mt-4" style={{ color: '#25D366' }}>Connecting to WhatsApp...</h3>
                  <p className="text-secondary mt-2">Opening secure chat for faster response.</p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit}>
                  <h4 className="h4 mb-5 text-primary-color">Place Your Order</h4>
                  <div className="input-group mb-4">
                    <label className="input-label">Full Name *</label>
                    <input type="text" required className="input-field" style={{ borderRadius: 'var(--radius-md)' }} value={enquiryForm.name} onChange={e => setEnquiryForm({...enquiryForm, name: e.target.value})} placeholder="Enter your name" />
                  </div>
                  <div className="input-group mb-4">
                    <label className="input-label">Phone Number *</label>
                    <input type="tel" required className="input-field" style={{ borderRadius: 'var(--radius-md)' }} value={enquiryForm.phone} onChange={e => setEnquiryForm({...enquiryForm, phone: e.target.value})} placeholder="e.g. 9876543210" />
                  </div>
                  <div className="input-group mb-6">
                    <label className="input-label">Additional Message</label>
                    <textarea required className="input-field" rows="3" style={{ borderRadius: 'var(--radius-md)', resize: 'none' }} value={enquiryForm.message} onChange={e => setEnquiryForm({...enquiryForm, message: e.target.value})}></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', backgroundColor: '#25D366', borderColor: '#25D366', padding: '1rem', fontSize: '1.1rem', borderRadius: 'var(--radius-full)', boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)' }}>
                    Confirm & Send via WhatsApp
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}} />
    </div>
  );
}
