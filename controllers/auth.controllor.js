import AuthService from "../services/auth.service.js";
import { sendSuccess, sendFail } from "../response/response.js";
import { STATUS_CODES } from "../constants/common.constant.js";
import { errorHandler } from "../utils/error.util.js";

/**
 * Register new user
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { user, message } = await AuthService.register(req.body);
    sendSuccess(res, message || "Registered successfully", STATUS_CODES.CREATED, { user });
  } catch (error) {
    errorHandler(error, res);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await AuthService.login(req.body);

    // Set tokens in cookies
    res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "strict" });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });

    sendSuccess(res, "Login successful", STATUS_CODES.SUCCESS, { user, accessToken, refreshToken });
  } catch (error) {
    errorHandler(error, res);
  }
};

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;

    const { accessToken, refreshToken: newRefreshToken } = await AuthService.refreshToken(token);

    res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "strict" });
    res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true, sameSite: "strict" });

    sendSuccess(res, "Token refreshed", STATUS_CODES.SUCCESS, { accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    errorHandler(error, res);
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logout = async (req, res) => {
  try {
    await AuthService.logout(req.user.userId);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    sendSuccess(res, "Logout successful", STATUS_CODES.SUCCESS);
  } catch (error) {
    errorHandler(error, res);
  }
};

/**
 * Get user profile
 * GET /api/auth/profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await AuthService.getProfile(req.user.userId);
    sendSuccess(res, "Profile retrieved", STATUS_CODES.SUCCESS, { user });
  } catch (error) {
    errorHandler(error, res);
  }
};

/**
 * Get all users (admin+)
 * GET /api/users
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await AuthService.getAllUsers();
    sendSuccess(res, "Users retrieved", STATUS_CODES.SUCCESS, { users });
  } catch (error) {
    errorHandler(error, res);
  }
};

/**
 * Delete user (super admin only)
 * DELETE /api/users/:id
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await AuthService.deleteUser(req.user.userId, req.params.id);
    sendSuccess(res, "User deleted successfully", STATUS_CODES.SUCCESS, { user });
  } catch (error) {
    errorHandler(error, res);
  }
};

/**
 * Promote user (super admin only)
 * PATCH /api/users/promote/:id
 */
export const promoteUser = async (req, res) => {
  try {
    const { newRole } = req.body;

    if (!newRole) {
      return sendFail(res, "New role is required", STATUS_CODES.BAD_REQUEST);
    }

    const user = await AuthService.promoteUser(req.user.userId, req.params.id, newRole);
    sendSuccess(res, "User role updated", STATUS_CODES.SUCCESS, { user });
  } catch (error) {
    errorHandler(error, res);
  }
};