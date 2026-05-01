import userDao from "../daos/user.daos.js";
import { hashItem, compareItems } from "../utils/bcrypt.util.js";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken
} from "../utils/jwt.util.js";

class AuthService {

  async register(data) {
    const { name, email, password, role } = data;

    const exist = await userDao.getUserByEmail(email);
    if (exist) throw new Error("User exists");

    const hashed = await hashItem(password);

    return userDao.createUser({
      name,
      email,
      password: hashed,
      role
    });
  }

  async login(data) {
    const { email, password } = data;

    const user = await userDao.getUserByEmail(email);
    if (!user) throw new Error("User not found");

    const match = await compareItems(password, user.password);
    if (!match) throw new Error("Wrong password");

    const accessToken = createAccessToken(user._id, user.role);
    const refreshToken = createRefreshToken(user._id, user.role);

    await userDao.updateRefreshToken(user._id, refreshToken);

    return { user, accessToken, refreshToken };
  }

  async refresh(refreshToken) {
    const decoded = verifyRefreshToken(refreshToken);

    const user = await userDao.getUserById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      throw new Error("Invalid refresh token");
    }

    const newAccessToken = createAccessToken(user._id, user.role);
    const newRefreshToken = createRefreshToken(user._id, user.role);

    await userDao.updateRefreshToken(user._id, newRefreshToken);
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(userId) {
    await userDao.updateRefreshToken(userId, null);
  }

  async getAllUsers() {
    return userDao.getAllUsers();
  }

  async deleteUser(id) {
    return userDao.deleteUser(id);
  }

  async getProfile(id) {
    return userDao.getUserById;
}
}



export default new AuthService();