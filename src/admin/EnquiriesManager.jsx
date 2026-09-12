import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function EnquiriesManager() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, new, contacted, closed

  useEffect(() => {
    fetchEnquiries();
  }, [filter]);

  async function fetchEnquiries() {
    setLoading(true);
    try {
      let query = supabase.from('enquiries').select('*, product:products(name)').order('created_at', { ascending: false });
      
      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setEnquiries(data || []);
    } catch (err) {
      console.error('Error fetching enquiries:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { error } = await supabase.from('enquiries').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      
      // Update local state instead of refetching for better UX
      setEnquiries(enquiries.map(enq => enq.id === id ? { ...enq, status: newStatus } : enq));
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'new': return 'badge badge-warning';
      case 'contacted': return 'badge badge-primary'; // fallback to standard or custom class
      case 'closed': return 'badge badge-success';
      default: return 'badge';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="h2">Enquiries</h1>
        <div className="flex items-center gap-2">
          <label className="text-muted" style={{ fontSize: '0.875rem' }}>Filter Status:</label>
          <select className="input-field" style={{ width: 'auto' }} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>
      
      <div className="card">
        {loading ? (
          <p className="text-muted text-center" style={{ padding: '2rem' }}>Loading enquiries...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Product</th>
                  <th>Message</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }} className="text-muted">No enquiries found.</td>
                  </tr>
                ) : (
                  enquiries.map(enq => (
                    <tr key={enq.id}>
                      <td style={{ whiteSpace: 'nowrap' }} className="text-secondary">{new Date(enq.created_at).toLocaleDateString()}</td>
                      <td className="font-medium">{enq.name}</td>
                      <td>
                        <a href={`tel:${enq.phone}`} className="text-primary hover:underline">{enq.phone}</a>
                      </td>
                      <td>{enq.product?.name || <span className="text-muted">General</span>}</td>
                      <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={enq.message}>
                        {enq.message || '-'}
                      </td>
                      <td>
                        <select 
                          className="input-field" 
                          style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.875rem', height: 'auto' }}
                          value={enq.status}
                          onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
