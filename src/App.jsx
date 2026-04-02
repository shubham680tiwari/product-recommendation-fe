import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import ProductList from './components/ProductList';
import SearchBar from './components/SearchBar';
import Cart from './components/Cart';
import ProductDetailsModal from './components/ProductDetailsModal';
import RecommendationWidget from './components/RecommendationWidget';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import { useUser } from './context/UserContext';
import { productAPI } from './services/api';
import './App.css';

function AppContent() {
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showSearch, setShowSearch] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch all products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResults = (results, searchType, query) => {
    setSearchResults({
      products: results,
      searchType,
      query
    });
    setShowSearch(false);
  };

  const clearSearch = () => {
    setSearchResults(null);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="app">
      {/* Navbar */}
      <NavBar
        onSearchClick={() => setShowSearch(true)}
        onCartClick={() => setShowCart(true)}
      />

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Personalized Recommendations (only on home page, not search results) */}
          {!searchResults && user?._id && (
            <RecommendationWidget
              type="user"
              limit={6}
            />
          )}

          {/* Search Results or All Products */}
          {searchResults ? (
            <>
              <div className="search-results-header">
                <div>
                  <h2>
                    {searchResults.searchType === 'text' && '🔍 '}
                    {searchResults.searchType === 'semantic' && '✨ '}
                    {searchResults.searchType === 'hybrid' && '⚡ '}
                    Search Results for "{searchResults.query}"
                  </h2>
                  <p className="search-type-label">
                    Using: <strong>{searchResults.searchType}</strong> search
                  </p>
                </div>
                <button className="btn btn-secondary" onClick={clearSearch}>
                  Show All Products
                </button>
              </div>
              <ProductList
                products={searchResults.products}
                loading={false}
                error={null}
                onViewDetails={handleViewProduct}
                showScores={searchResults.searchType === 'semantic' || searchResults.searchType === 'hybrid'}
                title={`Found ${searchResults.products.length} products`}
              />
            </>
          ) : (
            <>
              <ProductList
                products={products}
                loading={loading}
                error={error}
                onViewDetails={handleViewProduct}
                title="All Products"
              />
            </>
          )}
        </div>
      </main>

      {/* Search Modal */}
      {showSearch && (
        <SearchBar
          onResults={handleSearchResults}
          onClose={() => setShowSearch(false)}
        />
      )}

      {/* Cart Sidebar */}
      <Cart
        isOpen={showCart}
        onClose={() => setShowCart(false)}
      />

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </UserProvider>
  );
}

export default App;