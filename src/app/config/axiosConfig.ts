import axios from "axios";

const api = axios.create({
  baseURL: "https://debugae-btbda0bja8frhnb4.eastus2-01.azurewebsites.net",
  timeout: 10000000000000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

export default api;
