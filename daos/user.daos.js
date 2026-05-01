import User from "../model/user.model.js";

const createUser = (data) => User.create(data);

const getUserByEmail = (email) => User.findOne({ email });

const getUserById = (id) => User.findById(id);

const getUserByEmailOrContact = (email, contact) =>
  User.findOne({ $or: [{ email }, { contact }] });

  const getAllUsers = ()=>{
    return User.find();
  }

  const  deleteUser= (id)=>{
    return User.findByIdAndDelete(id);
  }

const updateRefreshToken = (userId, refreshToken) =>
  User.findByIdAndUpdate(userId, { refreshToken }, { new: true });

export default {
  getUserByEmail,
  getUserById,
  getUserByEmailOrContact,
  getAllUsers,
  createUser,
  deleteUser,
  updateRefreshToken
};
