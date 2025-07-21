import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    agree: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isNotRegistered, setIsNotRegistered] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
    AOS.refresh();
  }, []);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (!formData.agree) newErrors.agree = "You must agree to the terms.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (validate()) {
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      console.log("Login Response:", data); // ✅ check structure

      if (response.ok) {
        localStorage.setItem("token", "123");
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("email", data.user.email);
        console.log("Token stored:"); 

        toast.success("Login successful!", { position: "top-center" });
        setTimeout(() => navigate("/"), 3000);
      } else {
        setIsNotRegistered(true);
        toast.error(data.message || "Login failed.", {
          position: "top-center",
        });
      }
    } catch (error) {
      setIsNotRegistered(true);
      toast.error("Network error. Please try again.", {
        position: "top-center",
      });
    }
  }
};

  return (
    <>
      <ToastContainer />
      <div className="pt-16 min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 px-4">
        <div
          data-aos="fade-up"
          className="max-w-3xl w-full bg-white/20 backdrop-blur-2xl rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.25)] grid md:grid-cols-2 overflow-hidden"
        >
          {/* Left Panel */}
          <div className="hidden md:flex flex-col justify-center items-center relative bg-gradient-to-br from-[#1f1c2c] to-[#928dab] p-10 text-white">
            <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
            <p className="text-center max-w-xs">
              AI agent to search, summarize, and answer questions from internal company documents.
            </p>
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-400 rounded-full blur-2xl opacity-30"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-400 rounded-full blur-3xl opacity-30"></div>
          </div>

          {/* Right Panel */}
          <div className="p-8 md:p-10 bg-white/90">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Login to SmartDocAI
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="peer w-full border border-gray-300 bg-white rounded-xl px-4 pt-5 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent"
                />
                <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500">
                  Email
                </label>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="peer w-full border border-gray-300 bg-white rounded-xl px-4 pt-5 pb-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent"
                />
                <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Agree to terms */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="accent-blue-600 w-4 h-4"
                />
                <label className="text-sm text-gray-600">
                  I agree to the{" "}
                  <span className="text-blue-600 underline cursor-pointer">
                    terms and conditions
                  </span>
                  .
                </label>
              </div>
              {errors.agree && (
                <p className="text-red-500 text-xs mt-1">{errors.agree}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:opacity-90 transition"
              >
                Log In
              </button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Register Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}