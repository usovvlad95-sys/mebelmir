import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

const API_URL = 'http://127.0.0.1:8000/api';

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();
  
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    comment: '',
    paymentMethod: 'card'
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem('token');
    
    const orderData = {
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      total_price: totalPrice,
      customer_info: formData,
      status: 'new',
      created_at: new Date().toISOString()
    };

    try {
      let response;
      
      if (token) {
        response = await fetch(`${API_URL}/orders/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(orderData)
        });
      } else {
        response = await fetch(`${API_URL}/orders/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData)
        });
      }

      if (response.ok) {
        clearCart();
        setOrderSuccess(true);
      } else {
        saveGuestOrder(orderData);
      }
    } catch (err) {
      saveGuestOrder(orderData);
    }
    
    setIsSubmitting(false);
  };

  const saveGuestOrder = (orderData) => {
    const guestOrders = JSON.parse(localStorage.getItem('guestOrders') || '[]');
    const newOrder = {
      ...orderData,
      id: Date.now(),
      status: 'new',
      created_at: new Date().toISOString()
    };
    guestOrders.unshift(newOrder);
    localStorage.setItem('guestOrders', JSON.stringify(guestOrders));
    clearCart();
    setOrderSuccess(true);
  };

  if (orderSuccess) {
    return (
      <div className="py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-green-50 rounded-3xl p-12 border border-green-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Заказ оформлен! 🎉</h2>
            <p className="text-gray-600 mb-2">Спасибо за покупку!</p>
            <p className="text-gray-500 text-sm mb-8">
              Мы свяжемся с вами в ближайшее время для подтверждения заказа.
              <br />Номер вашего заказа: <span className="font-bold text-amber-600">#{Date.now().toString().slice(-6)}</span>
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/catalog"
                className="px-8 py-3 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition"
              >
                Продолжить покупки
              </Link>
              <Link
                to="/profile"
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-amber-600 hover:text-amber-600 transition"
              >
                Мои заказы
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Корзина пуста</h2>
          <p className="text-gray-500 mb-8">Добавьте товары из каталога</p>
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

  if (showCheckout) {
    return (
      <div className="py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => setShowCheckout(false)}
            className="flex items-center text-gray-500 hover:text-amber-600 mb-6 transition"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Вернуться к корзине
          </button>

          <h1 className="text-3xl font-bold text-gray-800 mb-8">Оформление заказа</h1>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Ваш заказ ({cartItems.length} товаров)</h2>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.quantity} шт. × {item.price.toLocaleString()} ₽</p>
                  </div>
                  <p className="font-semibold text-amber-600">{(item.price * item.quantity).toLocaleString()} ₽</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <span className="text-lg font-medium text-gray-700">Итого к оплате:</span>
              <span className="text-2xl font-bold text-amber-600">{totalPrice.toLocaleString()} ₽</span>
            </div>
          </div>

          <form onSubmit={handleSubmitOrder} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Контактные данные</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ФИО *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Иванов Иван Иванович"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Телефон *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+7 (999) 123-45-67"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Город *</label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="Москва"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Адрес доставки *</label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="ул. Примерная, д. 1, кв. 10"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Комментарий к заказу</label>
              <textarea
                name="comment"
                rows="3"
                placeholder="Дополнительная информация для курьера..."
                value={formData.comment}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Способ оплаты</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${formData.paymentMethod === 'card' ? 'border-amber-600 bg-amber-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-amber-600"
                  />
                  <div>
                    <p className="font-medium text-gray-800">Картой онлайн</p>
                    <p className="text-xs text-gray-500">Visa, MasterCard, МИР</p>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${formData.paymentMethod === 'cash' ? 'border-amber-600 bg-amber-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-amber-600"
                  />
                  <div>
                    <p className="font-medium text-gray-800">Наличными</p>
                    <p className="text-xs text-gray-500">При получении</p>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${formData.paymentMethod === 'installment' ? 'border-amber-600 bg-amber-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="installment"
                    checked={formData.paymentMethod === 'installment'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-amber-600"
                  />
                  <div>
                    <p className="font-medium text-gray-800">Рассрочка 0%</p>
                    <p className="text-xs text-gray-500">До 12 месяцев</p>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isSubmitting ? 'Оформляем заказ...' : `Оплатить ${totalPrice.toLocaleString()} ₽`}
            </button>
            
            <p className="text-center text-gray-400 text-sm mt-4">
              Нажимая кнопку, вы соглашаетесь с условиями доставки и оплаты
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Корзина</h1>

        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-500 text-sm">{item.category}</p>
                <p className="text-amber-600 font-bold mt-1">{item.price.toLocaleString()} ₽</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg text-gray-600">Итого:</span>
            <span className="text-2xl font-bold text-amber-600">{totalPrice.toLocaleString()} ₽</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={clearCart}
              className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
            >
              Очистить
            </button>
            <button 
              onClick={() => setShowCheckout(true)}
              className="flex-1 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition"
            >
              Оформить заказ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;