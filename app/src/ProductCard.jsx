import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';

function ProductCard({ product, viewMode = 'grid' }) {
  const { addToCart, toggleFavorite, isFavorite } = useCart();
  const liked = isFavorite(product.id);

  const discountPercent = product.oldPrice 
    ? Math.round((1 - product.price / product.oldPrice) * 100) 
    : product.discount || null;

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden flex">
        <Link to={`/product/${product.id}`} className="block relative w-48 h-48 overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          />
          {discountPercent && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discountPercent}%
            </span>
          )}
        </Link>
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < product.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
              <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
            </div>
            <Link to={`/product/${product.id}`}>
              <h3 className="text-lg font-semibold text-gray-800 mb-1 hover:text-amber-600 transition">
                {product.name}
              </h3>
            </Link>
            <p className="text-sm text-gray-500 mb-3">{product.category}</p>
          </div>
          <div className="flex items-end justify-between">
            <div>
              {product.oldPrice && (
                <span className="text-sm text-gray-400 line-through mr-2">
                  {product.oldPrice.toLocaleString()} ₽
                </span>
              )}
              <span className="text-xl font-bold text-amber-600">
                {product.price.toLocaleString()} ₽
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleFavorite(product)}
                className={`p-3 rounded-xl transition ${liked ? 'bg-red-50 text-red-500' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                <svg className="w-5 h-5" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product);
                }}
                className="p-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {discountPercent && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discountPercent}%
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition ${
            liked ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-400 hover:text-red-500'
          }`}
        >
          <svg className="w-5 h-5" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </Link>

      <div className="p-5">
        <div className="flex items-center space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < product.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2 hover:text-amber-600 transition">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-500 mb-3">{product.category}</p>

        <div className="flex items-end justify-between">
          <div>
            {product.oldPrice && (
              <span className="text-sm text-gray-400 line-through mr-2">
                {product.oldPrice.toLocaleString()} ₽
              </span>
            )}
            <span className="text-xl font-bold text-amber-600">
              {product.price.toLocaleString()} ₽
            </span>
          </div>
          <button 
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="p-3 bg-gray-100 rounded-xl hover:bg-amber-600 hover:text-white transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;