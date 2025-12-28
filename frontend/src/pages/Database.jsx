import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Databasetopics = [
  { name: 'Intro-to-dbms', path: '/intro-to-dbms', children: ['Data Models','SQL'] },
  { name: 'Data Models', path: '/data-models', children: ['ER Model','Relational Model'] },
  { name: 'ER Model', path: '/er-model', children: [] },
  { name: 'Relational Model', path: '/relational-model', children: [] },
  { name: 'SQL', path: '/sql', children: ['Joins & Subqueries'] },
  { name: 'Joins & Subqueries', path: '/joins-subqueries', children: [] },
  { name: 'Normalization', path: '/normalization', children: [] },
  { name: 'Transaction Management', path: '/transactions', children: ['ACID & Concurrency'] },
  { name: 'ACID & Concurrency', path: '/acid-concurrency', children: [] },
  { name: 'Indexing & File Organization', path: '/indexing', children: [] }
];

const getCurrentUsername = () => localStorage.getItem('username') || null;

const getCompletedDatabasetopics = () => {
  const username = getCurrentUsername();
  if (!username) return {};
  return JSON.parse(localStorage.getItem(`completedDatabasetopics_${username}`) || '{}');
};

const getNextTopic = (currentTopic) => {
  const current = Databasetopics.find(t => t.name === currentTopic);
  if (!current) return null;
  return current.children.length > 0 ? current.children[0] : null;
};

const Database = () => {
  const containerRef = useRef(null);
  const nodeRefs = useRef({});
  const [lines, setLines] = useState([]);
  const [modal, setModal] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const groupDatabasetopicsByLevel = () => {
    const levels = [];
    const visited = new Set();
    const queue = [{ name: 'Intro-to-dbms', level: 0 }];

    while (queue.length) {
      const { name, level } = queue.shift();
      if (visited.has(name)) continue;
      visited.add(name);

      if (!levels[level]) levels[level] = [];
      const topic = Databasetopics.find((t) => t.name === name);
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

      Databasetopics.forEach((topic) => {
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

  const completedDatabasetopics = getCompletedDatabasetopics();

  const isUnlocked = (topic) => {
    if (topic.name === 'Intro-to-dbms') return true;
    return Databasetopics.some(
      (parent) =>
        parent.children.includes(topic.name) &&
        parent.name in completedDatabasetopics
    );
  };

  useEffect(() => {
    const result = location.state?.quizResult;
    if (!result) return;

    const username = getCurrentUsername();
    const completedKey = `completedDatabasetopics_${username}`;
    const completed = JSON.parse(localStorage.getItem(completedKey) || '{}');
    completed[result.topic] = true;
    localStorage.setItem(completedKey, JSON.stringify(completed));

    const next = getNextTopic(result.topic);
    if (next) {
      setModal({ next });
    } else {
      alert("You've completed all available Databasetopics!");
    }
  }, [location.state]);

  return (
    <div
      className="relative bg-gradient-to-b from-[#0f2027] via-[#203a43] to-[#2c5364] min-h-screen px-6 py-12 text-white overflow-x-auto"
      ref={containerRef}
    >
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

      <div className="flex flex-col items-center space-y-40 z-10 relative">
        {groupDatabasetopicsByLevel().map((levelDatabasetopics, i) => (
          <div key={i} className="flex justify-center gap-20">
            {levelDatabasetopics.map((topic) => {
              const unlocked = isUnlocked(topic);
              return (
                <div
                  key={topic.name}
                  ref={(el) => (nodeRefs.current[topic.name] = el)}
                  className={`transition-all duration-300 px-6 py-3 rounded-xl shadow-md min-w-[200px] text-center font-semibold tracking-wide ${
                    unlocked
                      ? 'bg-[#3a3af0] text-white hover:scale-105 cursor-pointer'
                      : 'bg-[#2d3748] text-gray-400 opacity-50 pointer-events-none'
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

export default Database;