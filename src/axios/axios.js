import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://sujait-gift-card-management-server.onrender.com", // ✅ তোমার backend এর URL
  withCredentials: false,
});

export default axiosInstance;
// https://sujait-gift-card-management-server.onrender.com/
