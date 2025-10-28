import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export class UserService {
  static async createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User({
      ...userData,
      password: hashedPassword
    });
    return user.save();
  }

  static async findUserByEmail(email) {
    return User.findByEmail(email);
  }

  static async validatePassword(user, password) {
    return bcrypt.compare(password, user.password);
  }

  static async updateLastLogin(user) {
    user.lastLogin = new Date().toISOString();
    return user.save();
  }

  static async getUserProfile(id) {
    const user = User.findById(id);
    return user ? user.toPublic() : null;
  }
}