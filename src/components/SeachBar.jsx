import React, { useState } from 'react';
import { Search, Sparkles, X } from 'lucide-react';
import { productAPI } from '../services/api';
import './SearchBar.css';

const SearchBar = ({ onResults, onClose }) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('text'); // 'text' or 'semantic'
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      alert('Please enter a search query');
      return;
    }

    setLoading(true);

    try {
      let response;
      if (searchType === 'text') {
        response = await productAPI.search(query);
      } else {
        response = await productAPI.semanticSearch(query, 20);
      }

      onResults(response.data.data, searchType, query);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-overlay">
      <div className="search-modal">
        {/* Close Button */}
        <button className="search-close" onClick={onClose}>
          <X size={24} />
        </button>

        {/* Title */}
        <h2 className="search-title">Search Products</h2>

        {/* Search Type Toggle */}
        <div className="search-type-toggle">
          <button
            className={`toggle-btn ${searchType === 'text' ? 'active' : ''}`}
            onClick={() => setSearchType('text')}
          >
            <Search size={18} />
            Text Search
          </button>
          <button
            className={`toggle-btn ${searchType === 'semantic' ? 'active' : ''}`}
            onClick={() => setSearchType('semantic')}
          >
            <Sparkles size={18} />
            AI Search
          </button>
        </div>

        {/* Search Info */}
        <div className="search-info">
          {searchType === 'text' ? (
            <p>🔍 Search by exact keywords in product name or description</p>
          ) : (
            <p>✨ AI-powered search understands meaning (e.g., "phone with stylus" finds "Galaxy with S Pen")</p>
          )}
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder={
              searchType === 'text'
                ? 'e.g., iPhone, laptop, shoes...'
                : 'e.g., premium phone with good camera...'
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button
            type="submit"
            className="search-submit-btn"
            disabled={loading || !query.trim()}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Example Searches */}
        <div className="search-examples">
          <p className="examples-title">Try these:</p>
          <div className="example-chips">
            {searchType === 'text' ? (
              <>
                <button onClick={() => setQuery('laptop')}>laptop</button>
                <button onClick={() => setQuery('phone')}>phone</button>
                <button onClick={() => setQuery('wireless')}>wireless</button>
              </>
            ) : (
              <>
                <button onClick={() => setQuery('device for taking photos')}>device for taking photos</button>
                <button onClick={() => setQuery('something for fitness')}>something for fitness</button>
                <button onClick={() => setQuery('premium smartphone')}>premium smartphone</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;