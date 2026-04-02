import React, { useState } from 'react';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { interactionAPI } from '../services/api';
import './ProductCard.css';

const ProductCard = ({ product, onViewDetails, showScore = false }) => {
  const { addToCart } = useCart();
  const { user } = useUser();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent card click
    setIsAdding(true);
    const success = await addToCart(product._id);
    if (success) {
      alert('Added to cart!');
    }
    setIsAdding(false);
  };

  const handleCardClick = async () => {
    // Track view interaction
    if (user?._id) {
      try {
        await interactionAPI.track(user._id, product._id, 'view');
      } catch (error) {
        console.error('Failed to track view:', error);
      }
    }
    
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      {/* Product Image */}
      <div className="product-image-container">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="product-image"
        />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="stock-badge low-stock">
            Only {product.stock} left!
          </span>
        )}
        {product.stock === 0 && (
          <span className="stock-badge out-of-stock">Out of Stock</span>
        )}
      </div>

      {/* Product Info */}
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">
          {product.short_description?.substring(0, 80)}
          {product.short_description?.length > 80 && '...'}
        </p>

        {/* Recommendation Score */}
        {showScore && product.recommendationScore && (
          <div className="recommendation-score">
            <Star size={16} fill="#ffc107" color="#ffc107" />
            <span>{(product.recommendationScore * 100).toFixed(0)}% Match</span>
          </div>
        )}

        {/* Price and Actions */}
        <div className="product-footer">
          <div className="product-price">{formatPrice(product.price)}</div>
          <div className="product-actions">
            <button
              className="btn-view"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              title="View Details"
            >
              <Eye size={18} />
            </button>
            <button
              className="btn-add-cart"
              onClick={handleAddToCart}
              disabled={isAdding || product.stock === 0}
              title="Add to Cart"
            >
              {isAdding ? '...' : <ShoppingCart size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;