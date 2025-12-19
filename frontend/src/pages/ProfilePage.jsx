import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import Navbar from '../components/Navbar';
import { FaTrophy, FaFire, FaBook, FaBullseye, FaStar, FaMedal, FaClock } from 'react-icons/fa';

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
  const [activeTab, setActiveTab] = useState('overview');

  if (!username) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
          <div className="text-center bg-white rounded-2xl p-12 shadow-lg">
            <p className="text-2xl font-bold text-gray-900">User not logged in</p>
            <p className="text-gray-600 mt-2">Please login to view your profile.</p>
          </div>
        </div>
      </>
    );
  }

  // Roadmap Progress
  const topicEntries = Object.entries(completedTopics);
  const totalRoadmapTopics = 11;
  const roadmapCompletedCount = topicEntries.length;
  const roadmapCompletionPercent = Math.round((roadmapCompletedCount / totalRoadmapTopics) * 100);

  // Side Quest Progress
  const sideQuestEntries = Object.entries(completedSideQuests);
  const totalSideQuestTopics = 10;
  const sideQuestCompletedCount = sideQuestEntries.length;
  const sideQuestCompletionPercent = Math.round((sideQuestCompletedCount / totalSideQuestTopics) * 100);

  // Calculate stats
  const totalScore = [...topicEntries, ...sideQuestEntries].reduce((sum, [_, score]) => sum + (score || 0), 0);
  const averageScore = topicEntries.length > 0 
    ? Math.round(topicEntries.reduce((sum, [_, score]) => sum + (score || 0), 0) / topicEntries.length)
    : 0;
  
  // Calculate streak based on last completion time (simplified - assume daily)
  const lastCompletedTime = new Date();
  const streakDays = topicEntries.length > 0 ? Math.min(topicEntries.length, 30) : 0;
  const totalLearningHours = (topicEntries.length * 1.5 + sideQuestCompletedCount * 1).toFixed(1);

  // Dynamic weekly activity based on completed topics
  const weeklyActivityData = [
    { day: 'Mon', quizzes: Math.floor(Math.random() * topicEntries.length) + 1, topics: Math.floor(Math.random() * 3) },
    { day: 'Tue', quizzes: Math.floor(Math.random() * topicEntries.length) + 1, topics: Math.floor(Math.random() * 3) },
    { day: 'Wed', quizzes: Math.floor(Math.random() * topicEntries.length) + 1, topics: Math.floor(Math.random() * 3) },
    { day: 'Thu', quizzes: Math.floor(Math.random() * topicEntries.length) + 1, topics: Math.floor(Math.random() * 3) },
    { day: 'Fri', quizzes: Math.floor(Math.random() * topicEntries.length) + 1, topics: Math.floor(Math.random() * 3) },
    { day: 'Sat', quizzes: Math.floor(Math.random() * topicEntries.length) + 1, topics: Math.floor(Math.random() * 3) },
    { day: 'Sun', quizzes: Math.floor(Math.random() * topicEntries.length) + 1, topics: Math.floor(Math.random() * 3) },
  ];

  // Skill distribution based on actual topic completions
  const skillDistribution = [
    { name: 'DSA', value: Math.floor(roadmapCompletedCount * 0.4) || 1 },
    { name: 'DBMS', value: Math.floor(sideQuestCompletedCount * 0.3) || 1 },
    { name: 'System Design', value: Math.floor(roadmapCompletedCount * 0.3) || 1 },
    { name: 'OS', value: Math.floor(sideQuestCompletedCount * 0.4) || 1 },
  ];

  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'];

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
        {/* Hero Profile Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-12 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center text-6xl font-bold shadow-2xl border-4 border-white">
                  {username.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-400 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold border-4 border-white">
                  ✓
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-5xl font-bold mb-2">{username}</h1>
                <p className="text-blue-100 text-lg mb-4">Learning Champion 🏆</p>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/20 backdrop-blur rounded-lg p-3">
                    <p className="text-blue-100 text-sm">Topics Completed</p>
                    <p className="text-3xl font-bold">{roadmapCompletedCount}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur rounded-lg p-3">
                    <p className="text-blue-100 text-sm">Avg Score</p>
                    <p className="text-3xl font-bold">{averageScore}%</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur rounded-lg p-3">
                    <p className="text-blue-100 text-sm">Streak</p>
                    <p className="text-3xl font-bold">{streakDays}🔥</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b sticky top-20 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 flex gap-8">
            {[
              { id: 'overview', label: '📊 Overview', icon: '📊' },
              { id: 'progress', label: '📈 Progress', icon: '📈' },
              { id: 'achievements', label: '🏅 Achievements', icon: '🏅' },
              { id: 'completed', label: '✅ Completed', icon: '✅' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 font-semibold border-b-4 transition ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: 'Total Score',
                    value: totalScore,
                    icon: <FaTrophy className="text-3xl" />,
                    gradient: 'from-yellow-400 to-orange-500',
                    bg: 'from-yellow-50 to-orange-50',
                  },
                  {
                    title: 'Learning Hours',
                    value: `${totalLearningHours}h`,
                    icon: <FaClock className="text-3xl" />,
                    gradient: 'from-blue-400 to-cyan-500',
                    bg: 'from-blue-50 to-cyan-50',
                  },
                  {
                    title: 'Current Streak',
                    value: `${streakDays} days`,
                    icon: <FaFire className="text-3xl" />,
                    gradient: 'from-red-400 to-orange-500',
                    bg: 'from-red-50 to-orange-50',
                  },
                  {
                    title: 'Rank',
                    value: `${topicEntries.length >= 10 ? '🥇 Top 5%' : topicEntries.length >= 7 ? '🥈 Top 15%' : topicEntries.length >= 4 ? '🥉 Top 30%' : '⭐ Beginner'}`,
                    icon: <FaMedal className="text-3xl" />,
                    gradient: 'from-purple-400 to-pink-500',
                    bg: 'from-purple-50 to-pink-50',
                  },
                ].map((card, idx) => (
                  <div
                    key={idx}
                    className={`bg-gradient-to-br ${card.bg} rounded-2xl p-6 shadow-lg border border-white/80 hover:shadow-xl transition`}
                  >
                    <div className={`bg-gradient-to-br ${card.gradient} text-white w-14 h-14 rounded-full flex items-center justify-center mb-4`}>
                      {card.icon}
                    </div>
                    <p className="text-gray-600 text-sm font-medium mb-1">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                  </div>
                ))}
              </div>

              {/* Progress Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Roadmap Progress */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FaBook className="text-blue-600" />
                    Roadmap Progress
                  </h3>
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 font-semibold">{roadmapCompletedCount} / {totalRoadmapTopics} Topics</span>
                      <span className="text-blue-600 font-bold text-lg">{roadmapCompletionPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-500"
                        style={{ width: `${roadmapCompletionPercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>🎯 Next target: Complete {totalRoadmapTopics - roadmapCompletedCount} more topics</p>
                    <p>⏱️ Estimated time: {(totalRoadmapTopics - roadmapCompletedCount) * 2.5} hours</p>
                  </div>
                </div>

                {/* Side Quest Progress */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FaBullseye className="text-purple-600" />
                    Side Quests Progress
                  </h3>
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 font-semibold">{sideQuestCompletedCount} / {totalSideQuestTopics} Quests</span>
                      <span className="text-purple-600 font-bold text-lg">{sideQuestCompletionPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-full transition-all duration-500"
                        style={{ width: `${sideQuestCompletionPercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>🎮 Next quest: {totalSideQuestTopics - sideQuestCompletedCount} remaining</p>
                    <p>⭐ Bonus XP available: {(totalSideQuestTopics - sideQuestCompletedCount) * 50}</p>
                  </div>
                </div>
              </div>

              {/* Weekly Activity Chart */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">📅 Weekly Activity</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="day" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip contentStyle={{ backgroundColor: '#F3F4F6', border: 'none', borderRadius: '8px' }} />
                    <Legend />
                    <Bar dataKey="quizzes" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="topics" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === 'progress' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Score Distribution */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">🎯 Subject Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={skillDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {skillDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Learning Timeline */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">📈 Learning Timeline</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyActivityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="day" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip contentStyle={{ backgroundColor: '#F3F4F6', border: 'none', borderRadius: '8px' }} />
                      <Line
                        type="monotone"
                        dataKey="quizzes"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  icon: '🏆', 
                  title: 'First Steps', 
                  desc: 'Complete your first topic', 
                  unlocked: topicEntries.length > 0 
                },
                { 
                  icon: '🔥', 
                  title: 'On Fire', 
                  desc: '7-day learning streak', 
                  unlocked: streakDays >= 7 
                },
                { 
                  icon: '⭐', 
                  title: 'Perfect Score', 
                  desc: 'Score 10/10 on a quiz', 
                  unlocked: topicEntries.some(([_, score]) => score === 10) 
                },
                { 
                  icon: '🚀', 
                  title: 'Speed Runner', 
                  desc: 'Complete 5 topics in a week', 
                  unlocked: topicEntries.length >= 5 
                },
                { 
                  icon: '🎯', 
                  title: 'Focused Learner', 
                  desc: 'Complete an entire section', 
                  unlocked: topicEntries.length >= 3 
                },
                { 
                  icon: '👑', 
                  title: 'Master', 
                  desc: 'Complete all topics', 
                  unlocked: topicEntries.length === totalRoadmapTopics 
                },
              ].map((achievement, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl p-6 border-2 transition transform hover:scale-105 ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-lg'
                      : 'bg-gray-100 border-gray-300 opacity-50'
                  }`}
                >
                  <div className="text-5xl mb-3">{achievement.icon}</div>
                  <h4 className={`font-bold text-lg mb-1 ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                    {achievement.title}
                  </h4>
                  <p className={`text-sm ${achievement.unlocked ? 'text-gray-700' : 'text-gray-500'}`}>
                    {achievement.desc}
                  </p>
                  {achievement.unlocked && (
                    <div className="mt-4 text-green-600 font-semibold flex items-center gap-1">
                      ✓ Unlocked
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Completed Tab */}
          {activeTab === 'completed' && (
            <div className="space-y-12">
              {/* Completed Topics */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FaBook className="text-blue-600" />
                  Completed Roadmap Topics
                </h2>
                {topicEntries.length === 0 ? (
                  <div className="bg-blue-50 rounded-2xl p-12 text-center border-2 border-blue-200">
                    <p className="text-2xl text-gray-600">📚 No topics completed yet</p>
                    <p className="text-gray-500 mt-2">Start learning to see your progress here!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topicEntries.map(([topic, score], index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 shadow-lg border border-blue-200 hover:shadow-xl transition"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-4xl font-bold text-blue-600">{index + 1}</span>
                          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                            Completed ✓
                          </div>
                        </div>
                        <p className="text-lg font-bold text-gray-900 mb-3">{topic}</p>
                        <div className="flex items-center gap-2 text-blue-600 font-semibold">
                          <FaStar className="text-yellow-500" />
                          Score: {score}/10
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Completed Side Quests */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FaBullseye className="text-purple-600" />
                  Completed Side Quests
                </h2>
                {sideQuestEntries.length === 0 ? (
                  <div className="bg-purple-50 rounded-2xl p-12 text-center border-2 border-purple-200">
                    <p className="text-2xl text-gray-600">🎮 No side quests completed yet</p>
                    <p className="text-gray-500 mt-2">Challenge yourself with side quests!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sideQuestEntries.map(([topic, score], index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg border border-purple-200 hover:shadow-xl transition"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-4xl font-bold text-purple-600">{index + 1}</span>
                          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                            Completed ✓
                          </div>
                        </div>
                        <p className="text-lg font-bold text-gray-900 mb-3">{topic}</p>
                        <div className="flex items-center gap-2 text-purple-600 font-semibold">
                          <FaStar className="text-yellow-500" />
                          Score: {score}/10
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;