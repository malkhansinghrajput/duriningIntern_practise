import TaskService from "../services/task.service.js";
import { sendSuccess, sendFail } from "../response/response.js";

export const createTask = async (req, res) => {
  try {
    const task = await TaskService.createTask(
      req.body,
      req.file,
      req.user.userId
    );

    sendSuccess(res, "Task created", 200, { task });

  } catch (error) {
    sendFail(res, error.message, 500);
  }
};