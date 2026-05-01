import express from "express";
import {
  register,
  login,
  refresh,
  logout,
  getAllUsers,
  deleteUser,
  userProfile
} from "../controllers/auth.controllor.js";
import { protect } from "../middleware/auth.middleware.js";
import {authorizeRoles} from "../middleware/role.midleware.js"

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

//  profile
router.get("/profile", protect, userProfile);

// admin
router.get("/users", protect, authorizeRoles("admin", "superAdmin"), getAllUsers)


// super admin
router.delete("/user/:id", protect, authorizeRoles("superAdmin"), deleteUser)

export default router;