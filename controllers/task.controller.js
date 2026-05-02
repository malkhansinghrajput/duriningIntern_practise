import TaskService from "../services/task.service.js";
import { sendSuccess, sendFail } from "../response/response.js";
import { STATUS_CODES } from "../constants/common.constant.js";
import { errorHandler } from "../utils/error.util.js";

/**
 * Create task (admin+)
 * POST /api/tasks
 */
export const createTask = async (req, res) => {
  try {
    const task = await TaskService.createTask(
      req.body,
      req.file,
      req.user.userId
    );

    sendSuccess(res, "Task created successfully", STATUS_CODES.CREATED, { task });
  } catch (error) {
    errorHandler(error, res);
  }
};

/**
 * Get all tasks (super admin/admin)
 * GET /api/tasks
 */
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await TaskService.getAllTasks();
    sendSuccess(res, "Tasks retrieved", STATUS_CODES.SUCCESS, { tasks });
  } catch (error) {
    errorHandler(error, res);
  }
};

/**
 * Get user's assigned tasks
 * GET /api/tasks/assigned/me
 */
export const getMyTasks = async (req, res) => {
  try {
    const tasks = await TaskService.getTasksByUser(req.user.userId);
    sendSuccess(res, "Tasks retrieved", STATUS_CODES.SUCCESS, { tasks });
  } catch (error) {
    errorHandler(error, res);
  }
};

/**
 * Get single task
 * GET /api/tasks/:id
 */
export const getTask = async (req, res) => {
  try {
    const task = await TaskService.getTaskById(req.params.id);
    sendSuccess(res, "Task retrieved", STATUS_CODES.SUCCESS, { task });
  } catch (error) {
    errorHandler(error, res);
  }
};

/**
 * Update task
 * PUT /api/tasks/:id
 */
export const updateTask = async (req, res) => {
  try {
    const task = await TaskService.updateTask(
      req.params.id,
      req.body,
      req.user.userId,
      req.user.role
    );

    sendSuccess(res, "Task updated successfully", STATUS_CODES.SUCCESS, { task });
  } catch (error) {
    errorHandler(error, res);
  }
};

/**
 * Delete task
 * DELETE /api/tasks/:id
 */
export const deleteTask = async (req, res) => {
  try {
    await TaskService.deleteTask(req.params.id);
    sendSuccess(res, "Task deleted successfully", STATUS_CODES.SUCCESS);
  } catch (error) {
    errorHandler(error, res);
  }
};

/**
 * Get tasks by status
 * GET /api/tasks/status/:status
 */
export const getTasksByStatus = async (req, res) => {
  try {
    const tasks = await TaskService.getTasksByStatus(req.params.status);
    sendSuccess(res, "Tasks retrieved", STATUS_CODES.SUCCESS, { tasks });
  } catch (error) {
    errorHandler(error, res);
  }
};