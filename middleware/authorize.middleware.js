import { hasPermission, hasRole, hasAnyRole } from "../utils/permissionChecker.js";
import { sendFail } from "../response/response.js";
import { STATUS_CODES } from "../constants/common.constant.js";

/**
 * Middleware to check if user has specific permission
 * @param {string} permission - Permission name (e.g., "task:create")
 */
export const authorize = (permission) => {
  return async (req, res, next) => {
    try {
      const ok = await hasPermission(req.user.userId, req.user.role, permission);

      if (!ok) {
        return sendFail(res, "Forbidden - Insufficient permissions", STATUS_CODES.FORBIDDEN);
      }

      next();
    } catch (error) {
      return sendFail(res, "Error checking permissions", STATUS_CODES.SERVER_ERROR);
    }
  };
};

/**
 * Middleware to check if user has specific role
 * @param {string} role - Role name (e.g., "admin")
 */
export const authorizeRole = (role) => {
  return (req, res, next) => {
    if (!hasRole(req.user.role, role)) {
      return sendFail(res, "Forbidden - Insufficient role", STATUS_CODES.FORBIDDEN);
    }
    next();
  };
};

/**
 * Middleware to check if user has any of the required roles
 * @param {string[]} roles - Array of role names
 */
export const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!hasAnyRole(req.user.role, roles)) {
      return sendFail(res, "Forbidden - Insufficient role", STATUS_CODES.FORBIDDEN);
    }
    next();
  };
};