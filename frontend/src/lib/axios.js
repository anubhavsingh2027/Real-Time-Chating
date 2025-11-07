import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development"
  ? "https://careful-jayme-psit-84f63ed1.koyeb.app/api"
  : "https://careful-jayme-psit-84f63ed1.koyeb.app/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let accessToken = null;

// Function to set the access token
export const setAccessToken = (token) => {
  accessToken = token;
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

// Function to get a new access token using the refresh token
const refreshAccessToken = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/refresh`, {}, {
      withCredentials: true
    });
    return response.data.accessToken;
  } catch (error) {
    throw error;
  }
};

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't already tried to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh token is also invalid, redirect to login
        setAccessToken(null);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
