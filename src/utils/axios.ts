import axios from "axios";

const api = axios.create({
  baseURL: "https://collaborative-task-manager-backend-33u7.onrender.com/api",
  withCredentials: true, // 🔴 REQUIRED for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
