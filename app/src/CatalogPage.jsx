import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import { getProducts } from './api';
import { products as localProducts } from './data/products';

// Простой debounce хук
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Инициализация состояний из URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  );
  const [maxPrice, setMaxPrice] = useState(
    parseInt(searchParams.get('maxPrice')) || 200000
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get('sort') || 'popular'
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState(
    searchParams.get('view') || 'grid'
  );

  // Debounce для поиска
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Синхронизация URL с состоянием
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (maxPrice !== 200000) params.set('maxPrice', maxPrice.toString());
    if (sortBy !== 'popular') params.set('sort', sortBy);
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (viewMode !== 'grid') params.set('view', viewMode);
    
    setSearchParams(params, { replace: true });
  }, [selectedCategory, maxPrice, sortBy, debouncedSearch, viewMode, setSearchParams]);

  // Загрузка товаров
  useEffect(() => {
    let cancelled = false;

    getProducts()
      .then(data => {
        if (cancelled) return;
        if (data && Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(localProducts);
        }
        setLoading(false);
      })
      .catch(err => {
        if (cancelled) return;
        console.warn('API недоступен, используем локальные данные:', err);
        setProducts(localProducts);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  // Все категории из products.js
  const categories = useMemo(() => [
    { id: 'all', label: 'Все товары' },
    { id: 'living', label: 'Гостиная' },
    { id: 'bedroom', label: 'Спальня' },
    { id: 'kitchen', label: 'Кухня' },
    { id: 'office', label: 'Офис' },
    { id: 'kids', label: 'Детская' },
    { id: 'hallway', label: 'Прихожая' },
    { id: 'garden', label: 'Сад' },
    { id: 'accessories', label: 'Аксессуары' },
  ], []);

  // Фильтрация и сортировка через useMemo (корректная цепочка)
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
      const matchPrice = product.price <= maxPrice;
      const matchSearch = !debouncedSearch || 
        product.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchCategory && matchPrice && matchSearch;
    });

    // Сортировка
    const sorted = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'new': return b.id - a.id;
        case 'discount': return (b.discount || 0) - (a.discount || 0);
        case 'rating': return b.rating - a.rating;
        default: // popular — по количеству отзывов
          return (b.reviews || 0) - (a.reviews || 0);
      }
    });

    return sorted;
  }, [products, selectedCategory, maxPrice, debouncedSearch, sortBy]);

  // Активные фильтры для чипсов
  const activeFilters = useMemo(() => {
    const filters = [];
    if (selectedCategory !== 'all') {
      const cat = categories.find(c => c.id === selectedCategory);
      filters.push({ type: 'category', label: cat?.label, value: selectedCategory });
    }
    if (maxPrice !== 200000) {
      filters.push({ type: 'price', label: `до ${maxPrice.toLocaleString()} ₽`, value: maxPrice });
    }
    if (debouncedSearch) {
      filters.push({ type: 'search', label: `Поиск: "${debouncedSearch}"`, value: debouncedSearch });
    }
    return filters;
  }, [selectedCategory, maxPrice, debouncedSearch, categories]);

  // Сброс фильтров
  const handleReset = useCallback(() => {
    setSelectedCategory('all');
    setMaxPrice(200000);
    setSearchQuery('');
    setSortBy('popular');
    setSearchParams({});
  }, [setSearchParams]);

  // Удаление конкретного фильтра
  const removeFilter = useCallback((type) => {
    switch (type) {
      case 'category': setSelectedCategory('all'); break;
      case 'price': setMaxPrice(200000); break;
      case 'search': setSearchQuery(''); break;
      default: break;
    }
  }, []);

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-2xl p-4 h-96">
                  <div className="bg-gray-200 rounded-xl h-48 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Каталог мебели</h1>
          <p className="text-gray-500 mt-2">Найдите идеальную мебель для вашего дома</p>
        </div>

        {/* Поиск и сортировка */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white cursor-pointer"
            >
              <option value="popular">По популярности</option>
              <option value="price-asc">Сначала дешевые</option>
              <option value="price-desc">Сначала дорогие</option>
              <option value="discount">По скидке</option>
              <option value="rating">По рейтингу</option>
              <option value="new">Новинки</option>
            </select>
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
              title={viewMode === 'grid' ? 'Список' : 'Сетка'}
            >
              {viewMode === 'grid' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Активные фильтры (чипсы) */}
        {activeFilters.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-500">Активные фильтры:</span>
            {activeFilters.map((filter, idx) => (
              <span
                key={`${filter.type}-${idx}`}
                className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium"
              >
                {filter.label}
                <button
                  onClick={() => removeFilter(filter.type)}
                  className="hover:text-amber-900 ml-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
            <button
              onClick={handleReset}
              className="text-sm text-gray-500 hover:text-gray-700 underline ml-2"
            >
              Сбросить все
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Кнопка фильтров на мобильных */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span>Фильтры</span>
          </button>

          {/* Сайдбар фильтров */}
          <aside className={`lg:w-64 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-lg">Фильтры</h3>
                <button 
                  onClick={() => setIsFilterOpen(false)} 
                  className="lg:hidden text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Категории */}
              <div className="mb-8">
                <h4 className="font-medium text-gray-800 mb-3">Категория</h4>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition flex justify-between items-center ${
                        selectedCategory === cat.id
                          ? 'bg-amber-50 text-amber-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{cat.label}</span>
                      {selectedCategory === cat.id && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Цена */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-3">Максимальная цена</h4>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="1000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>0 ₽</span>
                    <span className="font-semibold text-amber-600">{maxPrice.toLocaleString()} ₽</span>
                  </div>
                </div>
              </div>

              {/* Сброс */}
              <button
                onClick={handleReset}
                className="w-full py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition font-medium"
              >
                Сбросить фильтры
              </button>
            </div>
          </aside>

          {/* Список товаров */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-gray-600">
                Найдено товаров: <span className="font-semibold text-gray-800">{filteredProducts.length}</span>
              </span>
            </div>
            
            {filteredProducts.length > 0 ? (
              <div className={`
                transition-all duration-300 ease-in-out
                ${viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" 
                  : "space-y-4"
                }
              `}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xl text-gray-500 mb-2">Товары не найдены</p>
                <p className="text-gray-400 mb-6">Попробуйте изменить фильтры или поиск</p>
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                >
                  Сбросить все фильтры
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CatalogPage;