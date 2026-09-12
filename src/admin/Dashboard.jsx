import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [newEnquiries, setNewEnquiries] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { count: prodCount, error: prodError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });
        if (prodError) throw prodError;

        const { count: enqCount, error: enqError } = await supabase
          .from('enquiries')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'new');
        if (enqError) throw enqError;

        setTotalProducts(prodCount || 0);
        setNewEnquiries(enqCount || 0);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h1 className="h2 mb-6">Dashboard</h1>
      <div className="grid-3">
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 className="text-secondary mb-2">Total Products</h3>
          <p className="h1">{totalProducts}</p>
        </div>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 className="text-secondary mb-2">New Enquiries</h3>
          <p className="h1 text-gradient">{newEnquiries}</p>
        </div>
      </div>
    </div>
  );
}
