import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem("user"); // Get the whole user object string
    if (userString) {
      const userData = JSON.parse(userString);
      if (userData && userData.token) {
        config.headers.Authorization = `Bearer ${userData.token}`; // Use token from user object
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 429) {
      toast.error("Too many requests. Please try again after 15 minutes.");
      // Return a promise that rejects after 3.5 seconds.
      // This allows time for the toast to be seen and ensures the loading spinner will eventually stop.
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(error);
        }, 3500);
      });
    }
    return Promise.reject(error);
  }
);

export default api;
