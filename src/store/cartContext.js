'use client';

import { createContext, useContext, useReducer, useEffect, useCallback, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

const MAX_QUANTITY = 10;

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'INIT_CART':
      return action.payload || [];
    case 'ADD_TO_CART': {
      const existingProduct = state.find(item =>
        item.id === action.product.id && item.selectedOption === action.product.selectedOption
      );
      if (existingProduct) {
        if (existingProduct.quantity >= MAX_QUANTITY) {
          return state; // Уведомление обрабатывается отдельно
        }
        return state.map(item =>
          item.id === action.product.id && item.selectedOption === action.product.selectedOption
            ? { ...item, quantity: Math.min(item.quantity + 1, MAX_QUANTITY) }
            : item
        );
      }
      return [...state, { ...action.product, quantity: 1 }];
    }
    case 'REMOVE_FROM_CART':
      return state.filter(item => item.id !== action.id || item.selectedOption !== action.option);
    case 'INCREMENT_QUANTITY':
      return state.map(item => {        
        if (item.id === action.id && item.selectedOption === action.option) {
          if (item.quantity >= MAX_QUANTITY) {
            return item; // Уведомление отдельно
          }
          return { ...item, quantity: Math.min(item.quantity + 1, MAX_QUANTITY) };
        }
        return item;
      });
    case 'DECREMENT_QUANTITY':
      return state.map(item =>
        item.id === action.id && item.selectedOption === action.option
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      );
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const hasShownLimitToast = useRef(false); // уведомление только один раз
  const timerRef = useRef(null); // Ссылка для таймера
  const prevCartRef = useRef([]);

  // Инициализация корзины
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'INIT_CART', payload: parsedCart });
        prevCartRef.current = parsedCart;
      } catch (e) {
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Сохранение корзины
  useEffect(() => {
    // Проверяем, действительно ли изменилась корзина
    if (JSON.stringify(prevCartRef.current) !== JSON.stringify(cart)) {
      if (cart.length > 0) {
        localStorage.setItem('cart', JSON.stringify(cart));
      } else {
        localStorage.removeItem('cart');
      }
      prevCartRef.current = cart;
    }
  }, [cart]);

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const addToCart = useCallback((product) => {
    const existingProduct = cart.find(
      item => item.id === product.id && item.selectedOption === product.selectedOption
    );
    if (existingProduct?.quantity >= MAX_QUANTITY) {
      if (!hasShownLimitToast.current) {
        toast.error('Нельзя добавить больше 10 штук этого букета в корзину');
        hasShownLimitToast.current = true;

        // Устанавливаем таймер для сброса флага через 3-5 секунд
        timerRef.current = setTimeout(() => {
          hasShownLimitToast.current = false;
        }, 3000); // 3 секунды, можно увеличить до 5000 (5 секунд)
      }
      return;
    }
    dispatch({ type: 'ADD_TO_CART', product });
  }, [cart]);

  const increaseQuantity = useCallback((id, option) => {
    const existingProduct = cart.find(
      item => item.id === id && item.selectedOption === option
    );
    if (existingProduct?.quantity >= MAX_QUANTITY) {
      if (!hasShownLimitToast.current) {
        toast.error('Максимум 10 штук одного букета');
        hasShownLimitToast.current = true;

        // Таймер для сброса уведомления
        timerRef.current = setTimeout(() => {
          hasShownLimitToast.current = false;
        }, 3000);
      }
      return;
    }
    dispatch({ type: 'INCREMENT_QUANTITY', id, option });
  }, [cart]);

  const removeFromCart = useCallback((id, option) => {
    dispatch({ type: 'REMOVE_FROM_CART', id, option });
    hasShownLimitToast.current = false; // Сброс флага при удалении
  }, []);

  const decreaseQuantity = useCallback((id, option) => {
    dispatch({ type: 'DECREMENT_QUANTITY', id, option });
    hasShownLimitToast.current = false; // Сброс флага при уменьшении
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
    hasShownLimitToast.current = false; // Сброс флага
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);