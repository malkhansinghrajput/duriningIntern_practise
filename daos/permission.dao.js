import Permission from "../model/permission.model.js";
import RolePermission from "../model/rolePermisssion.model.js";
import UserPermission from "../model/userPermission.model.js";

// Permission CRUD
export const createPermission = (data) => Permission.create(data);

export const getPermissionByName = (name) => Permission.findOne({ name }).lean();

export const getPermissionById = (id) => Permission.findById(id).lean();

export const getAllPermissions = () => Permission.find().lean();

// Role-Permission
export const assignPermissionToRole = (role, permissionId) =>
  RolePermission.create({ role, permission: permissionId });

export const getPermissionsByRole = (role) =>
  RolePermission.find({ role }).populate("permission").lean();

export const removePermissionFromRole = (role, permissionId) =>
  RolePermission.deleteOne({ role, permission: permissionId });

// User-Permission
export const assignPermissionToUser = (userId, permissionId, type = "allow") =>
  UserPermission.create({ user: userId, permission: permissionId, type });

export const getPermissionsByUser = (userId) =>
  UserPermission.find({ user: userId }).populate("permission").lean();

export const removePermissionFromUser = (userId, permissionId) =>
  UserPermission.deleteOne({ user: userId, permission: permissionId });

export const updateUserPermission = (userId, permissionId, type) =>
  UserPermission.findOneAndUpdate(
    { user: userId, permission: permissionId },
    { type },
    { new: true }
  );