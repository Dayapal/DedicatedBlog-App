import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaPaperPlane,
  FaUser,
  FaComment,
  FaCheckCircle,
} from "react-icons/fa";
import { GlassCard } from "../components/ui/GlassCard";
import { GlassButton } from "../components/ui/GlassButton";

function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/contact", {
        name: data.username,
        email: data.email,
        message: data.message,
      });

      if (response.data.success) {
        toast.success("Message delivered successfully! 🎉");
        reset();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full glass-panel border border-[var(--glass-border)] text-xs font-semibold text-[#747FDD] uppercase tracking-wider">
          <FaComment />
          <span>Direct Channel</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Let's Start a Conversation
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)]">
          Have a question, feedback, or collaboration idea? Send a message and I'll respond promptly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left: Contact Info (2 cols) */}
        <GlassCard radius="panel" className="lg:col-span-2 !p-6 sm:!p-8 space-y-8 h-full">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              Contact Information
            </h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Open to full-stack engineering roles, technical writing, and architectural discussions.
            </p>
          </div>

          <div className="space-y-5 text-sm">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <FaPhone />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-[var(--text-primary)]">Phone</h4>
                <p className="text-xs text-[var(--text-secondary)]">+91 8130774894</p>
                <p className="text-[10px] text-[var(--text-muted)]">Mon - Fri, 9:00 AM - 6:00 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <FaEnvelope />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-[var(--text-primary)]">Email</h4>
                <p className="text-xs text-[var(--text-secondary)]">dayapal12pc@gmail.com</p>
                <p className="text-[10px] text-[var(--text-muted)]">Typical reply within 24 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#747FDD]/15 text-[#747FDD] flex items-center justify-center shrink-0">
                <FaMapMarkerAlt />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-[var(--text-primary)]">Location</h4>
                <p className="text-xs text-[var(--text-secondary)]">Delhi NCR, India</p>
                <p className="text-[10px] text-[var(--text-muted)]">Open to remote & hybrid worldwide</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[var(--glass-border-subtle)] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Online Profiles
            </h4>
            <div className="flex gap-2.5">
              {[
                { icon: FaLinkedin, href: "https://www.linkedin.com/in/dayapal/", label: "LinkedIn" },
                { icon: FaGithub, href: "https://github.com/Dayapal", label: "GitHub" },
                { icon: FaGlobe, href: "https://dayapal-portflio-21.netlify.app/", label: "Portfolio" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl glass-panel text-[var(--text-secondary)] hover:text-[#747FDD] hover:scale-105 transition-all"
                >
                  <item.icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Right: Form (3 cols) */}
        <GlassCard radius="panel" className="lg:col-span-3 !p-6 sm:!p-10 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              Send a Direct Note
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Fill in your details below and hit send.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                <FaUser className="text-[var(--color-primary)] text-xs" /> Your Name
              </label>
              <input
                type="text"
                placeholder="What should I call you?"
                className={`glass-input w-full p-3.5 text-sm font-normal rounded-2xl ${
                  errors.username ? "!border-red-400" : ""
                }`}
                {...register("username", {
                  required: "Please enter your name",
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                })}
              />
              {errors.username && (
                <p className="text-xs text-red-500 font-medium">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                <FaEnvelope className="text-[var(--color-primary)] text-xs" /> Email Address
              </label>
              <input
                type="email"
                placeholder="you@domain.com"
                className={`glass-input w-full p-3.5 text-sm font-normal rounded-2xl ${
                  errors.email ? "!border-red-400" : ""
                }`}
                {...register("email", {
                  required: "Email is required to reply",
                  pattern: { value: /^\S+@\S+$/i, message: "Please enter a valid email address" },
                })}
              />
              {errors.email && (
                <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                <FaComment className="text-[var(--color-primary)] text-xs" /> Your Message
              </label>
              <textarea
                rows={5}
                placeholder="Share your thoughts, project idea, or inquiry..."
                className={`glass-input w-full p-3.5 text-sm font-normal rounded-2xl resize-none ${
                  errors.message ? "!border-red-400" : ""
                }`}
                {...register("message", {
                  required: "Message content cannot be blank",
                  minLength: { value: 10, message: "Message should be at least 10 characters" },
                })}
              />
              {errors.message && (
                <p className="text-xs text-red-500 font-medium">{errors.message.message}</p>
              )}
            </div>

            {/* Submit */}
            <GlassButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              loading={loading}
              icon={submitted ? FaCheckCircle : FaPaperPlane}
              className="w-full"
            >
              {submitted ? "Message Sent!" : "Send Message"}
            </GlassButton>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}

export default Contact;
