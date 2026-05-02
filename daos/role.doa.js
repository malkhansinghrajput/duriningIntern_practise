import User from "../models/user.model.js";

export const createUser = (data) => User.create(data);
export const getUserById = (id) => User.findById(id).populate("role");