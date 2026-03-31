import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartAPI, interactionAPI } from '../services/api';
import { useUser } from './UserContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useUser();
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cart when user changes
  useEffect(() => {
    if (user?._id) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user?._id) return;
    
    try {
      setLoading(true);
      const response = await cartAPI.get(user._id);
      const cartData = response.data.data;
      
      setCart({
        items: cartData.items || [],
        totalItems: cartData.totalItems || 0,
        totalPrice: cartData.totalPrice || 0,
      });
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user?._id) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      setLoading(true);
      await cartAPI.addItem(user._id, productId, quantity);
      
      // Track interaction
      await interactionAPI.track(user._id, productId, 'cart');
      
      // Refresh cart
      await fetchCart();
      
      return true;
    } catch (err) {
      console.error('Failed to add to cart:', err);
      setError('Failed to add item to cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user?._id) return;

    try {
      setLoading(true);
      await cartAPI.updateItem(user._id, productId, quantity);
      await fetchCart();
    } catch (err) {
      console.error('Failed to update quantity:', err);
      setError('Failed to update cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user?._id) return;

    try {
      setLoading(true);
      await cartAPI.removeItem(user._id, productId);
      await fetchCart();
    } catch (err) {
      console.error('Failed to remove from cart:', err);
      setError('Failed to remove item');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      await cartAPI.clear(user._id);
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
    } catch (err) {
      console.error('Failed to clear cart:', err);
      setError('Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};