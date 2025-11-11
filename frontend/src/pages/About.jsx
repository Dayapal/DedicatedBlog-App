import React from "react";
import { useAuth } from "../context/AuthProvider";

function About() {
  const { profile } = useAuth();
  console.log(profile);

  return (
    <div className="container mx-auto my-12 p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-6">About Me</h1>

      <p className="text-lg leading-relaxed text-gray-700">
        Hi, I’m{" "}
        <strong className="text-blue-800 font-semibold hover:scale-105 transition-transform duration-300">
          {"Daya Pal"}
        </strong>
        , a passionate{" "}
        <strong>Full-Stack Developer</strong> specializing in
        <strong> React.js, Next.js, Node.js, Express.js,</strong> and{" "}
        <strong>Tailwind CSS</strong>. I focus on building responsive, scalable, and
        user-centered web applications that deliver seamless digital experiences.
        With expertise across both frontend and backend development, I enjoy turning
        complex ideas into clean, efficient, and visually appealing solutions that
        perform beautifully and scale effortlessly.
      </p>


      <h2 className="font-semibold text-blue-800 text-xl mt-6">
        Technical Expertise
      </h2>
      <p className="text-gray-700 leading-relaxed">
        <strong>Languages:</strong> JavaScript (ES6+), TypeScript, Python <br />
        <strong>Frontend:</strong> React.js, Next.js, Tailwind CSS, Material UI,
        Bootstrap <br />
        <strong>Backend:</strong> Node.js, Express.js, REST API Architecture{" "}
        <br />
        <strong>Databases:</strong> MongoDB, MySQL <br />
        <strong>Cloud & Tools:</strong> Git, Vite, Google Cloud APIs, Docker
        (basic), CI/CD (GitHub Actions) <br />
        <strong>Other Skills:</strong> Performance Optimization, Component-Driven
        Development
      </p>

      <h2 className="font-semibold text-blue-800 text-xl mt-6">
        Experience
      </h2>
      <p className="text-gray-700 leading-relaxed">
        As a <strong>Frontend Engineer</strong> at <strong>Mark Anthony</strong>{" "}
        (03/2025 – 09/2025, Bengaluru), I developed and deployed multiple React
        applications, optimized performance using code splitting, caching, and
        lazy loading — improving Core Web Vitals and scalability.
        <br /> Earlier, I worked as a <strong>Customer Care Executive</strong> at{" "}
        <strong>Adroit Synergies Pvt. Ltd.</strong> (Airtel Payments), where I
        learned how to solve problems effectively, communicate clearly, and
        deliver satisfaction under pressure.
      </p>

      <h2 className="font-semibold text-blue-800 text-xl mt-6">Projects</h2>
      <ul className="list-disc list-inside text-gray-700 leading-relaxed">
        <li>
          <strong>Sattva Web Presence:</strong> Built a modern React.js website
          with Tailwind CSS and lazy loading, achieving a 95+ Lighthouse score.
        </li>
        <li>
          <strong>Employee Management System:</strong> Designed a complete
          frontend CRUD app with local storage and role-based access control,
          improving usability for HR operations.
        </li>
      </ul>

      <h2 className="font-semibold text-blue-800 text-xl mt-6">
        Education & Certifications
      </h2>
      <p className="text-gray-700 leading-relaxed">
        <strong>Masai School:</strong> Full Stack Web Development (08/2024 –
        03/2025)
        <br />
        <strong>Delhi University:</strong> Bachelor of Arts in English
        (12/2021 – 06/2024)
        <br />
        <strong>FEA (Freedom Employability Academy):</strong> Employability
        Skills Certification (12/2021 – 12/2022)
      </p>

      <h2 className="font-semibold text-blue-800 text-xl mt-6">
        Personal Interests
      </h2>
      <p className="text-gray-700 leading-relaxed">
        Outside of coding, I enjoy exploring UI/UX trends, playing cricket, and
        discovering new technologies that enhance user experience. I’m inspired
        by problem-solving challenges and enjoy collaborating with teams to
        create meaningful digital products.
      </p>

      <p className="text-center text-gray-600 mt-10 italic">
        “Driven by curiosity, powered by code, and focused on impact.”
      </p>
    </div>
  );
}

export default About;
