import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault(); // prevent form reload
    try {
      const res = await axios.post("http://localhost:3000/admin/signin", {
        email,
        password,
      });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        console.log("Token:", res.data.token);
        navigate("/dashboard",{replace:true});
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-80 text-center">
        <h1 className="text-3xl font-extrabold text-blue-600 mb-2">Jan Seva</h1>
        <p className="text-gray-500 mb-6 text-sm">
          A platform for citizens to report and resolve civic issues in their community.
        </p>
        <h2 className="text-xl font-semibold text-blue-600 mb-4">Sign In</h2>

        <form onSubmit={handleSignIn} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
