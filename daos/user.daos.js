import User from "../model/user.model.js";

const createUser = (data) => User.create(data);

const getUserByEmail = (email) => User.findOne({ email }).lean();

const getUserById = (id) => User.findById(id).lean();

const getUserByEmailOrContact = (email, contact) =>
  User.findOne({ $or: [{ email }, { contact }] }).lean();

const getAllUsers = () => {
  return User.find({ isActive: true }).select("-password").lean();
};

const deleteUser = (id) => {
  return User.findByIdAndUpdate(id, { isActive: false }, { new: true });
};

const hardDeleteUser = (id) => {
  return User.findByIdAndDelete(id);
};

const updateRefreshToken = (userId, refreshToken) =>
  User.findByIdAndUpdate(userId, { refreshToken }, { new: true });

const updateUserRole = (userId, role) =>
  User.findByIdAndUpdate(userId, { role }, { new: true });

const getUserCount = () => User.countDocuments();

export default {
  getUserByEmail,
  getUserById,
  getUserByEmailOrContact,
  getAllUsers,
  createUser,
  deleteUser,
  hardDeleteUser,
  updateRefreshToken,
  updateUserRole,
  getUserCount
};
