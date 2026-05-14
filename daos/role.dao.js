import Role from "../model/role.model.js";

const getRoleByName = (name) => Role.findOne({ name }).lean();

const createRole = (data) => Role.create(data);

const getAllRoles = () => Role.find().lean();


export default {
  getRoleByName,
  createRole,
  getAllRoles
};
