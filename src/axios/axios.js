// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "https://sujait-gift-card-management-server.onrender.com", // ✅ তোমার backend এর URL
//   withCredentials: false,
// });

// export default axiosInstance;
// // https://sujait-gift-card-management-server.onrender.com/



import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://sujait-gift-card-management-server.onrender.com",
});

// Automatically attach token to every request if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
