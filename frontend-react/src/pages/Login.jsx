import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../api/apiClient"; // REQUIRED

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError("");

  //   try {
  //     await login(email, password);
  //     navigate("/dashboard");
  //   } catch (err) {
  //     setError("Invalid email or password");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await apiClient.post("/auth/login", {
      Email,
      Password,
    });

    // ⭐ THIS IS THE KEY FIX
    login(res.data.user);

    localStorage.setItem("user1", JSON.stringify(res.data.user));
    
    localStorage.setItem("token", res.data.token);

    navigate("/dashboard");
  } catch (err) {
    setError("Invalid email or password");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        
        <h1 className="text-3xl font-bold text-center mb-2">
          Welcome back
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Login to your Job Tracker
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              className="w-full border p-3 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="you@example.com"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              className="w-full border p-3 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="••••••••"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;