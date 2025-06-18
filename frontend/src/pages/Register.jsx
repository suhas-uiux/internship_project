import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [degree, setDegree] = useState('');
  const [branch, setBranch] = useState('');
  const [semesterCompleted, setSemesterCompleted] = useState(6);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        username: username.trim(),
        fullName: fullName.trim(),
        password,
        degree,
        branch,
        semesterCompleted,
      });
      alert('Registered successfully. Please login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600 mt-1">Join InsideBox as a Student</p>
          </div>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                placeholder="Your full name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Choose a password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Degree</label>
              <input
                type="text"
                placeholder="e.g., BE, B.Tech"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Branch</label>
              <input
                type="text"
                placeholder="e.g., CSE, ECE"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Semester Completed</label>
              <input
                type="number"
                placeholder="1 - 8"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={semesterCompleted}
                onChange={(e) => setSemesterCompleted(Number(e.target.value))}
                required
                min={1}
                max={8}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
            >
              Register
            </button>
            <p className="text-sm text-center text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:underline">Login</a>
            </p>
          </form>
        </div>
      </div>

      {/* Right: Gradient Panel */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-green-400 via-blue-400 to-purple-500">
        <div className="h-full flex items-center justify-center">
          <h2 className="text-4xl text-white font-bold">InsideBox</h2>
        </div>
      </div>
    </div>
  );
};

export default Register;
