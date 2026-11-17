import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { FiMail, FiLock, FiEye, FiEyeOff, FiFeather, FiArrowRight } from "react-icons/fi";
import { GlassCard } from "../components/ui/GlassCard";
import { GlassButton } from "../components/ui/GlassButton";

function Login() {
  const { setIsAuthenticated, setProfile } = useAuth();
  const navigateTo = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password || !role) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        "/api/user/login",
        { email, password, role },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      localStorage.setItem("jwt", data.token);
      toast.success(data.message || "Welcome back! Logged in successfully.");

      setProfile(data.user);
      setIsAuthenticated(true);
      navigateTo("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 pt-16">
      <div className="w-full max-w-md">
        {/* Glass Card Container */}
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
              Sign In to Your Account
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">
              Enter your credentials to access your reading and author dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Role Select */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Account Type
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="glass-input w-full p-3.5 text-sm font-normal rounded-2xl cursor-pointer"
              >
                <option value="" disabled>Select your role</option>
                <option value="user">Reader / User</option>
                <option value="admin">Author / Admin</option>
              </select>
            </div>

            {/* Email */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Email Address
              </label>
              <div className="relative flex items-center">
                <FiMail className="absolute left-3.5 text-[var(--text-muted)] text-base pointer-events-none" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full py-3 pl-10 pr-4 text-sm font-normal rounded-2xl"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Password
              </label>
              <div className="relative flex items-center">
                <FiLock className="absolute left-3.5 text-[var(--text-muted)] text-base pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input w-full py-3 pl-10 pr-10 text-sm font-normal rounded-2xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <GlassButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              loading={loading}
              iconRight={FiArrowRight}
              className="w-full mt-2"
            >
              Sign In
            </GlassButton>
          </form>

          {/* Switch to Register */}
          <div className="pt-4 border-t border-[var(--glass-border-subtle)] text-center text-xs text-[var(--text-secondary)]">
            <span>Don't have an account yet? </span>
            <Link
              to="/register"
              className="font-bold text-[#332FD0] dark:text-[#B4B2FF] hover:text-[#FB2576] hover:underline"
            >
              Create Account
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export default Login;
