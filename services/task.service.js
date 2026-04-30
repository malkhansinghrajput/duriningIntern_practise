import cloudinary from "../config/clodnary.js";
import taskDao from "../daos/dao.task.js";

class TaskService {

  async createTask(data, file, userId) {

    let imageUrl = "";

    if (file) {
      const result = await cloudinary.uploader.upload(file.path);
      imageUrl = result.secure_url;
    }

    const task = await taskDao.createTask({
      ...data,
      image: imageUrl,
      user: userId
    });

    return task;
  }
}

export default new TaskService();