import { useState, useEffect } from "react";
import axios from "axios";
import "../../../styles/index.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  const getProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setMessage("No token found. Please login.");

    try {
      const res = await axios.get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setMessage("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error fetching profile");
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (message) return <p className="error-msg">{message}</p>;
  if (!user) return <p className="loading-msg">Loading profile...</p>;

  return (
      <div className="default-panel">
        <div className="avatar">
          {user.fullName.charAt(0).toUpperCase()}
        </div>
        <h2>{user.fullName}</h2>
        <p>@{user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Last Login:</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}</p>
      </div>
  );
}