import cloudinary from "../config/clodnary.js";
import taskDao from "../daos/dao.task.js";
import { ApiError } from "../utils/error.util.js";
import { TASK_STATUS } from "../constants/common.constant.js";

class TaskService {

  /**
   * Create a new task
   */
  async createTask(data, file, userId) {
    const { title, description, assignedTo, priority, dueDate } = data;

    // Validate required fields
    if (!title || !assignedTo) {
      throw new ApiError(400, "Title and assignedTo are required");
    }

    let imageUrl = "";

    if (file) {
      const result = await cloudinary.uploader.upload(file.path);
      imageUrl = result.secure_url;
    }

    const task = await taskDao.createTask({
      title,
      description,
      assignedTo,
      assignedBy: userId,
      image: imageUrl,
      priority: priority || "medium",
      dueDate,
      status: TASK_STATUS.PENDING
    });

    return task;
  }

  /**
   * Get all tasks (for super admin/admin)
   */
  async getAllTasks() {
    return taskDao.getAllTasks();
  }

  /**
   * Get tasks assigned to user
   */
  async getTasksByUser(userId) {
    return taskDao.getTasksByUser(userId);
  }

  /**
   * Get tasks assigned by user
   */
  async getTasksByAssignedBy(userId) {
    return taskDao.getTasksByAssignedBy(userId);
  }

  /**
   * Get single task
   */
  async getTaskById(taskId) {
    const task = await taskDao.getTaskById(taskId);
    if (!task) {
      throw new ApiError(404, "Task not found");
    }
    return task;
  }

  /**
   * Update task
   */
  async updateTask(taskId, data, userId, userRole) {
    const task = await taskDao.getTaskById(taskId);
    
    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    // Check authorization
    // Only task assignee can update status, admin can update anything
    const { status, ...otherData } = data;
    
    // If only updating status, user must be assignee
    if (status && task.assignedTo._id.toString() !== userId) {
      if (userRole !== "admin" && userRole !== "super_admin") {
        throw new ApiError(403, "You can only update your assigned tasks");
      }
    }

    // Validate status if provided
    if (status && !Object.values(TASK_STATUS).includes(status)) {
      throw new ApiError(400, "Invalid task status");
    }

    const updateData = { ...otherData };
    if (status) updateData.status = status;

    return taskDao.updateTask(taskId, updateData);
  }

  /**
   * Delete task
   */
  async deleteTask(taskId) {
    const task = await taskDao.getTaskById(taskId);
    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    return taskDao.deleteTask(taskId);
  }

  /**
   * Get tasks by status
   */
  async getTasksByStatus(status) {
    if (!Object.values(TASK_STATUS).includes(status)) {
      throw new ApiError(400, "Invalid task status");
    }

    return taskDao.getTasksByStatus(status);
  }
}

export default new TaskService();