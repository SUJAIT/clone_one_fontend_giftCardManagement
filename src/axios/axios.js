import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // ✅ তোমার backend এর URL
  withCredentials: false,
});

export default axiosInstance;
