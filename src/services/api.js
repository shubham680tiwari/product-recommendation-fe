import axios from 'axios';

const API = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for error handling
API.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error: ', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// Product API
export const productAPI = {
    // Get all products
    getAll: () => API.get('/products'),

    // Get single product
    getById: (id) => API.get(`/products/${id}`),

    // create product
    create: (productData) => API.post('/products', productData),

    // update product
    update: (id, productData) => API.put(`/products/${id}`, productData),

    // Delete product
    delete: (id) => API.delete(`/products/${id}`),

    // Text search
    search: (query) => API.get(`/products/search?q=${query}`),

    // Semantic search
    semanticSearch: (query, limit) => API.get('/products/semantic-search', {query, limit}),
};

// User API
export const userAPI = {
    // Create User
    create: (userData) => API.post('/users', userData),

    // Get All user
    getAll: () => API.get('/users'),

    // Get by Id
    getById: (id) => API.get(`/users/${id}`),

}

// Cart API
export const cartAPI = {
    // Get cart
    get: (userId) => API.get(`/caert/${userId}`),

    // Add to cart
    addItem: (userId, productId, quantity=1) => API.post('/cart/add', {userId, productId, quantity}),

    // Update Item
    updateItem: (userId, productId, quantity=1) => API.put('/cart/update', {userId, productId, quantity}),

    // Remove item
    removeItem: (userId, productId) => API.delete('/cart/remove', {userId, productId}),

    // Clear cart
    clear: (userId) => API.delete(`/cart/clear/${userId}`)
};

// Intercation API
export const interactionAPI = {
    // Track
    track: (userId, productId, interactionType = 'view') => 
        API.post('/interaction/track', {userId, productId, interactionType}),

    // Get user profile
    getProfile: (userId) => API.get(`/interaction/profile/${userId}`),
};

// Recommendation API
export const recommendationAPI = {
    // Get user's recommended products
    getForUser: (userId, limit=10) => API.get(`/recommendations/user/${userId}?limit=${limit}`),

    // Get similar products
    getSimilar: (productId, limit=6) => API.get(`/recommendations/similar/${productId}?limit=${limit}`),
};
