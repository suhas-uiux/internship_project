import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const topics = [
  { name: 'Arrays&Hashing', path: '/arrays', children: ['Two Pointers', 'Stack'] },
  { name: 'Two Pointers', path: '/two-pointers', children: ['Sliding Window', 'Linked List'] },
  { name: 'Stack', path: '/stack', children: ['Binary Search'] },
  { name: 'Sliding Window', path: '/sliding-window', children: [] },
  { name: 'Linked List', path: '/linked-list', children: ['Trees'] },
  { name: 'Binary Search', path: '/binary-search', children: ['Trees'] },
  { name: 'Trees', path: '/trees', children: ['Tries', 'Heap / Priority Queue', 'Backtracking'] },
  { name: 'Tries', path: '/tries', children: [] },
  { name: 'Heap / Priority Queue', path: '/heap', children: [] },
  { name: 'Backtracking', path: '/backtracking', children: [] }
];

const getCurrentUsername = () => localStorage.getItem('username') || null;

const getCompletedTopics = () => {
  const username = getCurrentUsername();
  if (!username) return {};
  return JSON.parse(localStorage.getItem(`completedTopics_${username}`) || '{}');
};

const getNextTopic = (currentTopic) => {
  const current = topics.find(t => t.name === currentTopic);
  if (!current) return null;
  return current.children.length > 0 ? current.children[0] : null;
};

const Roadmap = () => {
  const containerRef = useRef(null);
  const nodeRefs = useRef({});
  const [lines, setLines] = useState([]);
  const [modal, setModal] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const groupTopicsByLevel = () => {
    const levels = [];
    const visited = new Set();
    const queue = [{ name: 'Arrays&Hashing', level: 0 }];

    while (queue.length) {
      const { name, level } = queue.shift();
      if (visited.has(name)) continue;
      visited.add(name);

      if (!levels[level]) levels[level] = [];
      const topic = topics.find((t) => t.name === name);
      if (topic) {
        levels[level].push(topic);
        topic.children.forEach((childName) => {
          queue.push({ name: childName, level: level + 1 });
        });
      }
    }
    return levels;
  };

  useEffect(() => {
    const updateLines = () => {
      const newLines = [];
      const padding = -5;
      const containerRect = containerRef.current.getBoundingClientRect();

      topics.forEach((topic) => {
        const fromEl = nodeRefs.current[topic.name];
        if (!fromEl) return;
        const fromRect = fromEl.getBoundingClientRect();

        topic.children.forEach((childName) => {
          const toEl = nodeRefs.current[childName];
          if (!toEl) return;
          const toRect = toEl.getBoundingClientRect();

          newLines.push({
            x1: fromRect.left + fromRect.width / 2 - containerRect.left,
            y1: fromRect.top + fromRect.height - containerRect.top - padding,
            x2: toRect.left + toRect.width / 2 - containerRect.left,
            y2: toRect.top - containerRect.top + padding
          });
        });
      });

      setLines(newLines);
    };

    updateLines();
    window.addEventListener('resize', updateLines);
    return () => window.removeEventListener('resize', updateLines);
  }, []);

  const completedTopics = getCompletedTopics();

  const isUnlocked = (topic) => {
    if (topic.name === 'Arrays&Hashing') return true;
    return topics.some(
      (parent) =>
        parent.children.includes(topic.name) &&
        parent.name in completedTopics
    );
  };

  // Handle quiz completion result from location state
  useEffect(() => {
    const result = location.state?.quizResult;
    if (!result) return;

    const username = getCurrentUsername();
    const completedKey = `completedTopics_${username}`;
    const completed = JSON.parse(localStorage.getItem(completedKey) || '{}');
    completed[result.topic] = true;
    localStorage.setItem(completedKey, JSON.stringify(completed));

    const next = getNextTopic(result.topic);
    if (next) {
      setModal({ next });
    } else {
      alert("🎉 You've completed all available topics!");
    }
  }, [location.state]);

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen px-6 py-12 text-slate-100" ref={containerRef}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
            <path d="M0,0 L0,10 L10,5 z" fill="white" />
          </marker>
        </defs>
        {lines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="white"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
        ))}
      </svg>

      <div className="flex flex-col items-center space-y-32 z-10 relative">
        {groupTopicsByLevel().map((levelTopics, i) => (
          <div key={i} className="flex justify-center gap-20">
            {levelTopics.map((topic) => {
              const unlocked = isUnlocked(topic);
              return (
                <div
                  key={topic.name}
                  ref={(el) => (nodeRefs.current[topic.name] = el)}
                  className={`px-6 py-4 rounded-xl text-center font-semibold shadow-lg transition-all duration-300 text-lg tracking-wide min-w-[180px] ${
                    unlocked
                      ? 'bg-indigo-600 hover:scale-105 cursor-pointer text-white'
                      : 'bg-slate-600 text-slate-400 opacity-50 pointer-events-none'
                  }`}
                >
                  {unlocked ? (
                    <Link to={`/topic/${encodeURIComponent(topic.name)}`}>{topic.name}</Link>
                  ) : (
                    topic.name
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-8 text-white w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Next Topic Unlocked!</h2>
            <p className="mb-6">You've successfully completed the quiz. Would you like to continue to <span className="text-purple-400">{modal.next}</span>?</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setModal(null)} className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700">Later</button>
              <button onClick={() => navigate(`/topic/${encodeURIComponent(modal.next)}`)} className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700">Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roadmap;
