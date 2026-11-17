import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUpload,
  FiFeather,
  FiCheck,
  FiArrowRight,
} from "react-icons/fi";
import { GlassCard } from "../components/ui/GlassCard";
import { GlassButton } from "../components/ui/GlassButton";

function Register() {
  const { setIsAuthenticated, setProfile } = useAuth();
  const navigateTo = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    education: "",
  });
  const [photo, setPhoto] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPhotoPreview(reader.result);
      setPhoto(file);
    };
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!form.name || !form.email || !form.phone || !form.password || !form.role || !form.education) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!photo) {
      toast.error("Please upload a profile photo.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }
    formData.append("photo", photo);

    try {
      const { data } = await axios.post("/api/user/register", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("jwt", data.token);
      toast.success(data.message || "Registration successful! Welcome aboard. 🎉");

      setProfile(data.user || data.newUser);
      setIsAuthenticated(true);
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 pt-20 pb-16">
      <div className="w-full max-w-lg">
        <GlassCard radius="hero" className="!p-8 sm:!p-10 shadow-2xl space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3F0071] via-[#332FD0] to-[#FB2576] flex items-center justify-center text-white shadow-md shadow-[#332FD0]/30">
                <FiFeather className="text-xl" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
                Dedicated<span className="bg-gradient-to-r from-[#FB2576] to-[#332FD0] bg-clip-text text-transparent">Blog</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              Create Your Account
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">
              Join our community of readers, researchers, and technical authors
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center justify-center pb-2">
              <div className="relative group cursor-pointer">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-20 h-20 rounded-3xl object-cover border-2 border-[#332FD0] shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-3xl glass-panel border border-[var(--glass-border)] flex flex-col items-center justify-center text-[var(--text-muted)] group-hover:text-[#FB2576] transition-colors">
                    <FiUpload size={22} />
                    <span className="text-[10px] mt-1 font-medium">Photo</span>
                  </div>
                )}
                <label className="absolute inset-0 cursor-pointer opacity-0">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={changePhotoHandler}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mt-1.5">
                {photo ? "Click to change photo" : "Click to upload avatar (Required)"}
              </p>
            </div>

            {/* Grid Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <FiUser className="absolute left-3.5 text-[var(--text-muted)] text-sm pointer-events-none" />
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    className="glass-input w-full py-2.5 pl-9 pr-3 text-xs sm:text-sm font-normal rounded-xl"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Email
                </label>
                <div className="relative flex items-center">
                  <FiMail className="absolute left-3.5 text-[var(--text-muted)] text-sm pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="glass-input w-full py-2.5 pl-9 pr-3 text-xs sm:text-sm font-normal rounded-xl"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Phone Number
                </label>
                <div className="relative flex items-center">
                  <FiPhone className="absolute left-3.5 text-[var(--text-muted)] text-sm pointer-events-none" />
                  <input
                    type="number"
                    name="phone"
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={handleChange}
                    className="glass-input w-full py-2.5 pl-9 pr-3 text-xs sm:text-sm font-normal rounded-xl"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Role
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="glass-input w-full py-2.5 px-3 text-xs sm:text-sm font-normal rounded-xl cursor-pointer"
                >
                  <option value="" disabled>Select role</option>
                  <option value="user">Reader / User</option>
                  <option value="admin">Author / Admin</option>
                </select>
              </div>

              {/* Education */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Education
                </label>
                <select
                  name="education"
                  value={form.education}
                  onChange={handleChange}
                  className="glass-input w-full py-2.5 px-3 text-xs sm:text-sm font-normal rounded-xl cursor-pointer"
                >
                  <option value="" disabled>Select degree</option>
                  <option value="BCA">BCA</option>
                  <option value="MCA">MCA</option>
                  <option value="B.Tech">B.Tech / B.E.</option>
                  <option value="MBA">MBA</option>
                  <option value="BBA">BBA</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Password */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Password
                </label>
                <div className="relative flex items-center">
                  <FiLock className="absolute left-3.5 text-[var(--text-muted)] text-sm pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="glass-input w-full py-2.5 pl-9 pr-9 text-xs sm:text-sm font-normal rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                  >
                    {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <GlassButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              loading={loading}
              iconRight={FiArrowRight}
              className="w-full mt-2"
            >
              Complete Registration
            </GlassButton>
          </form>

          {/* Switch to Login */}
          <div className="pt-4 border-t border-[var(--glass-border-subtle)] text-center text-xs text-[var(--text-secondary)]">
            <span>Already registered? </span>
            <Link to="/login" className="font-bold text-[#332FD0] dark:text-[#B4B2FF] hover:text-[#FB2576] hover:underline">
              Sign In Instead
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export default Register;
