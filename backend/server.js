import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.js";
import chatbotRoutes from "./src/routes/chatbotRoutes.js";
import { initializeChatbot } from "./src/controllers/chatbotController.js";
// import "./src/app.js"; // this connects to MongoDB

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/chatbot", chatbotRoutes);

const server = http.createServer(app);
const io = initializeChatbot(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
