import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

const API_URL = 'http://127.0.0.1:8000/api';

// Ключ localStorage с префиксом пользователя
const getStorageKey = (key, userId) => {
  return userId ? `${key}_user_${userId}` : `${key}_guest`;
};

export function CartProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const user = savedUser ? JSON.parse(savedUser) : null;
    return { isLoggedIn: !!token, user, token: token || null };
  });

  // Ключи хранилища зависят от пользователя
  const cartKey = getStorageKey('cart', auth.user?.id);
  const favKey = getStorageKey('favorites', auth.user?.id);

  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Загружаем данные при монтировании и при смене пользователя
  useEffect(() => {
    const savedCart = localStorage.getItem(cartKey);
    setCartItems(savedCart ? JSON.parse(savedCart) : []);
    
    const savedFav = localStorage.getItem(favKey);
    setFavorites(savedFav ? JSON.parse(savedFav) : []);
  }, [cartKey, favKey]);

  // Сохраняем при изменении
  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, cartKey]);

  useEffect(() => {
    localStorage.setItem(favKey, JSON.stringify(favorites));
  }, [favorites, favKey]);

  // Проверка токена при загрузке
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${API_URL}/profile/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) throw new Error('Invalid token');
        return res.json();
      })
      .then(user => {
        localStorage.setItem('user', JSON.stringify(user));
        setAuth({ isLoggedIn: true, user, token });
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuth({ isLoggedIn: false, user: null, token: null });
      });
    }
  }, []);

  const login = useCallback((token, user = null) => {
    localStorage.setItem('token', token);
    if (user) localStorage.setItem('user', JSON.stringify(user));
    setAuth({ isLoggedIn: true, user, token });
  }, []);

  const logout = useCallback(() => {
    // УДАЛЯЕМ ТОКЕН И ПОЛЬЗОВАТЕЛЯ
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // СБРАСЫВАЕМ СОСТОЯНИЕ В ПАМЯТИ
    setAuth({ isLoggedIn: false, user: null, token: null });
    setCartItems([]);
    setFavorites([]);
    
    // ПЕРЕЗАГРУЖАЕМ СТРАНИЦУ ДЛЯ ПОЛНОГО СБРОСА
    window.location.href = '/';
  }, []);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCartItems([]);

  const toggleFavorite = (product) => {
    setFavorites((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isFavorite = (productId) => favorites.some((item) => item.id === productId);

  const removeFromFavorites = (productId) => {
    setFavorites((prev) => prev.filter((item) => item.id !== productId));
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        totalItems, 
        totalPrice,
        favorites,
        toggleFavorite,
        isFavorite,
        removeFromFavorites,
        auth,
        login,
        logout
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}