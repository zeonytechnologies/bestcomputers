import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const CATEGORY_SPECS = {
  laptops: ['Processor', 'RAM', 'Storage', 'Display Size', 'Graphics Card', 'Operating System', 'Battery Life', 'Warranty'],
  desktops: ['Processor', 'RAM', 'Storage', 'Graphics Card', 'Motherboard', 'Cabinet/Form Factor', 'Monitor Included (Yes/No)', 'Warranty'],
  cctv: ['Camera Type (Dome/Bullet/PTZ)', 'Resolution', 'Number of Channels', 'Night Vision (Yes/No)', 'Storage (HDD size)', 'Mobile App Support (Yes/No)', 'Warranty']
};

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', brand: '', price: '', category_id: '', in_stock: true, specs: {}
  });
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        supabase.from('products').select('*, category:categories(name, slug)').order('created_at', { ascending: false }),
        supabase.from('categories').select('*')
      ]);
      if (prodRes.error) throw prodRes.error;
      if (catRes.error) throw catRes.error;
      
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenForm = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name, brand: product.brand || '', price: product.price || '',
        category_id: product.category_id, in_stock: product.in_stock, specs: product.specs || {}
      });
      setImages(product.images || []);
    } else {
      setEditingId(null);
      setFormData({
        name: '', brand: '', price: '', category_id: categories[0]?.id || '', in_stock: true, specs: {}
      });
      setImages([]);
    }
    setIsFormOpen(true);
  };

  const handleImageUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      
      setImages([...images, data.publicUrl]);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image!');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSpecChange = (key, value) => {
    setFormData(prev => ({ ...prev, specs: { ...prev.specs, [key]: value } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        brand: formData.brand,
        price: formData.price ? parseFloat(formData.price) : null,
        category_id: formData.category_id,
        in_stock: formData.in_stock,
        specs: formData.specs,
        images: images
      };

      if (editingId) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([payload]);
        if (error) throw error;
      }

      setIsFormOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        fetchData();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const selectedCat = categories.find(c => c.id === formData.category_id);
  const specKeys = selectedCat ? CATEGORY_SPECS[selectedCat.slug] || [] : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="h2">Products</h1>
        {!isFormOpen && <button className="btn btn-primary" onClick={() => handleOpenForm()}>Add Product</button>}
      </div>

      {isFormOpen ? (
        <div className="card" style={{ padding: '2rem' }}>
          <h2 className="h3 mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid-3">
              <div className="input-group">
                <label className="input-label">Name *</label>
                <input required className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Category *</label>
                <select required className="input-field" value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value, specs: {}})}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Brand</label>
                <input className="input-field" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Price (₹)</label>
                <input type="number" step="0.01" className="input-field" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div className="input-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem' }}>
                <input type="checkbox" id="in_stock" checked={formData.in_stock} onChange={e => setFormData({...formData, in_stock: e.target.checked})} />
                <label htmlFor="in_stock" className="input-label" style={{ margin: 0 }}>In Stock</label>
              </div>
            </div>

            <h3 className="h3 mt-6 mb-4">Specifications</h3>
            <div className="grid-3 mb-6">
              {specKeys.map(key => (
                <div key={key} className="input-group">
                  <label className="input-label">{key}</label>
                  <input className="input-field" value={formData.specs[key] || ''} onChange={e => handleSpecChange(key, e.target.value)} />
                </div>
              ))}
            </div>

            <h3 className="h3 mb-4">Images</h3>
            <div className="mb-6">
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {images.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', width: '100px', height: '100px' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    <button type="button" onClick={() => removeImage(idx)} style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--danger)', color: 'white', borderRadius: '50%', width: '24px', height: '24px', border: 'none', cursor: 'pointer' }}>×</button>
                  </div>
                ))}
              </div>
              <div>
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} style={{ display: 'none' }} id="img-upload" />
                <label htmlFor="img-upload" className="btn btn-outline" style={{ cursor: 'pointer' }}>
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <button type="submit" className="btn btn-primary">Save Product</button>
              <button type="button" className="btn btn-ghost" onClick={() => setIsFormOpen(false)}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card">
          {loading ? (
            <p className="text-muted text-center" style={{ padding: '2rem' }}>Loading products...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr><td colSpan="6" className="text-center text-muted" style={{ padding: '2rem' }}>No products found.</td></tr>
                  ) : (
                    products.map(p => (
                      <tr key={p.id}>
                        <td>
                          {p.images && p.images.length > 0 ? (
                            <img src={p.images[0]} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                          ) : (
                            <div style={{ width: '40px', height: '40px', background: 'var(--bg-secondary)', borderRadius: '4px' }}></div>
                          )}
                        </td>
                        <td className="font-medium">{p.name}</td>
                        <td>{p.category?.name}</td>
                        <td>₹{p.price?.toLocaleString('en-IN') || '-'}</td>
                        <td>
                          {p.in_stock ? <span className="badge badge-success">Yes</span> : <span className="badge badge-danger">No</span>}
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={() => handleOpenForm(p)}>Edit</button>
                            <button className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }} onClick={() => handleDelete(p.id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
