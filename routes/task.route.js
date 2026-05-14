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
import { authorize } from "../middleware/authorize.middleware.js";
import { upload } from "../middleware/upload.middlewre.js";

const router = express.Router();


router.use(protect);

// ======================================
// USER ROUTES
// ======================================

// My Tasks
router.get(
  "/my-tasks",
  authorize("task:my"),
  getMyTasks
);

// Tasks By Status
router.get(
  "/status/:status",
  authorize("task:status"),
  getTasksByStatus
);

// ======================================
// CREATE TASK
// ======================================

router.post(
  "/",
  upload.single("image"),
  authorize("task:create"),
  createTask
);

// ======================================
// DELETE TASK
// ======================================

router.delete(
  "/:id",
  authorize("task:delete"),
  deleteTask
);

// ======================================
// GET ALL TASKS
// ======================================

router.get(
  "/",
  authorize("task:read"),
  getAllTasks
);

// ======================================
// GET SINGLE TASK
// ======================================

router.get(
  "/:id",
  authorize("task:single"),
  getTask
);

// ======================================
// UPDATE TASK
// ======================================

router.put(
  "/:id",
  authorize("task:update"),
  updateTask
);

export default router;