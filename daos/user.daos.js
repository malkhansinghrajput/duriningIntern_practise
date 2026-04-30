import User from "../model/user.model.js";

const getUserByEmail = (email) => User.findOne({ email });

const getUserById = (id) => User.findById(id);

const getUserByEmailOrContact = (email, contact) =>
  User.findOne({ $or: [{ email }, { contact }] });

const createUser = (data) => User.create(data);

const updateRefreshToken = (userId, refreshToken) =>
  User.findByIdAndUpdate(userId, { refreshToken }, { new: true });

export default {
  getUserByEmail,
  getUserById,
  getUserByEmailOrContact,
  createUser,
  updateRefreshToken
};