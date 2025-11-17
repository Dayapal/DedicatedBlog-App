import React, { useState } from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaSpinner,
  FaHeart,
  FaPaperPlane,
  FaUser,
  FaComment,
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formData = watch();

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      const response = await axios.post(
        "https://dedicatedblog-app-1.onrender.com/api/contact",
        {
          name: data.username,
          email: data.email,
          message: data.message,
        }
      );

      if (response.data.success) {
        toast.success("🎉 Your message was sent successfully!");
        reset();
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-2xl my-8">
            <FaComment className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Let's Start a Conversation
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            I'm excited to hear from you! Whether you have a project in mind, want to collaborate, 
            or just want to say hello - I'll get back to you within 24 hours.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Contact Information Card */}
          <motion.div
            className="w-full lg:w-2/5"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                Let's Connect
              </h3>
              
              <motion.ul 
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.li variants={itemVariants} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-blue-50 transition-colors duration-300">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <FaPhone className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <p className="text-gray-600">+91 8130774894</p>
                    <p className="text-sm text-gray-500 mt-1">Mon-Fri, 9AM-6PM</p>
                  </div>
                </motion.li>

                <motion.li variants={itemVariants} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-blue-50 transition-colors duration-300">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <FaEnvelope className="text-red-600 text-lg" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600">dayapal12pc@gmail.com</p>
                    <p className="text-sm text-gray-500 mt-1">I'll respond quickly</p>
                  </div>
                </motion.li>

                <motion.li variants={itemVariants} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-blue-50 transition-colors duration-300">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FaMapMarkerAlt className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Location</p>
                    <p className="text-gray-600">Delhi NCR, India</p>
                    <p className="text-sm text-gray-500 mt-1">Open to remote work</p>
                  </div>
                </motion.li>
              </motion.ul>

              {/* Social Links */}
              <motion.div 
                className="mt-8 pt-8 border-t border-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <h4 className="font-semibold text-gray-900 mb-4">Follow Me</h4>
                <div className="flex space-x-4">
                  {[
                    { icon: FaLinkedin, href: "https://www.linkedin.com/in/dayapal/", color: "bg-blue-600", label: "LinkedIn" },
                    { icon: FaGithub, href: "https://github.com/Dayapal", color: "bg-gray-800", label: "GitHub" },
                    { icon: FaGlobe, href: "https://dayapal-portflio-21.netlify.app/", color: "bg-green-600", label: "Portfolio" },
                  ].map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`w-12 h-12 ${social.color} text-white rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                    >
                      <social.icon className="text-lg" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Trust Indicator */}
              <motion.div 
                className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <div className="flex items-center gap-3 text-sm text-blue-700">
                  <FaHeart className="text-red-400" />
                  <span>Your information is safe with me. I respect your privacy.</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Contact Form Card */}
          <motion.div
            className="w-full lg:w-3/5"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                <h3 className="text-2xl font-bold text-gray-900">Send Me a Message</h3>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Field */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaUser className="text-blue-500 text-sm" />
                    Your Name
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="What should I call you?"
                    className={`w-full px-4 py-3 border rounded-xl transition-all duration-300 focus:ring-4 focus:ring-blue-100 outline-none placeholder-gray-400
                      ${errors.username ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-blue-400'}`}
                    {...register("username", { 
                      required: "Please tell me your name",
                      minLength: {
                        value: 2,
                        message: "Name should be at least 2 characters"
                      }
                    })}
                  />
                  {errors.username && (
                    <motion.span 
                      className="text-sm text-red-500 font-medium flex items-center gap-2 mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.username.message}
                    </motion.span>
                  )}
                </motion.div>

                {/* Email Field */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaEnvelope className="text-blue-500 text-sm" />
                    Email Address
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Where can I reach you?"
                    className={`w-full px-4 py-3 border rounded-xl transition-all duration-300 focus:ring-4 focus:ring-blue-100 outline-none placeholder-gray-400
                      ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-blue-400'}`}
                    {...register("email", { 
                      required: "Email is required to get back to you",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Please enter a valid email address"
                      }
                    })}
                  />
                  {errors.email && (
                    <motion.span 
                      className="text-sm text-red-500 font-medium flex items-center gap-2 mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.email.message}
                    </motion.span>
                  )}
                </motion.div>

                {/* Message Field */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaComment className="text-blue-500 text-sm" />
                    Your Message
                    <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    placeholder="What would you like to discuss? Tell me about your project, idea, or just say hello..."
                    rows="6"
                    className={`w-full px-4 py-3 border rounded-xl transition-all duration-300 focus:ring-4 focus:ring-blue-100 outline-none resize-none placeholder-gray-400
                      ${errors.message ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-blue-400'}`}
                    {...register("message", { 
                      required: "Please share your thoughts",
                      minLength: {
                        value: 10,
                        message: "Message should be at least 10 characters"
                      }
                    })}
                  />
                  {errors.message && (
                    <motion.span 
                      className="text-sm text-red-500 font-medium flex items-center gap-2 mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.message.message}
                    </motion.span>
                  )}
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>Share your ideas clearly</span>
                    <span>{formData.message?.length || 0}/500</span>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  variants={itemVariants}
                  className={`w-full py-4 px-6 font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3
                    ${loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl text-white'
                    }`}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin text-lg" />
                      Sending Your Message...
                    </>
                  ) : isSubmitted ? (
                    <>
                      <FaHeart className="text-red-400" />
                      Message Sent Successfully!
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="text-lg" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>

              {/* Response Time Assurance */}
              <motion.div 
                className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-green-700 text-sm font-medium">
                  💫 I typically respond within 2-4 hours during business days
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Contact;