import express from "express";
import {
  createTask,
  getAllTasks,
  getMyTasks,
  getTask,
  updateTask,
  deleteTask,
  getTasksByStatus
} from "../controllers/task.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";
import { upload } from "../middleware/upload.middlewre.js";
import { ROLES } from "../constants/common.constant.js";

const router = express.Router();

//  All routes require authentication
router.use(protect);

//  User routes
router.get("/my-tasks", getMyTasks);

//  IMPORTANT: Specific routes FIRST
router.get("/status/:status", authorizeRoles([ROLES.SUPER_ADMIN]), getTasksByStatus);

// Admin & Super Admin routes
router.post(
  "/",
  upload.single("image"),
  authorizeRoles([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  createTask
);

router.delete(
  "/:id",
  authorizeRoles([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  deleteTask
);

// Super Admin only
router.get(
  "/",
  authorizeRoles([ROLES.SUPER_ADMIN]),
  getAllTasks
);

//  General authenticated routes (keep LAST)
router.get("/:id", getTask);
router.put("/:id", updateTask);

export default router;