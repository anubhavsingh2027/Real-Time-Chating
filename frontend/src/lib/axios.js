import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "https://real-time-chating-83oz.onrender.com/api",
  withCredentials: true,
});
