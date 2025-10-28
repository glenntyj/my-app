import fs from "fs";
import path from "path";
import { Server } from "socket.io";

const chatLogFile = path.join(process.cwd(), "chat_logs.json");
const intents = JSON.parse(fs.readFileSync(path.join(process.cwd(), "intents.json"), "utf-8"));
const sessions = {};
const INACTIVITY_TIMEOUT = 60_000;
const inactivityTimers = {};

export function initializeChatbot(server) {
  const io = new Server(server, { cors: { origin: "*", methods: ["GET","POST"] } });

  function botReply(messageText, sessionData) {
    const text = messageText.toLowerCase();
    const { context } = sessionData;

    if (sessionData.humanRequested) return null;

    // Example multi-turn logic
    if (context.expectingOrderId) {
      const orderId = text.match(/\d{3,}/);
      if (orderId) {
        context.expectingOrderId = false;
        return `Thanks! Your order ${orderId[0]} is being processed.`;
      } else return "I didn't catch your order number. Can you provide it again?";
    }

    for (const intent of intents.intents) {
      if (intent.patterns.some(p => text.includes(p.toLowerCase()))) {
        if (intent.tag === "order") context.expectingOrderId = true;
        if (intent.tag === "human") sessionData.humanRequested = true;
        return intent.responses[Math.floor(Math.random() * intent.responses.length)];
      }
    }

    return "Sorry, I didn't understand that. Can you rephrase?";
  }

  function resetInactivityTimer(sessionId) {
    if (inactivityTimers[sessionId]) clearTimeout(inactivityTimers[sessionId]);
    inactivityTimers[sessionId] = setTimeout(() => {
      if (!sessions[sessionId] || sessions[sessionId].humanRequested) return;
      const botMsg = {
        from: "bot",
        text: "Are you still there?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sessionId,
      };
      sessions[sessionId].messages.push(botMsg);
      io.to(sessionId).emit("chatMessage", botMsg);
    }, INACTIVITY_TIMEOUT);
  }

  function logMessage(msg) {
    let logs = [];
    if (fs.existsSync(chatLogFile)) {
      try { logs = JSON.parse(fs.readFileSync(chatLogFile, "utf-8")); } catch {}
    }
    logs.push(msg);
    fs.writeFileSync(chatLogFile, JSON.stringify(logs, null, 2));
  }

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("joinSession", (sessionId, role) => {
      socket.join(sessionId);
      console.log(`${role} joined session ${sessionId}`);
      if (!sessions[sessionId]) sessions[sessionId] = { messages: [], context: {}, humanRequested: false };

      // Send chat history
      sessions[sessionId].messages.forEach(msg => socket.emit("chatMessage", msg));

      // Auto greet
      const botMsg = {
        from: "bot",
        text: botReply("hello", sessions[sessionId]),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sessionId,
      };
      sessions[sessionId].messages.push(botMsg);
      io.to(sessionId).emit("chatMessage", botMsg);

      resetInactivityTimer(sessionId);
    });

    socket.on("chatMessage", (msg) => {
      const { sessionId } = msg;
      if (!sessions[sessionId]) sessions[sessionId] = { messages: [], context: {}, humanRequested: false };

      sessions[sessionId].messages.push(msg);
      io.to(sessionId).emit("chatMessage", msg);
      logMessage(msg);
      resetInactivityTimer(sessionId);

      if (msg.from === "customer") {
        const replyText = botReply(msg.text, sessions[sessionId]);
        if (replyText) {
          const botMsg = {
            from: "bot",
            text: replyText,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            sessionId,
          };
          setTimeout(() => {
            sessions[sessionId].messages.push(botMsg);
            io.to(sessionId).emit("chatMessage", botMsg);
            logMessage(botMsg);
          }, 500);
        }
      }
    });

    socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
  });

  return io;
}
