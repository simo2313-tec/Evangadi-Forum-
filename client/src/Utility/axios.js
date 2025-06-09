import axios from "axios";

const api = axios.create({
  baseURL: "https://7afc93dc-10ea-4928-9f77-c1165022e5cd.mock.pstmn.io",
});

export default api;
