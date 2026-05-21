import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import ProductCard from './ProductCard';

function FavoritesPage() {
  const { favorites, removeFromFavorites } = useCart();

  if (favorites.length === 0) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Избранное пусто</h2>
          <p className="text-gray-500 mb-8">Добавьте товары в избранное, нажав на сердечко</p>
          <Link
            to="/catalog"
            className="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition"
          >
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Избранное ({favorites.length})</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FavoritesPage;