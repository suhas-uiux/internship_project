import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from 'recharts';

// Utility: Get current logged-in username
const getCurrentUsername = () => localStorage.getItem('username') || null;

// Utility: Fetch completed roadmap topics
const getCompletedTopics = () => {
  const username = getCurrentUsername();
  if (!username) return {};
  const data = JSON.parse(localStorage.getItem(`completedTopics_${username}`) || '{}');
  return typeof data === 'object' && !Array.isArray(data) ? data : {};
};

// Utility: Fetch completed side quest topics
const getCompletedSideQuests = () => {
  const username = getCurrentUsername();
  if (!username) return {};
  const data = JSON.parse(localStorage.getItem(`completedSideQuests_${username}`) || '{}');
  return typeof data === 'object' && !Array.isArray(data) ? data : {};
};

// Chart Colors
const ROADMAP_COLORS = ['#10B981', '#374151']; // green, gray
const SIDEQUEST_COLORS = ['#EC4899', '#374151']; // pink, gray

const ProfilePage = () => {
  const username = getCurrentUsername();
  const completedTopics = getCompletedTopics();
  const completedSideQuests = getCompletedSideQuests();

  if (!username) {
    return (
      <div className="text-center mt-10 text-red-400 text-lg">
        User not logged in. Please login to view your profile.
      </div>
    );
  }

  // Roadmap Progress
  const topicEntries = Object.entries(completedTopics);
  const totalRoadmapTopics = 11;
  const roadmapCompletedCount = topicEntries.length;
  const roadmapCompletionPercent = Math.round((roadmapCompletedCount / totalRoadmapTopics) * 100);
  const roadmapData = [
    { name: 'Completed', value: roadmapCompletedCount },
    { name: 'Remaining', value: totalRoadmapTopics - roadmapCompletedCount },
  ];

  // Side Quest Progress
  const sideQuestEntries = Object.entries(completedSideQuests);
  const totalSideQuestTopics = 10;
  const sideQuestCompletedCount = sideQuestEntries.length;
  const sideQuestCompletionPercent = Math.round((sideQuestCompletedCount / totalSideQuestTopics) * 100);
  const sideQuestData = [
    { name: 'Completed', value: sideQuestCompletedCount },
    { name: 'Remaining', value: totalSideQuestTopics - sideQuestCompletedCount },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-white">
      <h1 className="text-4xl font-bold mb-6">👤 Profile Overview</h1>
      <p className="text-lg mb-10">
        Username: <span className="font-mono text-blue-400">{username}</span>
      </p>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
        {/* Roadmap Chart */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-green-300">📘 Roadmap Progress Chart</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={roadmapData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {roadmapData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={ROADMAP_COLORS[index % ROADMAP_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Side Quest Chart */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-pink-300">🧩 Side Quest Progress Chart</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={sideQuestData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {sideQuestData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={SIDEQUEST_COLORS[index % SIDEQUEST_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      

      {/* Completed Roadmap Topics */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4 text-yellow-300">✅ Completed Topics</h2>
        {topicEntries.length === 0 ? (
          <p className="text-gray-400 italic">You haven't completed any topics yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topicEntries.map(([topic, score], index) => (
              <div
                key={index}
                className="bg-slate-800 rounded-lg p-5 shadow-md hover:shadow-lg transition"
              >
                <p className="text-lg text-slate-300 mb-2">
                  <span className="font-bold">{index + 1}.</span> {topic}
                </p>
                <p className="text-green-400 font-bold">Score: {score} / 10</p>
              </div>
            ))}
          </div>
        )}
      </section>

  

      {/* Completed Side Quests */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-pink-300">✅ Completed Side Quests</h2>
        {sideQuestEntries.length === 0 ? (
          <p className="text-gray-400 italic">No side quests completed yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sideQuestEntries.map(([topic, score], index) => (
              <div
                key={index}
                className="bg-slate-700 rounded-2xl p-5 shadow-md hover:shadow-xl transition duration-300"
              >
                <p className="text-lg text-white font-medium mb-1">
                  <span className="text-purple-400 font-bold">{index + 1}.</span> {topic}
                </p>
                <p className="text-pink-400 font-bold text-sm">Score: {score} / 10</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
