import express from "express";
import { createTask } from "../controllers/task.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middlewre.js";

const router = express.Router();

router.post("/create", protect, upload.single("image"), createTask);

export default router;