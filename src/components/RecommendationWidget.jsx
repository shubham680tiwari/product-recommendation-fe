import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCart';
import { recommendationAPI } from '../services/api';
import { useUser } from '../context/UserContext';
import './RecommendationWidget.css';

const RecommendationWidget = ({ type = 'user', productId = null, limit = 6 }) => {
  const { user } = useUser();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, [user, productId, type]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      let response;

      if (type === 'user' && user?._id) {
        response = await recommendationAPI.getForUser(user._id, limit);
      } else if (type === 'similar' && productId) {
        response = await recommendationAPI.getSimilar(productId, limit);
      } else {
        setRecommendations([]);
        setLoading(false);
        return;
      }

      setRecommendations(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="recommendation-widget">
        <div className="widget-header">
          <h3>
            <Sparkles size={24} />
            {type === 'user' ? 'Recommended For You' : 'Similar Products'}
          </h3>
        </div>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || recommendations.length === 0) {
    return null; // Don't show widget if no recommendations
  }

  return (
    <div className="recommendation-widget">
      <div className="widget-header">
        <h3>
          <Sparkles size={24} />
          {type === 'user' ? 'Recommended For You' : 'You May Also Like'}
        </h3>
        {type === 'user' && (
          <p className="widget-subtitle">
            Based on your {recommendations[0]?.interactionCount || 0} interactions
          </p>
        )}
      </div>

      <div className="recommendation-grid">
        {recommendations.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            showScore={type === 'user'}
          />
        ))}
      </div>

      {type === 'user' && recommendations.length >= limit && (
        <button className="view-more-btn">
          View More Recommendations
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
};

export default RecommendationWidget;