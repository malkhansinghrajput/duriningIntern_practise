import cloudinary from "../config/clodnary.js";
import taskDao from "../daos/dao.task.js";
import userDao from "../daos/user.daos.js";
import { ApiError } from "../utils/error.util.js";
import { TASK_STATUS, ROLES } from "../constants/common.constant.js";

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

    // Validate assigned user exists
    const assignedUser = await userDao.getUserById(assignedTo);
    if (!assignedUser) {
      throw new ApiError(404, "Assigned user not found");
    }

    // Validate due date
    if (dueDate && new Date(dueDate) < new Date()) {
      throw new ApiError(400, "Due date cannot be in the past");
    }

    let imageUrl = "";

    // Validate & upload image
    if (file) {
      if (!file.mimetype.startsWith("image/")) {
        throw new ApiError(400, "Only image files allowed");
      }

      const result = await cloudinary.uploader.upload(file.path);
      imageUrl = result.secure_url;
    }

    const task = await taskDao.createTask({
      title: title.trim(),
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
   * Get all tasks
   */
  async getAllTasks(page = 1, limit = 10) {
    return taskDao.getAllTasks(page, limit);
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

    const { status, image, ...otherData } = data;

    // 🔐 Strict authorization
    if (userRole !== ROLES.ADMIN && userRole !== ROLES.SUPER_ADMIN) {
      // Normal user → only status update allowed
      if (Object.keys(data).some(key => key !== "status")) {
        throw new ApiError(403, "You can only update task status");
      }

      // Only assignee can update status
      if (task.assignedTo._id.toString() !== userId) {
        throw new ApiError(403, "You can only update your assigned tasks");
      }
    }

    // Validate status
    if (status && !Object.values(TASK_STATUS).includes(status)) {
      throw new ApiError(400, "Invalid task status");
    }

    // Handle image update
    let imageUrl = task.image;

    if (image) {
      if (!image.mimetype.startsWith("image/")) {
        throw new ApiError(400, "Only image files allowed");
      }

      // Delete old image if exists
      if (task.image) {
        const publicId = task.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      const result = await cloudinary.uploader.upload(image.path);
      imageUrl = result.secure_url;
    }

    const updateData = {
      ...otherData,
      image: imageUrl
    };

    if (status) updateData.status = status;

    return taskDao.updateTask(taskId, updateData);
  }

  /**
   * Delete task
   */
  async deleteTask(taskId, userId, userRole) {
    const task = await taskDao.getTaskById(taskId);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    // Only creator or admin can delete
    if (
      task.assignedBy._id.toString() !== userId &&
      userRole !== ROLES.ADMIN &&
      userRole !== ROLES.SUPER_ADMIN
    ) {
      throw new ApiError(403, "Not allowed to delete this task");
    }

    // Delete image from cloudinary
    if (task.image) {
      const publicId = task.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
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