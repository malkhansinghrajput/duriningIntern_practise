import AuthService from "../services/auth.service.js";
import * as permissionDao from "../daos/permission.dao.js";
import { sendSuccess, sendFail } from "../response/response.js";
import { STATUS_CODES } from "../constants/common.constant.js";
import { errorHandler } from "../utils/error.util.js";

/**
 * Grant permission to user
 * POST /api/permissions/user
 */
export const  grantUserPermission = async (req, res) => {
  try {
    const { userId, permissionName, type } = req.body;

    if (!userId || !permissionName) {
      return sendFail(res, "userId and permissionName are required", STATUS_CODES.BAD_REQUEST);
    }

    await AuthService.assignPermissionToUser(userId, permissionName, type || "allow");
    sendSuccess(res, "Permission granted to user", STATUS_CODES.SUCCESS);
  } catch (error) {
    errorHandler(error, res);
  }
};

/**
 * Grant permission to role
 * POST /api/permissions/role
 */
export const grantRolePermission = async (req, res) => {
  try {
    const { role, permissionName } = req.body;

    if (!role || !permissionName) {
      return sendFail(res, "role and permissionName are required", STATUS_CODES.BAD_REQUEST);
    }

    await AuthService.assignPermissionToRole(role, permissionName);
    sendSuccess(res, "Permission granted to role", STATUS_CODES.SUCCESS);
  } catch (error) {
    errorHandler(error, res);
  }
};

/**
 * Revoke permission from user
 * DELETE /api/permissions/user/:userId/:permissionId
 */
export const revokeUserPermission = async (req, res) => {
  try {
    const { userId, permissionId } = req.params;

    await permissionDao.removePermissionFromUser(userId, permissionId);
    sendSuccess(res, "Permission revoked from user", STATUS_CODES.SUCCESS);
  } catch (error) {
    errorHandler(error, res);
  }
};

/**
 * Revoke permission from role
 * DELETE /api/permissions/role/:role/:permissionId
 */
export const revokeRolePermission = async (req, res) => {
  try {
    const { role, permissionId } = req.params;

    await permissionDao.removePermissionFromRole(role, permissionId);
    sendSuccess(res, "Permission revoked from role", STATUS_CODES.SUCCESS);
  } catch (error) {
    errorHandler(error, res);
  }
};

/**
 * Get all permissions
 * GET /api/permissions
 */
export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await permissionDao.getAllPermissions();
    sendSuccess(res, "Permissions retrieved", STATUS_CODES.SUCCESS, { permissions });
  } catch (error) {
    errorHandler(error, res);
  }
};

/**
 * Get permissions by role
 * GET /api/permissions/role/:role
 */
export const getPermissionsByRole = async (req, res) => {
  try {
    const permissions = await permissionDao.getPermissionsByRole(req.params.role);
    sendSuccess(res, "Permissions retrieved", STATUS_CODES.SUCCESS, { permissions });
  } catch (error) {
    errorHandler(error, res);
  }
};

/**
 * Get permissions by user
 * GET /api/permissions/user/:userId
 */
export const getPermissionsByUser = async (req, res) => {
  try {
    const permissions = await permissionDao.getPermissionsByUser(req.params.userId);
    sendSuccess(res, "Permissions retrieved", STATUS_CODES.SUCCESS, { permissions });
  } catch (error) {
    errorHandler(error, res);
  }
};