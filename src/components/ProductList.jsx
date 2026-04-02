import React from 'react';
import ProductCard from './ProductCart';
import './ProductList.css';

const ProductList = ({ products, loading, error, onViewDetails, showScores = false, title = 'Products' }) => {
  if (loading) {
    return (
      <div className="product-list-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-list-container">
        <div className="error-message">
          <p>❌ {error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="product-list-container">
        <div className="empty-state">
          <h3>No products found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h2>{title}</h2>
        <span className="product-count">{products.length} items</span>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onViewDetails={onViewDetails}
            showScore={showScores}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;