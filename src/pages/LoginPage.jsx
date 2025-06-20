import { useState, useContext } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axios/axios";
import { AuthContext } from "../providers/AuthProvider";
import { jwtDecode } from 'jwt-decode';

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { setUser } = useContext(AuthContext); // ✅ context function
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const res = await axiosInstance.post("/user/user-login", loginData);
  //     const { token, user } = res.data;

  //     // ✅ Save token and set user in context
  //     localStorage.setItem("token", token);
  //     setUser(user); // 👈 context update
      
  //     Swal.fire("Success!", "Logged in successfully", "success");

  //     // ✅ Navigate by role
  //     if (user.role === "admin") {
  //       navigate("/dollar-upload");
  //     } else {
  //       navigate("/dollar-buy");
  //     }

  //   } catch (error) {
  //     Swal.fire(
  //       "Login Failed",
  //       error.response?.data?.message || "Something went wrong",
  //       "error"
  //     );
  //   }
  // };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axiosInstance.post("/user/user-login", loginData);
    const { token } = res.data;

    // Decode token manually
    const decoded = jwtDecode(token);
    const user = {
      email: decoded.email,
      role: decoded.role,
    };

    localStorage.setItem("token", token);
    setUser(user); // 👈 directly update context

    Swal.fire("Success!", "Logged in successfully", "success");

    if (user.role === "admin") {
      navigate("/dollar-upload");
    } else {
      navigate("/dollar-buy");
    }

  } catch (error) {
    Swal.fire("Login Failed", error.response?.data?.message || "Something went wrong", "error");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="relative w-full max-w-sm">
        <div className="bg-white pt-16 pb-8 px-6 sm:px-12 rounded-xl shadow-md">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                required
                placeholder="Email"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                required
                placeholder="Password"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            {/* <div className="text-right text-sm text-blue-500 hover:underline cursor-pointer">
              Forgot password?
            </div> */}

            <button
              type="submit"
              className="w-full bg-green-800 text-white py-2 rounded-md font-semibold hover:opacity-90"
            >
              Login
            </button>
          </form>

          <div className="text-center mt-2">
            <span className="text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Create New Account
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
