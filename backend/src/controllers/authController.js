import fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");

// Helper: read users from JSON file
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE, "utf8");
  return data ? JSON.parse(data) : [];
}

// Helper: write users to JSON file
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export const register = async (req, res) => {
  try {
    const { username, password, email, fullName } = req.body;

    if (!username || !password || !email)
      return res.status(400).json({ message: "Missing fields" });

    // Read existing users
    let users = [];
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, "utf-8");
      users = JSON.parse(data || "[]");
    }

    if (users.find(u => u.username === username))
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now(),
      username,
      email,
      fullName,
      password: hashed,
      role: "user",
      createdAt: new Date,
    };

    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    res.json({ message: "User registered", user: { username, email } });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = loadUsers();
    const user = users.find(u => u.email === email);
    if (!user) return res.status(401).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    user.lastLogin = new Date.toISOString();
    saveUsers(users);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        themePreference: user.themePreference,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login", error: err.message });
  }
};

export const profile = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const users = loadUsers();
    const user = users.find(u => u.id === decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Return public info only
    res.json({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      themePreference: user.themePreference,
      lastLogin: user.lastLogin,
      role: user.role,
    });
  } catch (err) {
    console.error("GetProfile error:", err);
    res.status(500).json({ message: "Server error retrieving profile", error: err.message });
  }
};

