import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

function Header({ onAuthClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems, favorites, auth } = useCart();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 1) {
      import('./data/products').then(module => {
        const results = module.products.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results.slice(0, 5));
        setShowResults(true);
      });
    } else {
      setShowResults(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { path: '/', label: 'Главная' },
    { path: '/catalog', label: 'Каталог' },
    { path: '/about', label: 'О нас' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">М</span>
            </div>
            <span className="text-2xl font-bold text-gray-800 hidden sm:block">
              Мебель<span className="text-amber-600">Мир</span>
            </span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-amber-600 border-b-2 border-amber-600'
                    : 'text-gray-600 hover:text-amber-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <div className="relative" ref={searchRef}>
              {isSearchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Поиск товаров..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                  />
                  <button type="submit" className="ml-2 p-2 text-amber-600 hover:text-amber-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setIsSearchOpen(false); setShowResults(false); }}
                    className="ml-1 p-2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </form>
              ) : (
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-gray-600 hover:text-amber-600 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              )}

              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                  {searchResults.map(product => (
                    <button
                      key={product.id}
                      onClick={() => {
                        navigate(`/product/${product.id}`);
                        setShowResults(false);
                        setIsSearchOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition text-left"
                    >
                      <img src={product.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                        <p className="text-sm text-amber-600 font-semibold">{product.price.toLocaleString()} ₽</p>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full py-2 bg-amber-50 text-amber-600 text-sm font-medium hover:bg-amber-100 transition"
                  >
                    Показать все результаты
                  </button>
                </div>
              )}
            </div>

            <Link to="/favorites" className="p-2 text-gray-600 hover:text-red-500 transition relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="p-2 text-gray-600 hover:text-amber-600 transition relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {auth.isLoggedIn ? (
              <Link
                to="/profile"
                className="flex items-center space-x-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Профиль</span>
              </Link>
            ) : (
              <button
                onClick={onAuthClick}
                className="flex items-center space-x-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Войти</span>
              </button>
            )}
          </div>

          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-3 space-y-2">
            <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button type="submit" className="p-2 bg-amber-600 text-white rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-amber-50 text-amber-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/favorites"
              className="flex items-center justify-between px-3 py-2 text-gray-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Избранное</span>
              {favorites.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="flex items-center justify-between px-3 py-2 text-gray-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Корзина</span>
              {totalItems > 0 && (
                <span className="bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            {auth.isLoggedIn ? (
              <Link
                to="/profile"
                className="block px-3 py-2 text-amber-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Профиль
              </Link>
            ) : (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onAuthClick();
                }}
                className="w-full text-left px-3 py-2 text-amber-600 font-medium"
              >
                Войти / Регистрация
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;