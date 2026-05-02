import Task from "../model/task.model.js";

const createTask = (data) => Task.create(data);

const getTaskById = (id) => Task.findById(id).populate("assignedTo assignedBy").lean();

const getTasksByUser = (userId) =>
  Task.find({ assignedTo: userId }).populate("assignedTo assignedBy").lean();

const getTasksByAssignedBy = (userId) =>
  Task.find({ assignedBy: userId }).populate("assignedTo assignedBy").lean();

const getAllTasks = () =>
  Task.find().populate("assignedTo assignedBy").lean();

const updateTask = (id, data) =>
  Task.findByIdAndUpdate(id, data, { new: true }).populate("assignedTo assignedBy");

const deleteTask = (id) =>
  Task.findByIdAndDelete(id);

const getTasksByStatus = (status) =>
  Task.find({ status }).populate("assignedTo assignedBy").lean();

export default {
  createTask,
  getTaskById,
  getTasksByUser,
  getTasksByAssignedBy,
  getAllTasks,
  updateTask,
  deleteTask,
  getTasksByStatus
};