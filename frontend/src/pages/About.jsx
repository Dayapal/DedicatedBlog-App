import React from "react";
import { useAuth } from "../context/AuthProvider";
import { motion } from "framer-motion";
import { 
  FaCode, 
  FaServer, 
  FaPalette, 
  FaDatabase, 
  FaCloud, 
  FaRocket,
  FaGraduationCap,
  FaAward,
  FaHeart,
  FaUsers,
  FaLightbulb,
  FaFutbol,
  FaBook,
  FaLaptopCode
} from "react-icons/fa";

function About() {
  const { profile } = useAuth();

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
        duration: 0.6
      }
    }
  };

  const skillCards = [
    { icon: FaCode, title: "Frontend", skills: "React.js, Next.js, TypeScript", color: "from-blue-500 to-cyan-500" },
    { icon: FaServer, title: "Backend", skills: "Node.js, Express.js, REST APIs", color: "from-green-500 to-emerald-500" },
    { icon: FaPalette, title: "Styling", skills: "Tailwind CSS, Material UI, Bootstrap", color: "from-purple-500 to-pink-500" },
    { icon: FaDatabase, title: "Databases", skills: "MongoDB, MySQL, PostgreSQL", color: "from-orange-500 to-red-500" },
    { icon: FaCloud, title: "Cloud & DevOps", skills: "Docker, CI/CD, Google Cloud", color: "from-indigo-500 to-blue-500" },
    { icon: FaRocket, title: "Performance", skills: "Optimization, Caching, Web Vitals", color: "from-teal-500 to-green-500" }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center justify-center w-22 h-22 bg-linear-to-br from-blue-500 to-purple-600 rounded-3xl my-8 shadow-lg">
            <FaCode className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Hello, I'm <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Daya Pal</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A passionate <strong className="text-blue-600">Full-Stack Developer</strong> who crafts 
            digital experiences that are not just functional, but emotionally resonant and 
            intuitively human-centered.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Story & Experience */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Story Card */}
            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">My Journey</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  My path into technology wasn't conventional—it was forged through 
                  <strong className="text-blue-600"> curiosity</strong> and a deep desire to 
                  create meaningful solutions. From solving customer problems at Airtel Payments 
                  to architecting scalable web applications, I've learned that great technology 
                  serves people first.
                </p>
                <p>
                  I specialize in turning complex challenges into 
                  <strong className="text-green-600"> elegant, user-centered solutions</strong> 
                  using modern technologies like React.js, Next.js, and Node.js. Every line of 
                  code I write is guided by one principle: how can this make someone's life better?
                </p>
                <p>
                  When I'm not coding, you'll find me exploring the latest UI/UX trends, 
                  contributing to open source, or mentoring aspiring developers—because 
                  <strong className="text-purple-600"> growth is best when shared</strong>.
                </p>
              </div>
            </motion.div>

            {/* Experience Timeline */}
            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">Professional Journey</h2>
              </div>
              
              <div className="space-y-6">
                {/* Current Role */}
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <FaRocket className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Frontend Engineer</h3>
                    <p className="text-blue-600 font-medium">Mark Anthony · Bengaluru</p>
                    <p className="text-gray-500 text-sm">March 2025 – September 2025</p>
                    <p className="text-gray-700 mt-2">
                      Developing and deploying React applications with performance optimization, 
                      code splitting, and caching strategies that significantly improved Core Web Vitals.
                    </p>
                  </div>
                </div>

                {/* Previous Role */}
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FaUsers className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Customer Care Executive</h3>
                    <p className="text-blue-600 font-medium">Adroit Synergies Pvt. Ltd. (Airtel Payments)</p>
                    <p className="text-gray-700 mt-2">
                      Learned invaluable skills in problem-solving, clear communication, and 
                      delivering satisfaction under pressure—foundations that make me a better developer today.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Projects Showcase */}
            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">Featured Projects</h2>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">Sattva Web Presence</h3>
                  <p className="text-gray-700 mb-3">
                    Built a modern React.js website with Tailwind CSS and lazy loading, 
                    achieving exceptional 95+ Lighthouse scores and optimal user experience.
                  </p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">React</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Tailwind</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Performance</span>
                  </div>
                </div>

                <div className="p-6 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">Employee Management System</h3>
                  <p className="text-gray-700 mb-3">
                    Designed a comprehensive CRUD application with local storage and 
                    role-based access control, significantly improving HR operational efficiency.
                  </p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">JavaScript</span>
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">CRUD</span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">Local Storage</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Skills & Personal */}
          <div className="space-y-8">
            {/* Skills Grid */}
            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-900">Technical Stack</h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {skillCards.map((skill, index) => (
                  <motion.div
                    key={skill.title}
                    className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-linear-to-r ${skill.color} rounded-lg flex items-center justify-center`}>
                        <skill.icon className="text-white text-sm" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{skill.title}</h3>
                        <p className="text-sm text-gray-600">{skill.skills}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Education */}
            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-900">Education & Growth</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <FaGraduationCap className="text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Masai School</p>
                    <p className="text-sm text-gray-600">Full Stack Web Development</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <FaGraduationCap className="text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Delhi University</p>
                    <p className="text-sm text-gray-600">Bachelor of Arts in English</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <FaAward className="text-purple-600" />
                  <div>
                    <p className="font-semibold text-gray-900">FEA Academy</p>
                    <p className="text-sm text-gray-600">Employability Skills Certification</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Personal Interests */}
            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-pink-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-900">Beyond Code</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaPalette className="text-blue-600" />
                  </div>
                  <span className="text-gray-700">UI/UX Design Trends</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaFutbol className="text-green-600" />
                  </div>
                  <span className="text-gray-700">Cricket & Sports</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FaLightbulb className="text-purple-600" />
                  </div>
                  <span className="text-gray-700">Emerging Technologies</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <FaHeart className="text-red-600" />
                  </div>
                  <span className="text-gray-700">Mentoring & Collaboration</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Inspirational Quote */}
        <motion.div 
          className="text-center mt-16 p-8 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <FaHeart className="w-8 h-8 text-red-200 mx-auto mb-4" />
          <p className="text-2xl font-light italic mb-4">
            "Driven by curiosity, powered by code, and focused on human impact."
          </p>
          <p className="text-blue-100">
            Every project is an opportunity to make technology more human, more accessible, and more meaningful.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default About;