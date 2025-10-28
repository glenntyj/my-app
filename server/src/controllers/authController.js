import { UserService } from '../services/userService.js';
import { AuthService } from '../services/authService.js';

export const register = async (req, res) => {
  try {
    const { username, password, email, fullName } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await UserService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await UserService.createUser({
      username,
      password,
      email,
      fullName
    });

    res.status(201).json({
      message: "User registered successfully",
      user: user.toPublic()
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await UserService.validatePassword(user, password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = AuthService.generateToken(user);
    await UserService.updateLastLogin(user);

    res.json({
      message: "Login successful",
      token,
      user: user.toPublic()
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login", error: err.message });
  }
};

export const profile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userProfile = await UserService.getUserProfile(userId);
    
    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(userProfile);
  } catch (err) {
    console.error("GetProfile error:", err);
    res.status(500).json({ message: "Server error retrieving profile", error: err.message });
  }
};

