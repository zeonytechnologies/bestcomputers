import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';
import Home from './pages/Home';
import Category from './pages/Category';
import Contact from './pages/Contact';

// Admin
import AdminLayout from './admin/AdminLayout';
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';
import ProductsManager from './admin/ProductsManager';
import EnquiriesManager from './admin/EnquiriesManager';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Storefront Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="category/:slug" element={<Category />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductsManager />} />
          <Route path="enquiries" element={<EnquiriesManager />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
