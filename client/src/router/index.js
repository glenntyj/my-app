import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../modules/auth/components/Login";
import Register from "../modules/auth/components/Register";
import Profile from "../modules/auth/components/Profile";
import Chatbot from "../modules/chatbot/components/Chatbot";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<Chatbot />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
