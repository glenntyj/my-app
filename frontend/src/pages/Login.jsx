import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../index.css";

export default function Login({ setAuth }) {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = e => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", loginData);
      localStorage.setItem("token", res.data.token);
      setAuth(true);
      navigate("/profile");
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="default-panel">
      <h2>Login</h2>
      <div className="form-group">
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={loginData.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={loginData.password}
          onChange={handleChange}
        />
      </div>
      <button onClick={handleLogin}>Login</button>
      {message && <p className="message">{message}</p>}
      <p>Don't have an account? <a href="/register">Register</a></p>
    </div>
  );
}
