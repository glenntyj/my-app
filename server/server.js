import express from "express";
import http from "http";
import cors from "cors";
import config from "./src/config/config.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import authRoutes from "./src/routes/authRoutes.js";
import chatbotRoutes from "./src/modules/chatbot/chatbotRoutes.js";
import { initializeChatbot } from "./src/modules/chatbot/chatbotController.js";

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Error handling
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket for chatbot
const io = initializeChatbot(server);

// Start server
server.listen(config.port, () => {
  console.log(`⚡️ Server running on http://localhost:${config.port}`);
  console.log(`🌍 Environment: ${config.env}`);
});
