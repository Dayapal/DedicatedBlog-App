import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Blogs from "./pages/Blogs";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Creators from "./pages/Creators";
import Detail from "./pages/Detail";
import NotFound from "./pages/NotFound";
import CreateBlog from "./dashboard/CreateBlog";
import UpdateBlog from "./dashboard/UpdateBlog";

import AmbientBackground from "./components/ui/AmbientBackground";
import MobileBottomNav from "./components/MobileBottomNav";
import { useAuth } from "./context/AuthProvider";

function App() {
  const location = useLocation();
  const hideNavbarFooter = ["/dashboard", "/login", "/register"].includes(
    location.pathname
  );
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem("jwt");

  return (
    <div className="relative min-h-screen text-gray-900 dark:text-gray-100 selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-400">
      {/* Global Ambient Depth Lighting */}
      <AmbientBackground />

      {/* Floating Glass Navigation */}
      {!hideNavbarFooter && <Navbar />}

      {/* Main Content Router */}
      <main className="relative z-10 min-h-screen pb-16 md:pb-0">
        <Routes>
          <Route
            exact
            path="/"
            element={token || isAuthenticated ? <Home /> : <Navigate to="/login" replace />}
          />
          <Route exact path="/blogs" element={<Blogs />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/creators" element={<Creators />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/create-blog" element={<CreateBlog />} />
          <Route exact path="/blogs/:id" element={<Detail />} />
          <Route exact path="/blog/update/:id" element={<UpdateBlog />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Android 16 Expressive Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Modern Glass Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "rgba(255, 255, 255, 0.8)",
            color: "#1e1e2f",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.7)",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            borderRadius: "1rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            padding: "12px 18px",
          },
          success: {
            iconTheme: {
              primary: "#747FDD",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#f43f5e",
              secondary: "#ffffff",
            },
          },
        }}
      />

      {/* Liquid Glass Footer */}
      {!hideNavbarFooter && <Footer />}
    </div>
  );
}

export default App;
