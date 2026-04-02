import React, { useEffect } from 'react';
import { X, ShoppingCart, Package, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { interactionAPI } from '../services/api';
import RecommendationWidget from './RecommendationWidget';
import './ProductDetailsModal.css';

const ProductDetailsModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { user } = useUser();

  useEffect(() => {
    // Track view when modal opens
    if (user?._id && product?._id) {
      interactionAPI.track(user._id, product._id, 'view');
    }
  }, [product, user]);

  if (!product) return null;

  const handleAddToCart = async () => {
    const success = await addToCart(product._id);
    if (success) {
      alert('Added to cart!');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  return (
    <div className="product-details-overlay" onClick={onClose}>
      <div className="product-details-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={28} />
        </button>

        {/* Product Content */}
        <div className="product-details-content">
          {/* Left Side - Image */}
          <div className="product-details-image-section">
            <img
              src={product.imageUrl || 'https://via.placeholder.com/500'}
              alt={product.name}
              className="product-details-image"
            />
          </div>

          {/* Right Side - Details */}
          <div className="product-details-info-section">
            <div className="product-category-badge">{product.category}</div>
            <h1 className="product-details-title">{product.name}</h1>
            
            <div className="product-details-price">
              {formatPrice(product.price)}
            </div>

            <div className="product-details-description">
              <h3>Description</h3>
              <p>{product.long_description || product.short_description}</p>
            </div>

            {/* Stock Info */}
            <div className="product-stock-info">
              <Package size={20} />
              {product.stock > 10 ? (
                <span className="in-stock">In Stock ({product.stock} available)</span>
              ) : product.stock > 0 ? (
                <span className="low-stock">Only {product.stock} left!</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>

            {/* Actions */}
            <div className="product-details-actions">
              <button
                className="btn-add-to-cart-large"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="similar-products-section">
          <RecommendationWidget
            type="similar"
            productId={product._id}
            limit={4}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;