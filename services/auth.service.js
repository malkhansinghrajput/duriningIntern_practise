import userDao from "../daos/user.daos.js";
import { hashItem, compareItems } from "../utils/bcrypt.util.js";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken
} from "../utils/jwt.util.js";
import * as permissionDao from "../daos/permission.dao.js";
import { ApiError, errors } from "../utils/error.util.js";
import { ROLES } from "../constants/common.constant.js";

class AuthService {

  /**
   * Register new user
   * First user becomes super_admin, others default to user role
   */
  async register(data) {
    const { name, email, password, role } = data;

    // Prevent users from specifying role
    if (role) {
      throw new ApiError(400, "Role input is not allowed during registration");
    }

    // Check if user exists
    const exist = await userDao.getUserByEmail(email);
    if (exist) {
      throw new ApiError(409, "User already exists");
    }

    // First user becomes super_admin
    const userCount = await userDao.getUserCount();
    const assignRole = userCount === 0 ? ROLES.SUPER_ADMIN : ROLES.USER;

    // Hash password
    const hashed = await hashItem(password);

    // Create user
    const user = await userDao.createUser({
      name,
      email,
      password: hashed,
      role: assignRole
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      message: assignRole === ROLES.SUPER_ADMIN ? "Registered as Super Admin" : "Registered successfully"
    };
  }

  /**
   * Login user and return tokens
   */
  async login(data) {
    const { email, password } = data;

    // Validate input
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    // Get user
    const user = await userDao.getUserByEmail(email);
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Check if user is active
    if (!user.isActive) {
      throw new ApiError(401, "User account is disabled");
    }

    // Verify password
    const match = await compareItems(password, user.password);
    if (!match) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Generate tokens
    const accessToken = createAccessToken(user._id, user.role);
    const refreshToken = createRefreshToken(user._id, user.role);

    // Save refresh token
    await userDao.updateRefreshToken(user._id, refreshToken);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token is required");
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await userDao.getUserById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (!user.isActive) {
      throw new ApiError(401, "User account is disabled");
    }

    const newAccessToken = createAccessToken(user._id, user.role);
    const newRefreshToken = createRefreshToken(user._id, user.role);

    await userDao.updateRefreshToken(user._id, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }

  /**
   * Logout user
   */
  async logout(userId) {
    await userDao.updateRefreshToken(userId, null);
  }

  /**
   * Get user profile
   */
  async getProfile(userId) {
    const user = await userDao.getUserById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return user;
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers() {
    return userDao.getAllUsers();
  }

  /**
   * Delete user (super admin only)
   */
  async deleteUser(userId, targetUserId) {
    // Prevent self-deletion
    if (userId === targetUserId) {
      throw new ApiError(400, "Cannot delete yourself");
    }

    const targetUser = await userDao.getUserById(targetUserId);
    if (!targetUser) {
      throw new ApiError(404, "User not found");
    }

    // Prevent deleting last super admin
    if (targetUser.role === ROLES.SUPER_ADMIN) {
      const superAdminCount = await userDao.getUserCount(); // This needs to be fixed
      if (superAdminCount <= 1) {
        throw new ApiError(400, "Cannot delete the last super admin");
      }
    }

    return userDao.deleteUser(targetUserId);
  }

  /**
   * Promote user to different role (super admin only)
   */
  async promoteUser(userId, targetUserId, newRole) {
    // Validate role
    const validRoles = Object.values(ROLES);
    if (!validRoles.includes(newRole)) {
      throw new ApiError(400, "Invalid role specified");
    }

    // Prevent self-promotion
    if (userId === targetUserId) {
      throw new ApiError(400, "Cannot promote yourself");
    }

    const targetUser = await userDao.getUserById(targetUserId);
    if (!targetUser) {
      throw new ApiError(404, "User not found");
    }

    return userDao.updateUserRole(targetUserId, newRole);
  }

  /**
   * Assign permission to user
   */
  async assignPermissionToUser(userId, permissionName, type = "allow") {
    const permission = await permissionDao.getPermissionByName(permissionName);
    if (!permission) {
      throw new ApiError(404, "Permission not found");
    }

    return permissionDao.assignPermissionToUser(userId, permission._id, type);
  }

  /**
   * Assign permission to role
   */
  async assignPermissionToRole(role, permissionName) {
    const permission = await permissionDao.getPermissionByName(permissionName);
    if (!permission) {
      throw new ApiError(404, "Permission not found");
    }

    return permissionDao.assignPermissionToRole(role, permission._id);
  }
}

export default new AuthService();