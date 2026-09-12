import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const location = useLocation();
  const prefilledProduct = location.state?.productId || null;
  const prefilledProductName = location.state?.productName || '';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validatePhone = (phone) => {
    const re = /^\d{10}$/;
    return re.test(phone.replace(/[\s-]/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    if (!formData.name.trim()) {
      setStatus('error');
      setErrorMessage('Name is required.');
      return;
    }

    if (!validatePhone(formData.phone)) {
      setStatus('error');
      setErrorMessage('Please enter a valid 10-digit phone number.');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        message: formData.message,
        status: 'new'
      };
      
      if (prefilledProduct) {
        payload.product_id = prefilledProduct;
      }

      const { data: insertData, error: insertError } = await supabase
        .from('enquiries')
        .insert([payload])
        .select();

      if (insertError) {
        console.error('Supabase Insert Error:', insertError);
        throw new Error(insertError.message || 'Database error occurred.');
      }

      fetch('/api/send-enquiry-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          message: formData.message,
          productName: prefilledProductName
        })
      }).catch(err => console.error('Failed to send email:', err));

      setStatus('success');
      setFormData({ name: '', phone: '', message: '' });

    } catch (err) {
      console.error('Enquiry submission error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Failed to submit enquiry. Please try calling us instead.');
    }
  };

  return (
    <div>
      <div className="section-alt" style={{ padding: '4rem 0', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container text-center">
          <h1 className="h1 text-primary-color mb-4">Contact Us</h1>
          <p className="text-secondary h4" style={{ fontWeight: 400, maxWidth: '800px', margin: '0 auto' }}>
            Whether you need a custom desktop quote, CCTV installation survey, or just expert IT advice, we're here to help.
          </p>
        </div>
      </div>

      <div className="container section">
        <div className="grid-2">
          
          {/* Contact Info & Map */}
          <div className="contact-info-col">
            <div className="card" style={{ padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <h3 className="h2 mb-8 text-primary-color">Get in Touch</h3>
              
              <div className="grid-2" style={{ gap: '2rem', marginBottom: '2rem', gridTemplateColumns: '1fr 1fr' }}>
                <div>
                  <h4 className="text-muted mb-2 font-bold" style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Visit Our Store</h4>
                  <p className="text-secondary" style={{ lineHeight: 1.6 }}>
                    #201, Thirumala Lodge,<br/>
                    Fish Market, Bangalore By Pass Rd,<br/>
                    near Hanumanthapuram,<br/>
                    Hosur, Tamil Nadu 635109
                  </p>
                </div>
                
                <div>
                  <h4 className="text-muted mb-2 font-bold" style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Call Us Directly</h4>
                  <a href="tel:07200040017" className="h3 text-accent-secondary" style={{ display: 'block', color: 'var(--accent-secondary)' }}>072000 40017</a>
                  
                  <h4 className="text-muted mb-2 mt-6 font-bold" style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Business Hours</h4>
                  <p className="text-secondary" style={{ lineHeight: 1.6 }}>
                    Monday - Saturday<br/>
                    10:00 AM - 8:30 PM<br/>
                    <span className="text-muted text-sm">Sunday Closed</span>
                  </p>
                </div>
              </div>

              <div style={{ flex: 1, minHeight: '300px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15569.231920803521!2d77.82098015!3d12.72624445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae713a299c8365%3A0xc6c76162aab35b5a!2sBest%20Computers!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Best Computers Location"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="contact-form-col">
            <div className="card" style={{ padding: '3rem 2.5rem', height: '100%' }}>
              <h3 className="h3 mb-2 text-primary-color">Send an Enquiry</h3>
              <p className="text-secondary mb-8">Fill out the form below and our team will get back to you shortly.</p>
              
              {prefilledProductName && (
                <div className="mb-6 p-4" style={{ backgroundColor: 'var(--bg-secondary)', borderLeft: '4px solid var(--accent-primary)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
                  <p className="text-secondary font-bold" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Enquiring about:</p>
                  <p className="font-bold text-primary-color mt-1">{prefilledProductName}</p>
                </div>
              )}

              {status === 'success' ? (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                  <div style={{ width: '80px', height: '80px', backgroundColor: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <h3 className="h2 mb-2 text-primary-color">Enquiry Sent!</h3>
                  <p className="text-secondary mb-8 text-lg">Thank you for reaching out. We have received your message and will contact you via phone soon.</p>
                  <button className="btn btn-outline" onClick={() => setStatus('idle')}>Send another enquiry</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="input-group">
                    <label className="input-label">Full Name <span className="text-danger">*</span></label>
                    <input 
                      type="text" 
                      name="name"
                      className="input-field" 
                      placeholder="John Doe" 
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Phone Number <span className="text-danger">*</span></label>
                    <input 
                      type="tel" 
                      name="phone"
                      className="input-field" 
                      placeholder="10-digit mobile number" 
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-group mb-8">
                    <label className="input-label">How can we help? (Optional)</label>
                    <textarea 
                      name="message"
                      className="input-field" 
                      placeholder="Any specific requirements for your PC build or CCTV setup?" 
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      style={{ resize: 'vertical' }}
                    ></textarea>
                  </div>

                  {status === 'error' && (
                    <div className="mb-6 p-4 rounded" style={{ backgroundColor: '#FEE2E2', color: '#991B1B', fontWeight: 500 }}>
                      {errorMessage}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                    disabled={status === 'submitting'}
                  >
                    {status === 'submitting' ? 'Submitting...' : 'Submit Enquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
      
      {/* FAQ Section */}
      <section className="section-alt">
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 className="h2 text-center text-primary-color mb-12">Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { q: 'Do you provide on-site installation for CCTV?', a: 'Yes, we provide professional on-site installation for all our CCTV systems across Hosur and nearby industrial areas. We handle wiring, camera mounting, and network setup for remote viewing on your phone.' },
              { q: 'Can I get a custom PC built for my specific needs?', a: 'Absolutely! Whether you need a workstation for 3D rendering or a high-end gaming PC, we can source the specific components you want and professionally assemble and test the system for you.' },
              { q: 'What is your warranty policy?', a: 'All products sold by Best Computers come with official brand warranties. We will assist you with the manufacturer RMA process should any hardware issues arise within the warranty period.' }
            ].map((faq, idx) => (
              <div key={idx} className="card" style={{ padding: '1.5rem 2rem' }}>
                <h4 className="h4 text-primary-color mb-2">{faq.q}</h4>
                <p className="text-secondary">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .contact-form-col { order: -1; }
          .contact-info-col { order: 1; margin-top: 2rem; }
        }
      `}} />
    </div>
  );
}
