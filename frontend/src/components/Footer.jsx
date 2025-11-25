import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { BsYoutube } from "react-icons/bs";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-linear-to-br from-blue-950 via-slate-900 to-blue-950 text-gray-300 pt-10 pb-4 mt-16">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_70%)]"></div>

      {/* Main Links */}
      <motion.div
        className="container mx-auto relative z-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Products */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-white">Products</h2>
          <ul className="space-y-1.5 text-sm">
            {["Flutter", "React", "Android", "iOS"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-all duration-200 hover:translate-x-0.5 block"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Design to Code */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-white">Design to Code</h2>
          <ul className="space-y-1.5 text-sm">
            {["Figma plugin", "Templates"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-all duration-200 hover:translate-x-0.5 block"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Comparison */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-white">Comparison</h2>
          <ul className="space-y-1.5 text-sm">
            {[
              "DhiWise vs Anima",
              "DhiWise vs FlutterFlow",
              "DhiWise vs Bubble",
            ].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-all duration-200 hover:translate-x-0.5 block"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-white">Company</h2>
          <ul className="space-y-1.5 text-sm">
            {["About Us", "Contact Us", "Privacy Policy"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-all duration-200 hover:translate-x-0.5 block"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Divider */}
      <div className="my-6 border-t border-gray-700 opacity-30"></div>

      {/* Bottom Section */}
      <motion.div
        className="container mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center px-6 gap-4"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="text-xl font-bold text-white">
          Dedicated<span className="text-blue-500">Blog</span>
        </div>

        <p className="text-gray-400 text-xs text-center md:text-left">
          © {new Date().getFullYear()} DedicatedBlog Inc. All rights reserved.
        </p>

        <div className="flex space-x-4">
          {[ 
            { icon: <FaGithub size={20} />, color: "hover:text-gray-200" },
            { icon: <BsYoutube size={20} />, color: "hover:text-red-500" },
            { icon: <FaLinkedin size={20} />, color: "hover:text-blue-400" },
          ].map((item, i) => (
            <motion.a
              key={i}
              href="#"
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.2 }}
              className={`${item.color} transition-transform`}
            >
              {item.icon}
            </motion.a>
          ))}
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
