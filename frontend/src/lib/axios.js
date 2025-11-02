import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "https://chatting.backend.anubhav.sbs/api"
      : "https://chatting.backend.anubhav.sbs/api",
  withCredentials: true,
});
