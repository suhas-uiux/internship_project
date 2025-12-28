import React from "react";
import Navbar from "../components/Navbar";

// Utilities
const getCurrentUsername = () => localStorage.getItem("username") || null;
const getCompletedTopics = () => {
  const username = getCurrentUsername();
  if (!username) return {};
  try {
    return JSON.parse(
      localStorage.getItem(`completedTopics_${username}`) || "{}"
    );
  } catch {
    return {};
  }
};
const getCompletedSideQuests = () => {
  const username = getCurrentUsername();
  if (!username) return {};
  try {
    return JSON.parse(
      localStorage.getItem(`completedSideQuests_${username}`) || "{}"
    );
  } catch {
    return {};
  }
};
const getQuizHistory = () => {
  const username = getCurrentUsername();
  if (!username) return [];
  try {
    return JSON.parse(localStorage.getItem(`quizHistory_${username}`) || "[]");
  } catch {
    return [];
  }
};

const ProfilePage = () => {
  const username = getCurrentUsername();
  if (!username) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h2 className="text-xl font-semibold">Not signed in</h2>
            <p className="text-sm text-gray-600 mt-2">
              Please log in to view your dashboard.
            </p>
          </div>
        </div>
      </>
    );
  }

  const completedTopics = getCompletedTopics();
  const completedSideQuests = getCompletedSideQuests();
  const quizHistory = getQuizHistory();

  const topicEntries = Object.entries(completedTopics);
  const sideQuestEntries = Object.entries(completedSideQuests);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <header className="mb-6">
            <h1 className="text-3xl font-bold">{username}'s Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">
              Minimal summary of implemented progress data.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold text-gray-700">Roadmap Topics</h3>
              <p className="text-2xl font-bold mt-2">{topicEntries.length}</p>
              {topicEntries.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Latest: {topicEntries[0][0]}
                </p>
              )}
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold text-gray-700">Side Quests</h3>
              <p className="text-2xl font-bold mt-2">
                {sideQuestEntries.length}
              </p>
              {sideQuestEntries.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Latest: {sideQuestEntries[0][0]}
                </p>
              )}
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold text-gray-700">Quiz Attempts</h3>
              <p className="text-2xl font-bold mt-2">{quizHistory.length}</p>
              {quizHistory.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Last: {quizHistory[quizHistory.length - 1].topic} —{" "}
                  {quizHistory[quizHistory.length - 1].score}/
                  {quizHistory[quizHistory.length - 1].total}
                </p>
              )}
            </div>
          </div>

          <section className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Recent Quiz History</h2>
            {quizHistory.length === 0 ? (
              <p className="text-sm text-gray-600">
                No quiz attempts recorded yet.
              </p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-600">
                    <th className="py-2">Topic</th>
                    <th className="py-2">Score</th>
                    <th className="py-2">Questions</th>
                  </tr>
                </thead>
                <tbody>
                  {quizHistory
                    .slice()
                    .reverse()
                    .map((h, i) => (
                      <tr key={i} className="border-t">
                        <td className="py-2">{h.topic}</td>
                        <td className="py-2">{h.score}</td>
                        <td className="py-2">{h.total}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
