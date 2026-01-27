/**
 * App Component
 * Root application component with routing
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProductsPageV3 } from './pages/ProductsPageV3';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to products */}
        <Route path="/" element={<Navigate to="/products" replace />} />
        
        {/* Products page */}
        <Route path="/products" element={<ProductsPageV3 />} />
        
        {/* Future routes can be added here */}
        {/* <Route path="/products/:id" element={<ProductDetailPage />} /> */}
        
        {/* 404 Not Found - future */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

