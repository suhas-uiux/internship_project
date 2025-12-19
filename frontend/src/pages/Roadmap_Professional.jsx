import React, { useRef, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaLock, FaCheckCircle, FaClock } from 'react-icons/fa';

const topicMap = {
  dsa: [
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
  ],
  dbms: [
    { name: 'ER Diagrams', path: '/er-diagram', children: ['Relational Model'] },
    { name: 'Relational Model', path: '/relational-model', children: ['SQL Queries'] },
    { name: 'SQL Queries', path: '/sql-queries', children: ['Normalization'] },
    { name: 'Normalization', path: '/normalization', children: [] },
  ],
  os: [
    { name: 'Processes & Threads', path: '/processes', children: ['Scheduling'] },
    { name: 'Scheduling', path: '/scheduling', children: ['Memory Management'] },
    { name: 'Memory Management', path: '/memory', children: [] }
  ],
  'system-design': [
    { name: 'Scalability Basics', path: '/scalability', children: ['Load Balancing'] },
    { name: 'Load Balancing', path: '/load-balancing', children: ['Caching'] },
    { name: 'Caching', path: '/caching', children: [] }
  ]
};

const courseNames = {
  dsa: 'Data Structures & Algorithms',
  dbms: 'Database Management System',
  os: 'Operating Systems',
  'system-design': 'System Design'
};

const getCurrentUsername = () => localStorage.getItem('username') || null;

const getCompletedTopics = () => {
  const username = getCurrentUsername();
  if (!username) return {};
  return JSON.parse(localStorage.getItem(`completedTopics_${username}`) || '{}');
};

const Roadmap = () => {
  const { section } = useParams();
  const topics = topicMap[section] || [];
  const containerRef = useRef(null);
  const nodeRefs = useRef({});
  const [lines, setLines] = useState([]);

  const groupTopicsByLevel = () => {
    const levels = [];
    const visited = new Set();
    const queue = [{ name: topics[0]?.name, level: 0 }];
    
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
      const containerRect = containerRef.current?.getBoundingClientRect();
      
      if (!containerRect) return;

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
  }, [section, topics]);

  const completedTopics = getCompletedTopics();

  const isUnlocked = (topic) => {
    if (topics[0]?.name === topic.name) return true;
    return topics.some(
      (parent) =>
        parent.children.includes(topic.name) &&
        parent.name in completedTopics
    );
  };

  const isCompleted = (topic) => topic.name in completedTopics;

  return (
    <>
      <Navbar />
      <div className="bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">{courseNames[section]}</h1>
            <p className="text-blue-100 text-lg">Complete all topics to master this course</p>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-gray-50 border-b py-4 px-4">
          <div className="max-w-7xl mx-auto flex justify-center gap-8 flex-wrap text-sm">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              <span className="text-gray-700">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span className="text-gray-700">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <FaLock className="text-gray-400" />
              <span className="text-gray-700">Locked</span>
            </div>
          </div>
        </div>

        {/* Roadmap Content */}
        <div className="relative py-16 px-4" ref={containerRef}>
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                <path d="M0,0 L0,10 L10,5 z" fill="#9CA3AF" />
              </marker>
            </defs>
            {lines.map((line, i) => (
              <line
                key={i}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="#D1D5DB"
                strokeWidth="2"
                markerEnd="url(#arrow)"
              />
            ))}
          </svg>

          <div className="flex flex-col items-center space-y-24 z-10 relative max-w-7xl mx-auto">
            {groupTopicsByLevel().map((levelTopics, i) => (
              <div key={i} className="flex justify-center gap-16 flex-wrap w-full">
                {levelTopics.map((topic) => {
                  const unlocked = isUnlocked(topic);
                  const completed = isCompleted(topic);

                  return (
                    <div
                      key={topic.name}
                      ref={(el) => (nodeRefs.current[topic.name] = el)}
                      className="flex flex-col items-center"
                    >
                      {unlocked ? (
                        <Link
                          to={`/topic/${encodeURIComponent(topic.name)}`}
                          className={`relative w-48 px-6 py-4 rounded-xl text-center font-medium shadow-lg transform transition-all hover:scale-105 ${
                            completed
                              ? 'bg-green-50 border-2 border-green-500 text-green-700'
                              : 'bg-blue-600 text-white border-2 border-blue-600 hover:shadow-xl'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            {completed && <FaCheckCircle />}
                            <span>{topic.name}</span>
                          </div>
                          {completed && (
                            <div className="absolute -top-2 -right-2">
                              <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                ✓
                              </div>
                            </div>
                          )}
                        </Link>
                      ) : (
                        <div className="w-48 px-6 py-4 rounded-xl text-center font-medium shadow-lg bg-gray-100 text-gray-400 border-2 border-gray-300 flex items-center justify-center gap-2">
                          <FaLock />
                          <span>{topic.name}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Progress Footer */}
        <div className="bg-gray-50 border-t py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-4">
              <p className="text-gray-700 mb-2">
                Topics Completed: <span className="font-bold text-blue-600">{Object.keys(completedTopics).length}</span> / {topics.length}
              </p>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all"
                style={{ width: `${(Object.keys(completedTopics).length / topics.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Roadmap;
