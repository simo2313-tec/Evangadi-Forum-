import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5400/api",
});

export default api;
