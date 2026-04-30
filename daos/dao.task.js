import Task from "../model/task.model.js";

const createTask = (data) => Task.create(data);

export default { createTask };