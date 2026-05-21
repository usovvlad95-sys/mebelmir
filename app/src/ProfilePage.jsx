import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

const API_URL = 'http://127.0.0.1:8000/api';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [apiOrders, setApiOrders] = useState([]);
  const [guestOrders, setGuestOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', phone: '', address: '' });
  const navigate = useNavigate();
  const { auth, logout } = useCart();

  useEffect(() => {
    // Если НЕ залогинен — показываем заглушку сразу
    if (!auth.isLoggedIn) {
      setLoading(false);
      return;
    }

    // Загружаем данные пользователя
    fetch(`${API_URL}/profile/`, {
      headers: { 'Authorization': `Bearer ${auth.token}` }
    })
    .then(res => {
      if (!res.ok) throw new Error('Ошибка авторизации');
      return res.json();
    })
    .then(data => {
      setUser(data);
      setFormData({ username: data.username, email: data.email, phone: '', address: '' });
    })
    .catch(() => {
      logout();
    });

    // Загружаем заказы
    fetch(`${API_URL}/orders/`, {
      headers: { 'Authorization': `Bearer ${auth.token}` }
    })
    .then(res => res.json())
    .then(data => setApiOrders(Array.isArray(data) ? data : []))
    .catch(() => setApiOrders([]));

    const savedGuestOrders = JSON.parse(localStorage.getItem('guestOrders') || '[]');
    setGuestOrders(savedGuestOrders);

    setLoading(false);
  }, [auth.isLoggedIn, auth.token, logout]);

  const allOrders = [...apiOrders, ...guestOrders].sort((a, b) => {
    const dateA = new Date(a.created_at || a.createdAt || 0);
    const dateB = new Date(b.created_at || b.createdAt || 0);
    return dateB - dateA;
  });

  const getStatusText = (status) => {
    switch(status) {
      case 'new': return 'Новый';
      case 'processing': return 'В обработке';
      case 'shipped': return 'Отправлен';
      case 'delivered': return 'Доставлен';
      case 'cancelled': return 'Отменён';
      default: return 'Новый';
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'new': return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'processing': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-600 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-amber-100 text-amber-600 border-amber-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered': return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      );
      case 'shipped': return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      );
      default: return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUser({ ...user, ...formData });
    setEditMode(false);
  };

  // НЕ ЗАЛОГИНЕН — заглушка
  if (!auth.isLoggedIn && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-16">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Вход в профиль</h2>
          <p className="text-gray-500 mb-6">Войдите в аккаунт, чтобы видеть заказы и настройки</p>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition"
          >
            На главную
          </button>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full"></div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Шапка профиля */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-amber-600 to-orange-500"></div>
          
          <div className="relative pt-16">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white">
                <span className="text-4xl font-bold text-amber-600">
                  {user.username[0].toUpperCase()}
                </span>
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800">{user.username}</h1>
                <p className="text-gray-500 mt-1">{user.email}</p>
                <div className="flex gap-3 mt-3">
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                    {allOrders.length} заказов
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Активный
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Редактировать
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Табы */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-4 text-center font-medium transition relative ${
                activeTab === 'orders' ? 'text-amber-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Мои заказы
                {allOrders.length > 0 && (
                  <span className="bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full text-xs">
                    {allOrders.length}
                  </span>
                )}
              </span>
              {activeTab === 'orders' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"></div>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-4 text-center font-medium transition relative ${
                activeTab === 'settings' ? 'text-amber-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Настройки
              </span>
              {activeTab === 'settings' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"></div>
              )}
            </button>
          </div>

          {/* Контент табов */}
          <div className="p-8">
            {activeTab === 'orders' && (
              <>
                {allOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg mb-2">У вас пока нет заказов</p>
                    <p className="text-gray-400 text-sm mb-6">Сделайте свой первый заказ в каталоге</p>
                    <button 
                      onClick={() => navigate('/catalog')}
                      className="px-6 py-3 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition"
                    >
                      Перейти в каталог
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allOrders.map(order => (
                      <div key={order.id} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition">
                        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-gray-800">Заказ #{order.id}</span>
                            <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {getStatusText(order.status)}
                            </span>
                          </div>
                          <span className="text-gray-500 text-sm">
                            {new Date(order.created_at || order.createdAt).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        
                        <div className="px-6 py-4">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                              <img src={item.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
                              <div className="flex-1">
                                <p className="font-medium text-gray-800">{item.name}</p>
                                <p className="text-sm text-gray-500">{item.quantity} шт. × {item.price?.toLocaleString()} ₽</p>
                              </div>
                              <p className="font-bold text-gray-800">{(item.price * item.quantity).toLocaleString()} ₽</p>
                            </div>
                          ))}
                        </div>
                        
                        <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
                          <span className="text-gray-600">Итого:</span>
                          <span className="text-xl font-bold text-amber-600">
                            {order.total_price?.toLocaleString() || order.totalPrice?.toLocaleString()} ₽
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-xl">
                {editMode ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Имя пользователя</label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                      <input
                        type="tel"
                        placeholder="+7 (999) 123-45-67"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Адрес доставки по умолчанию</label>
                      <input
                        type="text"
                        placeholder="г. Москва, ул. Примерная, д. 1"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button type="submit" className="px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition font-medium">
                        Сохранить
                      </button>
                      <button type="button" onClick={() => setEditMode(false)} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition">
                        Отмена
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Имя пользователя</p>
                        <p className="font-medium text-gray-800">{user.username}</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-800">{user.email}</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Телефон</p>
                        <p className="font-medium text-gray-800">{formData.phone || 'Не указан'}</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Адрес доставки</p>
                        <p className="font-medium text-gray-800">{formData.address || 'Не указан'}</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;