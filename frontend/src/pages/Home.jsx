import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBook, FaArrowRight } from "react-icons/fa";
import Navbar from "../components/Navbar";

const courses = [
  {
    id: 1,
    title: "Data Structures & Algorithms",
    description: "Master DSA with comprehensive learning paths from basics to advanced concepts.",
    icon: <FaBook className="text-4xl" />,
    color: "from-blue-500 to-blue-600",
    topics: 15,
    link: "/roadmap/dsa"
  },
  {
    id: 2,
    title: "Database Management System",
    description: "Learn DBMS concepts, SQL, and database design from fundamentals.",
    icon: <FaBook className="text-4xl" />,
    color: "from-green-500 to-green-600",
    topics: 8,
    link: "/roadmap/dbms"
  },
  {
    id: 3,
    title: "Operating Systems",
    description: "Understand OS fundamentals, processes, threads, and memory management.",
    icon: <FaBook className="text-4xl" />,
    color: "from-purple-500 to-purple-600",
    topics: 10,
    link: "/roadmap/os"
  },
  {
    id: 4,
    title: "System Design",
    description: "Learn scalability, architecture, and design patterns for large systems.",
    icon: <FaBook className="text-4xl" />,
    color: "from-orange-500 to-orange-600",
    topics: 7,
    link: "/roadmap/system-design"
  }
];

const stats = [
  { label: "Courses", value: "4+" },
  { label: "Topics", value: "40+" },
  { label: "Quizzes", value: "100+" }
];

const Home = () => {
  const [isLoggedIn] = useState(!!localStorage.getItem("token"));

  return (
    <>
      <Navbar />
      <div className="bg-white">
        {/* Hero Section */}
        {!isLoggedIn ? (
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-4">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">Master Your Technical Skills</h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Comprehensive learning paths for DSA, DBMS, OS, and System Design
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition flex items-center gap-2"
                >
                  Get Started <FaArrowRight />
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome Back!</h1>
              <p className="text-lg md:text-xl text-blue-100">
                Continue your learning journey with our comprehensive courses
              </p>
            </div>
          </section>
        )}

        {/* Stats Section */}
        <section className="bg-gray-50 py-12 px-4 border-b">
          <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx}>
                <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Courses Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Our Courses</h2>
              <p className="text-xl text-gray-600">Choose a course and start learning today</p>
            </div>

            {isLoggedIn ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {courses.map((course) => (
                  <Link
                    key={course.id}
                    to={course.link}
                    className="group"
                  >
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:scale-105 h-full">
                      <div className={`bg-gradient-to-br ${course.color} p-8 text-white flex items-center justify-center h-40`}>
                        {course.icon}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-600">{course.topics} Topics</span>
                          <FaArrowRight className="text-blue-600 group-hover:translate-x-2 transition" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-blue-50 rounded-lg">
                <p className="text-gray-700 mb-4">Sign in to access all courses</p>
                <Link to="/login" className="text-blue-600 font-bold hover:underline">
                  Login Now →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        {!isLoggedIn && (
          <section className="bg-blue-50 py-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to start learning?</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Join thousands of students mastering DSA and other technical concepts
              </p>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition inline-block"
              >
                Sign Up Free
              </Link>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default Home;