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
    if (!req.body || !req.body.title || !req.body.assignedTo) {
      return sendFail(res, "Title and assignedTo are required", STATUS_CODES.BAD_REQUEST);
    }

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
    const { page = 1, limit = 10 } = req.query;

    const tasks = await TaskService.getAllTasks(Number(page), Number(limit));

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
    const { id } = req.params;

    if (!id) {
      return sendFail(res, "Task ID is required", STATUS_CODES.BAD_REQUEST);
    }

    const task = await TaskService.getTaskById(id);

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
    const { id } = req.params;

    if (!id) {
      return sendFail(res, "Task ID is required", STATUS_CODES.BAD_REQUEST);
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return sendFail(res, "No update data provided", STATUS_CODES.BAD_REQUEST);
    }

    const task = await TaskService.updateTask(
      id,
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
    const { id } = req.params;

    if (!id) {
      return sendFail(res, "Task ID is required", STATUS_CODES.BAD_REQUEST);
    }

    await TaskService.deleteTask(
      id,
      req.user.userId,
      req.user.role
    );

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
    const { status } = req.params;

    if (!status) {
      return sendFail(res, "Status is required", STATUS_CODES.BAD_REQUEST);
    }

    const tasks = await TaskService.getTasksByStatus(status);

    sendSuccess(res, "Tasks retrieved", STATUS_CODES.SUCCESS, { tasks });
  } catch (error) {
    errorHandler(error, res);
  }
};