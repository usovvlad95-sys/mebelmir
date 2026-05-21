import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* О компании */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">М</span>
              </div>
              <span className="text-xl font-bold text-white">
                Мебель<span className="text-amber-600">Мир</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Создаём уют в вашем доме с 2015 года. Качественная мебель по доступным ценам с доставкой по всей России.
            </p>
            <div className="flex space-x-3">
              <a href="https://vk.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-amber-600 transition text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
                </svg>
              </a>
              <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-amber-600 transition text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Навигация */}
          <div>
            <h3 className="text-white font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => handleNav('/')} className="hover:text-amber-500 transition text-left">
                  Главная
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/catalog')} className="hover:text-amber-500 transition text-left">
                  Каталог
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/about')} className="hover:text-amber-500 transition text-left">
                  О нас
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/cart')} className="hover:text-amber-500 transition text-left">
                  Корзина
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/favorites')} className="hover:text-amber-500 transition text-left">
                  Избранное
                </button>
              </li>
            </ul>
          </div>

          {/* Категории */}
          <div>
            <h3 className="text-white font-semibold mb-4">Категории</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => handleNav('/catalog')} className="hover:text-amber-500 transition text-left">
                  Гостиная
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/catalog')} className="hover:text-amber-500 transition text-left">
                  Спальня
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/catalog')} className="hover:text-amber-500 transition text-left">
                  Кухня
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/catalog')} className="hover:text-amber-500 transition text-left">
                  Детская
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/catalog')} className="hover:text-amber-500 transition text-left">
                  Офис
                </button>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-white font-semibold mb-4">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+79991234567" className="hover:text-amber-500 transition">+7 (999) 123-45-67</a>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@mebelmir.ru" className="hover:text-amber-500 transition">info@mebelmir.ru</a>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-amber-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>г. Москва, ул. Мебельная, д. 15</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Пн-Пт: 9:00 - 21:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>© 2026 МебельМир. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;