// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "https://clone-one-server-giftcardmanagement.onrender.com", // ✅ তোমার backend এর URL
//   withCredentials: false,
// });

// export default axiosInstance;
// // https://clone-one-server-giftcardmanagement.onrender.com/



import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://clone-one-server-giftcardmanagement.onrender.com",
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
