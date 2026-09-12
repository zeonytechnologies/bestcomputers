import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Monitor, ShieldCheck, Wrench, ArrowRight, Phone, Star } from 'lucide-react';
import heroImage from '../assets/hero-image.png';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

export default function Home() {
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

      {/* Categories */}
      <section className="section-alt" style={{ background: 'linear-gradient(to bottom, var(--bg-secondary), var(--bg-main))' }}>
        <div className="container">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="h2 text-primary-color">Our Product Range</h2>
              <p className="text-secondary mt-2">Explore our extensive catalog of genuine IT hardware.</p>
            </div>
          </div>
          
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            autoplay={{ delay: 0, disableOnInteraction: false }}
            speed={5000}
            loop={true}
            freeMode={true}
            modules={[Autoplay, FreeMode]}
            className="category-swiper continuous-slider"
            style={{ paddingBottom: '3rem' }}
          >
            {[
              { title: 'Laptops', slug: 'laptops', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800' },
              { title: 'Desktops', slug: 'desktops', img: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&q=80&w=800' },
              { title: 'CCTV Systems', slug: 'cctv', img: '/cctv-category.jpg' }
            ].map((cat) => (
              <SwiperSlide key={cat.slug}>
                <Link to={`/category/${cat.slug}`} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '300px', position: 'relative' }}>
                  <img 
                    src={cat.img} 
                    alt={cat.title} 
                    onError={(e) => {
                      if (cat.slug === 'cctv') {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800';
                      }
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: 'var(--bg-secondary)' }} 
                    className="hover-scale" 
                  />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                    <h3 className="h3" style={{ color: 'white', marginBottom: 0 }}>{cat.title}</h3>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
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
            { icon: <ShieldCheck size={48} color="var(--accent-secondary)" strokeWidth={1.5} />, title: 'Trusted Warranty', desc: "All products come with official brand warranties. Plus, we handle the RMA process so you don't have to worry." },
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

      {/* Google Reviews */}
      <section className="section-alt" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="text-center page-header mb-8">
            <h2 className="h2 text-primary-color mb-2">What Our Customers Say</h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <span style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1 }}>4.4</span>
              <div className="flex-col" style={{ alignItems: 'flex-start' }}>
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={20} fill={star <= 4 ? "#fbbc04" : "url(#half-star)"} color={star <= 4 ? "#fbbc04" : "#e0e0e0"} strokeWidth={1} />
                  ))}
                </div>
                <span className="text-muted font-medium" style={{ fontSize: '0.85rem' }}>Google Reviews</span>
              </div>
            </div>
          </div>

          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 }
            }}
            autoplay={{ delay: 0, disableOnInteraction: false }}
            speed={6000}
            loop={true}
            freeMode={true}
            modules={[Autoplay, FreeMode]}
            className="continuous-slider"
            style={{ paddingBottom: '2rem' }}
          >
            {[
              {
                name: 'AP',
                meta: 'Local Guide · 6 reviews · 7 photos',
                time: '6 months ago',
                text: "Purchased Computers for my office recently. Rate is very reasonable, they’re giving good support after sales as well.",
                avatarColor: '#34a853'
              },
              {
                name: 'Muhammed',
                meta: '4 reviews · 3 photos',
                time: '8 months ago',
                text: "I am looking lost 6 month gaming laptop but I am searching Amazon on Flipkart one of the best shop in Hosur is given laptop i7 13th generation laptop with 6 GB 3050 graph is card is given compare this one lakh 10000 in online but he is selling 95000 he is arrange and give one or two days thanks to best computer one of the best computer shop",
                avatarColor: '#ea4335'
              },
              {
                name: 'Pavan Kumar',
                meta: '1 review · 1 photo',
                time: '8 months ago',
                text: "I am buying him gaming system for 58000 is given best price and given the good explanation for us thanks to best computer I am comepare to Bangalore and Chennai market is given best price and super warranty and he is front of me install and assemble all the system and given thanks to best computers",
                avatarColor: '#fbbc04'
              },
              {
                name: 'yeswanth yeshu',
                meta: '3 reviews · 3 photos',
                time: '9 months ago',
                text: "I am buying Dell latitude laptop he is given one of the wonderful price compared to some other shop we are went SP road Chennai and Bangalore but never on given warranty for current laptop but he is given good suggestion and explanation thanks to best computers like this you want",
                avatarColor: '#4285f4'
              },
              {
                name: 'Seraladhan',
                meta: '2 reviews · 5 photos',
                time: 'a year ago',
                text: "One of the best laptop shop.In hosur, it is given best rate and quality of service with best service support is given five things of accessories i went many more shops in hosur We all are said telling too much of cost lapped up, but he's given super price and super speeds too.Response time is best computers hosur",
                avatarColor: '#34a853'
              }
            ].map((review, idx) => (
              <SwiperSlide key={idx} style={{ height: 'auto' }}>
                <div className="card glass-panel flex-col" style={{ height: '100%', padding: '1.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: review.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem', flexShrink: 0 }}>
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-primary-color" style={{ fontSize: '0.95rem', lineHeight: 1.2 }}>{review.name}</h4>
                      <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '2px' }}>{review.meta}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} size={14} fill="#fbbc04" color="#fbbc04" strokeWidth={1} />
                      ))}
                    </div>
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>{review.time}</span>
                  </div>
                  <p className="text-secondary" style={{ fontSize: '0.9rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 6, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {review.text}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          <svg width="0" height="0">
            <defs>
              <linearGradient id="half-star" x1="0" x2="100%" y1="0" y2="0">
                <stop offset="40%" stopColor="#fbbc04" />
                <stop offset="40%" stopColor="#e0e0e0" />
              </linearGradient>
            </defs>
          </svg>
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
        .swiper-pagination-bullet-active { background: var(--accent-primary) !important; }
        .swiper-button-next, .swiper-button-prev { color: var(--accent-primary) !important; }
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

