import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { products } from './data/products';

function PopularProducts() {
  const popularProducts = products.slice(0, 6);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Популярные товары</h2>
            <p className="text-gray-500 mt-2">Самые продаваемые модели этого месяца</p>
          </div>
          <Link
            to="/catalog"
            className="hidden sm:flex items-center text-amber-600 font-medium hover:text-amber-700 transition"
          >
            Все товары
            <svg className="ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularProducts;