import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', brand: '', category_id: ''
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
        name: product.name, brand: product.brand || '', category_id: product.category_id
      });
      setImages(product.images || []);
    } else {
      setEditingId(null);
      setFormData({
        name: '', brand: '', category_id: categories[0]?.id || ''
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
      
      // Limit to 1 image for simplicity
      setImages([data.publicUrl]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        brand: formData.brand,
        category_id: formData.category_id,
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
                <select required className="input-field" value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Brand</label>
                <input className="input-field" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
              </div>
            </div>

            <h3 className="h3 mt-6 mb-4">Product Image</h3>
            <div className="mb-6">
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {images.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', width: '100px', height: '100px' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    <button type="button" onClick={() => removeImage(idx)} style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--danger)', color: 'white', borderRadius: '50%', width: '24px', height: '24px', border: 'none', cursor: 'pointer' }}>×</button>
                  </div>
                ))}
              </div>
              {images.length === 0 && (
                <div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} style={{ display: 'none' }} id="img-upload" />
                  <label htmlFor="img-upload" className="btn btn-outline" style={{ cursor: 'pointer' }}>
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </label>
                </div>
              )}
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
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr><td colSpan="5" className="text-center text-muted" style={{ padding: '2rem' }}>No products found.</td></tr>
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
                        <td>{p.brand || '-'}</td>
                        <td>{p.category?.name}</td>
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
