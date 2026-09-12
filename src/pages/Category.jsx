import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';

export default function Category() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');

  // Filters
  const [selectedBrand, setSelectedBrand] = useState('');
  const [brands, setBrands] = useState([]);

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

  return (
    <div>
      <div className="section-alt" style={{ padding: '4rem 0', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container text-center">
          <h1 className="h1 text-primary-color capitalize mb-4">{categoryName || slug}</h1>
          <p className="text-secondary h4" style={{ fontWeight: 400, maxWidth: '800px', margin: '0 auto' }}>
            {getCategoryDesc()}
          </p>
        </div>
      </div>

      <div className="container section">
        <div className="flex justify-between items-center mb-8" style={{ padding: '1rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="font-bold text-secondary">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <label className="text-primary-color font-bold" style={{ fontSize: '0.875rem' }}>Filter by Brand:</label>
            <select 
              className="input-field" 
              style={{ width: 'auto', minWidth: '200px', padding: '0.5rem 1rem' }}
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
          <div className="grid-3">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="card" style={{ padding: '6rem 2rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>📦</div>
            <h3 className="h3 text-primary-color">No products found.</h3>
            <p className="text-secondary mt-2">We couldn't find any products matching your current filters.</p>
            {selectedBrand && (
              <button className="btn btn-outline mt-6" onClick={() => setSelectedBrand('')}>Clear Filters</button>
            )}
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
