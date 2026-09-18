import { ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function ProductCard({ product, onClick }) {
  const hasMultipleImages = product.images && product.images.length > 1;
  const singleImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://via.placeholder.com/400x400?text=No+Image';

  return (
    <div 
      className="card flex-col product-card-hover" 
      style={{ display: 'flex', cursor: 'pointer', aspectRatio: '1 / 1', width: '100%', position: 'relative', overflow: 'hidden', borderRadius: '1rem', backgroundColor: 'var(--bg-main)', boxShadow: 'var(--shadow-sm)', transition: 'all 0.3s ease', padding: 0 }}
      onClick={() => onClick && onClick(product)}
    >
      <div style={{ position: 'relative', height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {hasMultipleImages ? (
          <Swiper
            pagination={{ clickable: true }}
            modules={[Pagination]}
            className="product-image-swiper"
            style={{ width: '100%', height: '100%' }}
            nested={true}
          >
            {product.images.map((img, idx) => (
              <SwiperSlide key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src={img} 
                  alt={`${product.name} - View ${idx + 1}`} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  className="product-img"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <img 
            src={singleImage} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            className="product-img"
          />
        )}
      </div>

      {/* Hover Overlay */}
      <div className="product-details-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.7) 60%, rgba(15, 23, 42, 0.4) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.5rem', opacity: 0, transition: 'all 0.3s ease', transform: 'translateY(20px)', pointerEvents: 'none', zIndex: 10 }}>
        {product.brand && <span style={{ color: 'var(--accent-secondary)', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{product.brand}</span>}
        <h3 className="h4" style={{ color: 'white', marginBottom: '0.75rem', lineHeight: '1.2' }}>{product.name}</h3>
        {product.description && (
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.description}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: 'bold', marginTop: 'auto' }}>
          <span>Enquire Now</span>
          <ArrowRight size={18} />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .product-card-hover:hover .product-details-overlay { opacity: 1; transform: translateY(0); pointer-events: auto; }
        .product-card-hover:hover .product-img { transform: scale(1.05); }
        .product-image-swiper .swiper-pagination-bullet { background: rgba(255,255,255,0.6); }
        .product-image-swiper .swiper-pagination-bullet-active { background: white; }
      `}} />
    </div>
  );
}
