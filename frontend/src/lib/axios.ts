import axios from "axios";
import { API_BASE_URL } from "@/utils/constants";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("lms_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
