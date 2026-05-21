import React from 'react';
import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <section className="relative bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-transparent z-10" />
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1920")' }}
      />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Создай уют в своём <span className="text-amber-500">доме</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Более 5000 моделей мебели для любого интерьера. Бесплатная доставка, гарантия 5 лет и рассрочка 0%.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/catalog"
              className="inline-flex items-center justify-center px-8 py-4 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition transform hover:scale-105"
            >
              Смотреть каталог
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            {/* КНОПКА ПОЗВОНИТЬ — РАБОТАЕТ */}
            <a 
              href="tel:+79991234567"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition"
            >
              <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Позвонить нам
            </a>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <svg className="text-amber-500 w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <div>
              <p className="text-white font-semibold">Бесплатная доставка</p>
              <p className="text-gray-400 text-sm">При заказе от 10 000 ₽</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <svg className="text-amber-500 w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <p className="text-white font-semibold">Гарантия 5 лет</p>
              <p className="text-gray-400 text-sm">На всю мебель</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <svg className="text-amber-500 w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <div>
              <p className="text-white font-semibold">Возврат 30 дней</p>
              <p className="text-gray-400 text-sm">Без объяснения причин</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;