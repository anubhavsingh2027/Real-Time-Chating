import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "https://chating-backend.anubhavsingh.website/api" : "https://chating-backend.anubhavsingh.website/api",
  withCredentials: true,
});
