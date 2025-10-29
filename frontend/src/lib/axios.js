import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "https://real-time-chating-957e.onrender.com/api" : "https://real-time-chating-957e.onrender.com/api",
  withCredentials: true,
});
