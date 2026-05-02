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
import { authorizeRoles, authorize } from "../middleware/authorize.middleware.js";
import { upload } from "../middleware/upload.middlewre.js";

const router = express.Router();

// All task routes require authentication
router.use(protect);

// User can view their assigned tasks
router.get("/my-tasks", getMyTasks);

// User can view and update individual tasks
router.get("/:id", getTask);
router.put("/:id", updateTask);

// Admin routes (create and delete tasks)
router.post("/", upload.single("image"), authorizeRoles(["admin", "super_admin"]), createTask);
router.delete("/:id", authorizeRoles(["admin", "super_admin"]), deleteTask);

// Super admin routes (view all tasks)
router.get("/", authorizeRoles(["super_admin"]), getAllTasks);
router.get("/status/:status", authorizeRoles(["super_admin"]), getTasksByStatus);

export default router;