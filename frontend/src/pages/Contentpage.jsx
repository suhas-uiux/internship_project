import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDatabase, FaProjectDiagram, FaServer, FaCogs } from 'react-icons/fa';

const contentSections = [
  { title: "Data Structures", icon: <FaDatabase size={48} />, path: "/roadmap" },
  { title: "DBMS", icon: <FaServer size={48} />, path: "/Database" },
  { title: "System Design", icon: <FaProjectDiagram size={48} />, path: "/roadmap/system-design" },
  { title: "Operating Systems", icon: <FaCogs size={48} />, path: "/roadmap/os" },
];

const ContentPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white font-['Orbitron'] flex flex-col items-center py-16 px-4">
      <h1 className="text-4xl font-bold mb-12 drop-shadow-[0_0_20px_rgba(0,255,255,0.6)]">Select Content to Explore</h1>

      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex gap-8 px-6 py-4 w-fit">
          {contentSections.map((section) => (
            <div
              key={section.title}
              onClick={() => navigate(section.path)}
              className="min-w-[260px] h-[320px] bg-white/10 hover:bg-cyan-400 hover:text-[#0f0f1a] text-white rounded-2xl p-6 shadow-lg transition-all backdrop-blur-lg border border-white/20 cursor-pointer flex flex-col items-center justify-center text-center"
            >
              <div className="text-cyan-400 mb-4">{section.icon}</div>
              <h2 className="text-xl font-bold mb-2">{section.title}</h2>
              <p className="text-sm mb-6">Explore in-depth knowledge</p>
              <button className="px-5 py-1 border border-cyan-400 rounded-md text-cyan-400 hover:bg-cyan-400 hover:text-[#0f0f1a] transition-all">
                Go
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentPage;
