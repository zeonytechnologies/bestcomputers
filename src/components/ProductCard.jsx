export default function ProductCard({ product, onClick }) {
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <div 
      className="card flex-col" 
      style={{ display: 'flex', cursor: 'pointer', height: '300px', transition: 'transform 0.3s' }}
      onClick={() => onClick && onClick(product)}
    >
      <div style={{ position: 'relative', height: '100%', backgroundColor: 'var(--bg-secondary)', overflow: 'hidden' }}>
        <img 
          src={imageUrl} 
          alt={product.name} 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }}
          className="hover-scale"
        />
      </div>
    </div>
  );
}
