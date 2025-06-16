// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5400/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true
// });

// // Add a request interceptor to add the token to all requests
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default api;


import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5400/api", // Remove /api from baseURL
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

export default api;