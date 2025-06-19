import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "buyer", // default role
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
const res = await axios.post("https://sujait-gift-card-management-server.onrender.com/user/user-register", formData); // Update with your backend URL
      const { token, user } = res.data;

      // ✅ Store token & user
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      Swal.fire("Success!", "Account created successfully", "success");

      // ✅ Navigate based on role
      if (user.role === "admin") {
        navigate("/dollar-upload");
      } else {
        navigate("/dollar-buy");
      }
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Something went wrong", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="buyer">Buyer</option>
              <option value="admin" disabled >Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded-md font-semibold hover:opacity-90"
          >
            Register
          </button>
        </form>
<div className="text-center mt-2">
            <span className="text-sm ">
  Already have a account?{" "}
  <Link to="/login" className="text-blue-600 hover:underline font-medium">
    login
  </Link>
</span>
</div>
      </div>
    </div>
  );
};

export default RegisterPage;
