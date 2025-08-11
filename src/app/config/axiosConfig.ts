import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:49667",
  timeout: 10000000000000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

export default api;
