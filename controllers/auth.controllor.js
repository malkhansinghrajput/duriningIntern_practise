import AuthService from "../services/auth.service.js";
import { sendSuccess, sendFail } from "../response/response.js";
import { STATUS_CODES } from "../constants/common.constant.js";

export const register = async (req, res) => {
  try {
    const user = await AuthService.register(req.body);
    sendSuccess(res, "Registered", STATUS_CODES.SUCCESS, { user });
  } catch (e) {
    sendFail(res, e.message, STATUS_CODES.BAD_REQUEST);
  }
};

export const login = async (req, res) => {
  try {
    const data = await AuthService.login(req.body);
    sendSuccess(res, "Login success", 200, data);
  } catch (e) {
    sendFail(res, e.message, 400);
  }
};

export const refresh = async (req, res) => {
  try {
    const data = await AuthService.refresh(req.body.refreshToken);
    sendSuccess(res, "New token", 200, data);
  } catch (e) {
    sendFail(res, e.message, 401);
  }
};

export const logout = async (req, res) => {
  await AuthService.logout(req.body.userId);
  sendSuccess(res, "Logout", 200);
};