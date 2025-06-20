// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:5000", // ✅ তোমার backend এর URL
//   withCredentials: false,
// });

// export default axiosInstance;
// // http://localhost:5000/



import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
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
