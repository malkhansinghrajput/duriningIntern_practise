import RolePermission from "../model/rolePermisssion.model.js";
import UserPermission from "../model/userPermission.model.js";
import Permission from "../model/permission.model.js";
import Role from "../model/role.model.js";
import { ROLES } from "../constants/common.constant.js";

export const hasPermission = async (
  userId,
  userRole,
  permissionName
) => {

  try {

    // SUPER ADMIN BYPASS
    if (userRole === ROLES.SUPER_ADMIN) {
      return true;
    }

    // FIND PERMISSION
    const permission = await Permission.findOne({
      name: permissionName
    });

    if (!permission) {
      return false;
    }

    // =================================
    // DENY PERMISSION CHECK
    // =================================

    const deniedPermission = await UserPermission.findOne({
      user: userId,
      permission: permission._id,
      type: "deny"
    });

    if (deniedPermission) {
      return false;
    }

    // =================================
    // USER EXTRA PERMISSION
    // =================================

    const userPermission = await UserPermission.findOne({
      user: userId,
      permission: permission._id,
      type: "allow"
    });

    if (userPermission) {
      return true;
    }

    // =================================
    // ROLE FIND
    // =================================

    const roleData = await Role.findOne({
      name: userRole
    });

    if (!roleData) {
      return false;
    }

    // =================================
    // ROLE PERMISSION CHECK
    // =================================

    const rolePermission = await RolePermission.findOne({
      role: roleData._id,
      permission: permission._id
    });

    if (rolePermission) {
      return true;
    }

    return false;

  } catch (error) {

    console.log(error);
    return false;

  }

};

export const hasRole = (userRole, requiredRole) => {

  if (userRole === ROLES.SUPER_ADMIN) {
    return true;
  }

  return userRole === requiredRole;

};

export const hasAnyRole = (userRole, requiredRoles) => {

  if (userRole === ROLES.SUPER_ADMIN) {
    return true;
  }

  return requiredRoles.includes(userRole);

};