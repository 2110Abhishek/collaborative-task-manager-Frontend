import api from "../utils/axios";

export const registerUser = (data: {
  email: string;
  password: string;
  name: string;
}) => api.post("/auth/register", data);

export const loginUser = (data: {
  email: string;
  password: string;
}) => api.post("/auth/login", data);

export const logoutUser = () => api.post("/auth/logout");

export const getMe = () => api.get("/auth/me");
