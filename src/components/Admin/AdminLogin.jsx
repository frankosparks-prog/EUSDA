import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${SERVER_URL}/api/admin/login`, {
        username,
        password,
      });

      if (response.data && response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
        navigate("/admin/dashboard");
      } else {
        setError("Invalid response format. Token missing.");
        console.error("Token missing in response");
      }
    } catch (err) {
      console.error("Login Error:", err.response || err);
      setError(
        err.response?.data?.message || "Login failed due to server error",
      );
    }
  };

  const handleHome = () => navigate("/");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white px-4">
      <div
        className="absolute inset-0 bg-[url('https://picsum.photos/1200/800?random=20')] bg-cover bg-center opacity-30"
        aria-hidden="true"
      />

      <main className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-green-100 p-8">
        <header className="text-center mb-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4 ring-1 ring-green-200">
            <span className="text-2xl font-extrabold text-green-700">
              <img
                src={process.env.PUBLIC_URL + "/eusda-logo.png"}
                alt="EUSDA"
                onError={(e) => {
                  e.currentTarget.src = "https://eusda.co.ke/eusda-logo.png";
                }}
                className="object-cover rounded-full"
              />
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">EUSDA Admin</h1>
          <p className="text-sm text-gray-500">
            Sign in to manage the dashboard
          </p>
        </header>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full inline-flex justify-center items-center gap-2 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition"
          >
            Login
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
          <span>© 2025 EUSDA</span>
          <button
            onClick={handleHome}
            className="text-green-700 hover:underline"
          >
            Back to Home
          </button>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
