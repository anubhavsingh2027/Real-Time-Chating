import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "https://chatting.anubhav.sbs/api"
      : "https://chatting.anubhav.sbs/api",
  withCredentials: true,
});
