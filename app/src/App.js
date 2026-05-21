import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './CartContext';
import Header from './Header';
import Footer from './Footer';
import AuthModal from './AuthModal';
import HomePage from './HomePage';
import CatalogPage from './CatalogPage';
import AboutPage from './AboutPage';
import CartPage from './CartPage';
import ProductPage from './ProductPage';
import ProfilePage from './ProfilePage';
import FavoritesPage from './FavoritesPage';

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header onAuthClick={() => setIsAuthOpen(true)} />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Routes>
          </main>
          <Footer />
          <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;