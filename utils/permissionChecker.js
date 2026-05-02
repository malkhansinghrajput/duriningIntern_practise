import RolePermission from "../model/rolePermisssion.model.js";
import UserPermission from "../model/userPermission.model.js";
import { ROLES } from "../constants/common.constant.js";

export const hasPermission = async (userId, userRole, permissionName) => {
  try {
    // Super admin has all permissions
    if (userRole === ROLES.SUPER_ADMIN) return true;

    // Check user-specific deny permission (takes precedence)
    const userDenyPerm = await UserPermission.findOne({
      user: userId,
      type: "deny"
    }).populate("permission");

    if (userDenyPerm && userDenyPerm.permission.name === permissionName) {
      return false;
    }

    // Check user-specific allow permission
    const userAllowPerm = await UserPermission.findOne({
      user: userId,
      type: "allow"
    }).populate("permission");

    if (userAllowPerm && userAllowPerm.permission.name === permissionName) {
      return true;
    }

    // Check role-based permissions
    const rolePerm = await RolePermission.findOne({
      role: userRole
    }).populate("permission");

    if (rolePerm && rolePerm.permission.name === permissionName) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
};

// Check if user has specific role
export const hasRole = (userRole, requiredRole) => {
  if (userRole === ROLES.SUPER_ADMIN) return true;
  return userRole === requiredRole;
};

// Check if user has any of the required roles
export const hasAnyRole = (userRole, requiredRoles) => {
  if (userRole === ROLES.SUPER_ADMIN) return true;
  return requiredRoles.includes(userRole);
};