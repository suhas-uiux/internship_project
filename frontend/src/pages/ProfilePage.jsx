import React from 'react';

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
  const totalRoadmapTopics = 11; // Adjust this count as per your platform
  const roadmapCompletedCount = topicEntries.length;
  const roadmapCompletionPercent = Math.round((roadmapCompletedCount / totalRoadmapTopics) * 100);

  // Side Quests Progress
  const sideQuestEntries = Object.entries(completedSideQuests);
  const totalSideQuestTopics = 10; // Estimate or calculate dynamically if needed
  const sideQuestCompletedCount = sideQuestEntries.length;
  const sideQuestCompletionPercent = Math.round((sideQuestCompletedCount / totalSideQuestTopics) * 100);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-white">
      <h1 className="text-4xl font-bold mb-6">👤 Profile Overview</h1>
      <p className="text-lg mb-10">
        Username: <span className="font-mono text-blue-400">{username}</span>
      </p>

      {/* Roadmap Progress Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-2 text-green-300">📘 Roadmap Progress</h2>
        <div className="w-full bg-gray-700 rounded-full h-6 overflow-hidden shadow-inner">
          <div
            className="bg-green-500 h-full text-xs font-bold text-white text-center flex items-center justify-center transition-all duration-500"
            style={{ width: `${roadmapCompletionPercent}%` }}
          >
            {roadmapCompletionPercent}%
          </div>
        </div>
        <p className="text-sm text-gray-300 mt-2">
          {roadmapCompletedCount} out of {totalRoadmapTopics} topics completed
        </p>
      </section>

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

      {/* Side Quest Progress */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-2 text-purple-300">🧩 Side Quest Progress</h2>
        <div className="w-full bg-gray-700 rounded-full h-6 overflow-hidden shadow-inner">
          <div
            className="bg-purple-500 h-full text-xs font-bold text-white text-center flex items-center justify-center transition-all duration-500"
            style={{ width: `${sideQuestCompletionPercent}%` }}
          >
            {sideQuestCompletionPercent}%
          </div>
        </div>
        <p className="text-sm text-gray-300 mt-2">
          {sideQuestCompletedCount} out of {totalSideQuestTopics} side quests completed
        </p>
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
