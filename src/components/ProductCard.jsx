import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <Link to={`/product/${product.id}`} className="card flex-col" style={{ display: 'flex', textDecoration: 'none' }}>
      <div style={{ position: 'relative', paddingTop: '75%', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
        <img 
          src={imageUrl} 
          alt={product.name} 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
          {product.in_stock ? (
            <span className="badge badge-success" style={{ boxShadow: 'var(--shadow-sm)' }}>In Stock</span>
          ) : (
            <span className="badge badge-danger" style={{ boxShadow: 'var(--shadow-sm)' }}>Out of Stock</span>
          )}
        </div>
      </div>
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <p className="text-secondary font-bold" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', color: 'var(--accent-secondary)' }}>
          {product.brand || 'Generic'}
        </p>
        <h3 className="h4 mb-2 text-primary-color" style={{ lineHeight: 1.4 }}>{product.name}</h3>
        <p className="font-bold text-primary-color" style={{ marginTop: 'auto', paddingTop: '1.5rem', fontSize: '1.25rem' }}>
          ₹{product.price?.toLocaleString('en-IN') || 'Price on request'}
        </p>
      </div>
    </Link>
  );
}
