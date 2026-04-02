import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, clearCart, loading } = useCart();

  if (!isOpen) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  return (
    <>
      {/* Overlay */}
      <div className="cart-overlay" onClick={onClose}></div>

      {/* Cart Sidebar */}
      <div className="cart-sidebar">
        {/* Header */}
        <div className="cart-header">
          <h2>
            <ShoppingBag size={24} />
            Shopping Cart
          </h2>
          <button className="cart-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="cart-items">
          {cart.items.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={64} color="#ccc" />
              <p>Your cart is empty</p>
              <button className="btn btn-primary" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {cart.items.map((item) => (
                <div key={item.productId._id} className="cart-item">
                  <img
                    src={item.productId.imageUrl || 'https://via.placeholder.com/80'}
                    alt={item.productId.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h4>{item.productId.name}</h4>
                    <p className="cart-item-price">{formatPrice(item.priceAtAdd)}</p>
                    
                    {/* Quantity Controls */}
                    <div className="cart-item-quantity">
                      <button
                        onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                        disabled={loading || item.quantity <= 1}
                        className="qty-btn"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                        disabled={loading}
                        className="qty-btn"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    className="cart-item-remove"
                    onClick={() => removeFromCart(item.productId._id)}
                    disabled={loading}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              {/* Clear Cart */}
              {cart.items.length > 0 && (
                <button
                  className="clear-cart-btn"
                  onClick={clearCart}
                  disabled={loading}
                >
                  Clear Cart
                </button>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>{formatPrice(cart.totalPrice)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span className="free-shipping">FREE</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>{formatPrice(cart.totalPrice)}</span>
              </div>
            </div>
            <button className="checkout-btn" disabled={loading}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;