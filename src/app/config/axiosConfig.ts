import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:65120",
  timeout: 10000000000000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

export default api;
