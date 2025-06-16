import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${SERVER_URL}/api/admin/login`, { username, password });

      if (response.data && response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        navigate('/admin/dashboard');
      } else {
        setError('Invalid response format. Token missing.');
        console.error('Token missing in response');
      }
    } catch (err) {
      console.error("Login Error:", err.response || err);
      setError(err.response?.data?.message || 'Login failed due to server error');
    }
  };
const handleHome = () => {
  navigate('/'); 
}
  return (
    <div
      className="relative flex justify-center items-center w-screen h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://picsum.photos/800/350?random=20')", // Example image URL
        backgroundSize: 'cover',
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40 z-0" />
      <div className="relative z-10 bg-white/90 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-full max-w-md border border-green-200">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">EUSDA Admin</h2>
        <p className="text-sm text-center text-gray-500 mb-8">Enter your credentials to access the dashboard</p>
        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition duration-200"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center text-gray-400 text-xs flex flex-col items-center gap-2">
          <span>© 2025 EUSDA. Admin Access Only.</span>
          <button onClick={handleHome} className='text-blue-500'>To Home</button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
