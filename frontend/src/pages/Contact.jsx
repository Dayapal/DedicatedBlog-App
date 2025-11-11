import React from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const userInfo = {
      access_key: "c660c9ce-c6f9-41f7-aa0f-8a24ea887b94",
      name: data.username,
      email: data.email,
      message: data.message,
    };
    try {
      await axios.post("https://api.web3forms.com/submit", userInfo);
      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error("Failed to send message. Try again later.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Contact Me</h2>
          <p className="text-gray-500 mt-2">Let’s build something amazing together!</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between">
          {/* Left: Form */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Send a Message</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="username"
                  placeholder="Your Name"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("username", { required: true })}
                />
                {errors.username && (
                  <span className="text-sm text-red-500 font-semibold">
                    This field is required
                  </span>
                )}
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <span className="text-sm text-red-500 font-semibold">
                    This field is required
                  </span>
                )}
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("message", { required: true })}
                  rows="5"
                />
                {errors.message && (
                  <span className="text-sm text-red-500 font-semibold">
                    This field is required
                  </span>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Right: Personal Info */}
          <div className="w-full md:w-1/2 md:pl-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Contact Information</h3>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-center space-x-3">
                <FaPhone className="text-green-500" />
                <span>+91 8130774894</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-red-500" />
                <span>dayapal12pc@gmail.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaLinkedin className="text-blue-600" />
                <a
                  href="https://www.linkedin.com/in/dayapal/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  linkedin.com/in/dayapal
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <FaGithub className="text-gray-800" />
                <a
                  href="https://github.com/Dayapal"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  github.com/Dayapal
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <FaGlobe className="text-yellow-500" />
                <a
                  href="https://dayapal-portflio-21.netlify.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  Portfolio
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-green-600" />
                <span>Delhi NCR, India</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
