import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDatabase, FaProjectDiagram, FaServer, FaCogs, FaArrowRight } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const contentSections = [
  {
    key: "dsa",
    title: "Data Structures & Algorithms",
    description: "Master the fundamentals of DSA including arrays, linked lists, trees, and more.",
    icon: <FaDatabase size={48} />,
    gradient: "from-blue-600 to-blue-700",
    bgGradient: "from-blue-50 to-blue-100",
    topics: 8
  },
  {
    key: "dbms",
    title: "Database Management Systems",
    description: "Learn relational databases, SQL, normalization, and database design patterns.",
    icon: <FaServer size={48} />,
    gradient: "from-purple-600 to-purple-700",
    bgGradient: "from-purple-50 to-purple-100",
    topics: 6
  },
  {
    key: "system-design",
    title: "System Design",
    description: "Understand scalability, distributed systems, and architectural patterns.",
    icon: <FaProjectDiagram size={48} />,
    gradient: "from-pink-600 to-pink-700",
    bgGradient: "from-pink-50 to-pink-100",
    topics: 5
  },
  {
    key: "os",
    title: "Operating Systems",
    description: "Explore processes, threads, memory management, and concurrency concepts.",
    icon: <FaCogs size={48} />,
    gradient: "from-green-600 to-green-700",
    bgGradient: "from-green-50 to-green-100",
    topics: 7
  },
];

const ContentPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="bg-white min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl font-bold mb-4">Learning Paths</h1>
            <p className="text-xl text-blue-100 max-w-2xl">
              Choose your learning path and master essential concepts for your tech interview or career growth.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Grid of Content Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {contentSections.map((section) => (
              <div
                key={section.key}
                onClick={() => navigate(`/roadmap/${section.key}`)}
                className="group cursor-pointer"
              >
                <div className={`bg-gradient-to-br ${section.bgGradient} rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}>
                  {/* Icon Header */}
                  <div className={`bg-gradient-to-r ${section.gradient} p-8 flex items-center justify-center`}>
                    <div className="text-white opacity-90 group-hover:opacity-100 transition-opacity">
                      {section.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{section.title}</h3>
                    <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                      {section.description}
                    </p>

                    {/* Topics Count */}
                    <div className="mb-6 flex items-center gap-2">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        {section.topics} Topics
                      </span>
                    </div>

                    {/* CTA Button */}
                    <button className={`w-full py-3 px-6 bg-gradient-to-r ${section.gradient} text-white rounded-lg font-semibold group-hover:shadow-lg transition-all flex items-center justify-between`}>
                      Start Learning
                      <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Features Section */}
          <div className="bg-gray-50 rounded-2xl p-12 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Our Learning Paths?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Structured Learning",
                  description: "Topics are arranged in a logical sequence, building from basics to advanced concepts."
                },
                {
                  title: "Interactive Quizzes",
                  description: "AI-powered quizzes generated from content to test your understanding instantly."
                },
                {
                  title: "Progress Tracking",
                  description: "Track your progress through each learning path and unlock new topics as you advance."
                },
              ].map((feature, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white font-bold">{idx + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Choose any learning path above to begin your journey. Complete quizzes, track progress, and master the skills you need.
            </p>
            <p className="text-blue-200 text-sm">Estimated time to complete each path: 20-30 hours</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentPage;