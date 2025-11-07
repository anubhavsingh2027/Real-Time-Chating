import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:3000/api"
  : "https://careful-jayme-psit-84f63ed1.koyeb.app/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let accessToken = null;
let refreshToken = null;

export const setTokens = (access, refresh) => {
  accessToken = access;
  refreshToken = refresh;
  if (access) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

// Refresh token function
const refreshAccessToken = async () => {
  try {
    if (!refreshToken) throw new Error('No refresh token available');
    
    const response = await axios.post(`${BASE_URL}/auth/refresh`, {}, {
      headers: { 'Authorization': `Bearer ${refreshToken}` }
    });
    
    // Update only the access token, keep the same refresh token
    accessToken = response.data.accessToken;
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    
    return response.data.accessToken;
  } catch (error) {
    // Clear tokens on refresh failure
    accessToken = null;
    refreshToken = null;
    delete axiosInstance.defaults.headers.common['Authorization'];
    throw error;
  }
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Ensure credentials are always sent
    config.withCredentials = true;
    
    // Add authorization header if we have an access token
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

let handleUnauthorizedCallback = () => {};

export const setUnauthorizedCallback = (callback) => {
  handleUnauthorizedCallback = callback;
};

// List of endpoints that should not trigger the unauthorized modal
const AUTH_ENDPOINTS = [
  '/auth/login',
  '/auth/signup',
  '/auth/refresh',
  '/auth/logout'
];

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Extract the endpoint path from the full URL
    const requestPath = originalRequest.url.replace(BASE_URL, '');
    const isAuthEndpoint = AUTH_ENDPOINTS.some(endpoint => requestPath.includes(endpoint));

    // If 401 error, not an auth endpoint, and haven't tried refresh yet
    if (error.response?.status === 401 && !isAuthEndpoint && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Only trigger unauthorized handler for non-auth endpoints
        setAccessToken(null);
        if (!isAuthEndpoint) {
          handleUnauthorizedCallback();
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
