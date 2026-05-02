import express from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  getAllUsers,
  deleteUser,
  promoteUser
} from "../controllers/auth.controllor.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);

// Protected routes
router.post("/logout", protect, logout);
router.get("/profile", protect, getProfile);

// Admin routes (admin and super_admin)
router.get("/users", protect, authorizeRoles(["admin", "super_admin"]), getAllUsers);

// Super admin routes
router.delete("/users/:id", protect, authorizeRoles(["super_admin"]), deleteUser);
router.patch("/users/promote/:id", protect, authorizeRoles(["super_admin"]), promoteUser);

export default router;