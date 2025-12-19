import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', username);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side: Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Login to InsideBox</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
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
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Login
            </button>
            <p className="text-sm text-center text-gray-600">
              Don't have an account?{' '}
              <a href="/Register" className="text-blue-600 hover:underline">Sign Up</a>
            </p>
          </form>
        </div>
      </div>

      {/* Right side: Gradient background */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
        {/* Optional: Add logo or message */}
        <div className="h-full flex items-center justify-center">
          <h2 className="text-4xl text-white font-bold">InsideBox</h2>
        </div>
      </div>
    </div>
  );
};

export default Login;