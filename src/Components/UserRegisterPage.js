// ✅ MODIFIED VERSION of RegisterPage.jsx
// Ensures ONLY phone input is filtered live and not copied into other fields like password

import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const countries = ["India", "United States", "Canada", "Germany", "Australia", "Japan", "France"];

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    c_full_name: "",
    c_email: "",
    c_password: "",
    confirmPassword: "",
    c_phone: "",
    c_country: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
    AOS.refresh();
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case "c_full_name":
        return !value || value.length > 20 ? "Name is required and must be under 20 characters." : "";
      case "c_email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Enter a valid email address.";
      case "c_phone":
        return /^\d{10}$/.test(value) ? "" : "Phone number must be exactly 10 digits.";
      case "c_country":
        return countries.includes(value) ? "" : "Please select a valid country.";
      case "c_password":
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/.test(value)
          ? ""
          : "Password must be 8-15 characters with upper, lower, digit, and special character.";
      case "confirmPassword":
        return value === formData.c_password ? "" : "Passwords do not match.";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: validateField(name, value) }));
  };

  const handlePhoneInput = (e) => {
    const keyAllowed = /^[0-9]$/.test(e.key) || ["Backspace", "ArrowLeft", "ArrowRight", "Tab", "Delete"].includes(e.key);
    if (!keyAllowed) {
      e.preventDefault();
    }
  };

  const handlePhonePaste = (e) => {
    const pasted = e.clipboardData.getData("text");
    if (!/^\d+$/.test(pasted)) {
      e.preventDefault();
    }
  };

  const validate = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    debugger;
    e.preventDefault();
    if (validate()) {
      try {
        const payload = { ...formData };
        delete payload.confirmPassword;
        const response = await fetch("http://localhost:5002/api/UserApi/Register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          setIsRegistered(true);
          toast.success("Registration successful! Redirecting to login...", { position: "top-center" });
          setTimeout(() => navigate("/login"), 5000);
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || "Registration failed.", { position: "top-center" });
        }
      } catch {
        toast.error("Network error. Please try again.", { position: "top-center" });
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-400 px-4 py-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row w-full max-w-5xl shadow-2xl rounded-3xl overflow-hidden backdrop-blur-md bg-white/30 border border-white/20">

          {/* 🔵 Left Panel */}
          <div className="hidden md:flex w-full md:w-1/2 items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-10 rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
            <div className="flex flex-col items-center text-center space-y-6 relative">
              <div className="relative w-36 h-36 animate-float">
                <div className="absolute inset-0 rounded-full bg-white shadow-xl flex items-center justify-center text-4xl font-bold text-blue-700 z-10">
                  TV
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-white animate-pulse-glow z-0"></div>
              </div>
              <h2 className="text-4xl font-bold text-white drop-shadow-lg" data-aos="fade-down">
                Join TrustVault 🚀
              </h2>
              <p className="text-white text-lg max-w-md drop-shadow-sm" data-aos="fade-up" data-aos-delay="200">
                Experience the future of secure financial services with luxury style and high-grade security.
              </p>
            </div>
          </div>

          {/* 🟢 Right Form Panel */}
          <div className="w-full md:w-1/2 p-6 md:p-10 bg-white rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none"
            data-aos={window.innerWidth < 768 ? "zoom-in" : ""}
            data-aos-delay={window.innerWidth < 768 ? "100" : ""}
          >
            <h2 className="text-2xl bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 text-transparent bg-clip-text font-bold mb-6 text-center text-3x1  ">Create your TrustVault Account</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="relative">
                <input
                  type="text"
                  name="c_full_name"
                  value={formData.c_full_name}
                  onChange={handleChange}
                  className={`peer w-full border ${errors.c_full_name ? 'border-red-500' : 'border-gray-300'} bg-white rounded-xl px-4 pt-6 pb-2 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-transparent`}
                  placeholder="Full Name"
                  required
                />
                <label className="absolute left-4 top-1 text-gray-500 text-sm transition-all peer-focus:top-1 peer-focus:text-sm peer-focus:text-pink-500">Full Name</label>
                {errors.c_full_name && <p className="text-red-500 text-xs mt-1">{errors.c_full_name}</p>}
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  name="c_email"
                  value={formData.c_email}
                  onChange={handleChange}
                  className={`peer w-full border ${errors.c_email ? 'border-red-500' : 'border-gray-300'} bg-white rounded-xl px-4 pt-6 pb-2 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-transparent`}
                  placeholder="Email"
                  required
                />
                <label className="absolute left-4 top-1 text-gray-500 text-sm transition-all peer-focus:top-1 peer-focus:text-sm peer-focus:text-pink-500">Email</label>
                {errors.c_email && <p className="text-red-500 text-xs mt-1">{errors.c_email}</p>}
              </div>

              {/* Phone */}
              <div className="relative">
                <input
                  type="text"
                  name="c_phone"
                  inputMode="numeric"
                  value={formData.c_phone}
                  maxLength={10}
                  onKeyDown={handlePhoneInput}
                  onPaste={handlePhonePaste}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setFormData({ ...formData, c_phone: value });
                    setErrors((prev) => ({ ...prev, c_phone: validateField("c_phone", value) }));
                  }}
                  className={`peer w-full border ${errors.c_phone ? 'border-red-500' : 'border-gray-300'} bg-white rounded-xl px-4 pt-6 pb-2 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-transparent`}
                  placeholder="Phone Number"
                  required
                />
                <label className="absolute left-4 top-1 text-gray-500 text-sm transition-all peer-focus:top-1 peer-focus:text-sm peer-focus:text-pink-500">Phone Number</label>
                {errors.c_phone && <p className="text-red-500 text-xs mt-1">{errors.c_phone}</p>}
              </div>

              {/* Country */}
              <div className="relative">
                <select
                  name="c_country"
                  value={formData.c_country}
                  onChange={handleChange}
                  className={`peer w-full border ${errors.c_country ? 'border-red-500' : 'border-gray-300'} bg-white rounded-xl px-4 pt-6 pb-3 pr-12 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none`}
                  required
                >
                  <option value="" disabled hidden></option>
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                <label className="absolute left-4 top-1 text-sm text-gray-500 transition-all peer-focus:text-pink-500">Country</label>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 14a1 1 0 01-.7-.3l-4-4a1 1 0 011.4-1.4L10 11.6l3.3-3.3a1 1 0 011.4 1.4l-4 4a1 1 0 01-.7.3z" clipRule="evenodd" />
                  </svg>
                </div>
                {errors.c_country && <p className="text-red-500 text-xs mt-1">{errors.c_country}</p>}
              </div>

              {/* Password and Confirm Password */}
              {[{
                label: "Password",
                name: "c_password",
                type: showPassword ? "text" : "password",
                toggle: () => setShowPassword(!showPassword),
                icon: showPassword ? <EyeOff size={20} /> : <Eye size={20} />,
              }, {
                label: "Confirm Password",
                name: "confirmPassword",
                type: showConfirmPassword ? "text" : "password",
                toggle: () => setShowConfirmPassword(!showConfirmPassword),
                icon: showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />,
              }].map(({ label, name, type, toggle, icon }) => (
                <div key={name} className="relative">
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className={`peer w-full border ${errors[name] ? 'border-red-500' : 'border-gray-300'} bg-white rounded-xl px-4 pt-6 pb-2 pr-10 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-transparent`}
                    placeholder={label}
                    required
                  />
                  <label className="absolute left-4 top-1 text-gray-500 text-sm transition-all peer-focus:top-1 peer-focus:text-sm peer-focus:text-pink-500">{label}</label>
                  <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    {icon}
                  </button>
                  {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
                </div>
              ))}

              <button
                type="submit"
                className="w-full py-3 mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold shadow-lg hover:opacity-90 transition"
              >
                Create Account
              </button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full py-2 mt-2 text-blue-600 font-medium underline hover:text-blue-800"
              >
                Sign In Instead
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* 🎨 Floating Glow Animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
          }
          50% {
            box-shadow: 0 0 30px 10px rgba(255, 255, 255, 0.6);
          }
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s infinite ease-in-out;
        }
      `}</style>
    </>
  );
}