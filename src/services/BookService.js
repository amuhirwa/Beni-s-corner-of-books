// services/bookService.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';
// const TOKEN = localStorage.getItem('token'); // Assuming you store the auth token in localStorage
console.log(localStorage.getItem('token'));

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    // 'Authorization': `JWT ${TOKEN}`,
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const TOKEN = localStorage.getItem('token');
    // Add the token to the request headers
    config.headers.Authorization = `Bearer ${TOKEN}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redirect to login page on token expiration
    }
  }
);

export const bookService = {
  // Book endpoints
  async searchBooks(query) {
    const response = await api.get(`/books/?search=${query}`);
    return response.data;
  },

  async addBook(bookData) {
    const response = await api.post('/books/', bookData);
    return response.data;
  },

  // Book tracking endpoints
  async getMyBooks() {
    const response = await api.get('/booktracking/');
    return response.data;
  },

  async updateBookStatus(trackingId, status) {
    const response = await api.patch(`/booktracking/${trackingId}/`, { status });
    return response.data;
  },

  async updateBookProgress(trackingId, progress) {
    const response = await api.patch(`/booktracking/${trackingId}/`, { progress });
    return response.data;
  },

  async rateBook(trackingId, rating) {
    const response = await api.patch(`/booktracking/${trackingId}/`, { rating });
    return response.data;
  },

  async addToLibrary(bookId) {
    const response = await api.post('/booktracking/', {
      book: bookId,
      status: 'want_to_read'
    });
    return response.data;
  },

  // Comment endpoints
  async getBookComments(bookId) {
    const response = await api.get(`/bookcomments/?book=${bookId}`);
    return response.data;
  },

  async addComment(bookId, comment) {
    const response = await api.post('/bookcomments/', {
      book: bookId,
      comment
    });
    return response.data;
  }
};
