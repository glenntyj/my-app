import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), "data", "users.json");

class User {
  constructor(data) {
    this.id = data.id || Date.now();
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.fullName = data.fullName || '';
    this.role = data.role || 'user';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.lastLogin = data.lastLogin;
    this.themePreference = data.themePreference || 'light';
  }

  static getAll() {
    try {
      if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, '[]', 'utf8');
        return [];
      }
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      const users = JSON.parse(data || '[]');
      return users.map(userData => new User(userData));
    } catch (error) {
      console.error('Error reading users file:', error);
      return [];
    }
  }

  static findByEmail(email) {
    const users = this.getAll();
    const user = users.find(u => u.email === email);
    return user ? new User(user) : null;
  }

  static findById(id) {
    const users = this.getAll();
    const user = users.find(u => u.id === id);
    return user ? new User(user) : null;
  }

  save() {
    const users = User.getAll();
    const userIndex = users.findIndex(u => u.id === this.id);
    
    if (userIndex !== -1) {
      users[userIndex] = this;
    } else {
      users.push(this);
    }

    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
      return this;
    } catch (error) {
      console.error('Error saving user:', error);
      throw new Error('Failed to save user');
    }
  }

  toPublic() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      fullName: this.fullName,
      role: this.role,
      themePreference: this.themePreference,
      lastLogin: this.lastLogin
    };
  }
}

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Initialize users file if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, '[]', 'utf8');
}

export default User;
