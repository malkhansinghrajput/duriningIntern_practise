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
    const { user, accessToken, refreshToken } = await AuthService.login(req.body);

    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });
    sendSuccess(res, "Login success", 200, data);
  } catch (e) {
    sendFail(res, e.message, 400);
  }
};

export const refresh = async (req, res) => {
  try {
     const { accessToken, refreshToken } =
      await AuthService.refresh(req.cookies.refreshToken);

    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });
    sendSuccess(res, "New token", 200, data);
  } catch (e) {
    sendFail(res, e.message, 401);
  }
};

export const logout = async (req, res) => {
 await AuthService.logout(req.user.userId);

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  sendSuccess(res, "Logout", 200);
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await AuthService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await AuthService.deleteUser(req.params.id);
    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  };
}

  export const userProfile = async (req, res) => {
  try {
    await AuthService.getProfile(req.params.id);
      res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching profile" });
  }
};