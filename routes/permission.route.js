import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";
import {
  grantUserPermission,
  grantRolePermission,
  revokeUserPermission,
  revokeRolePermission,
  getAllPermissions,
  getPermissionsByRole,
  getPermissionsByUser
} from "../controllers/permission.controller.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get permissions (super admin only)
router.get("/", authorizeRoles(["super_admin"]), getAllPermissions);
router.get("/role/:role", authorizeRoles(["super_admin"]), getPermissionsByRole);
router.get("/user/:userId", authorizeRoles(["super_admin"]), getPermissionsByUser);

// Grant/revoke permissions (super admin only)
router.post("/user", authorizeRoles(["super_admin"]), grantUserPermission);
router.post("/role", authorizeRoles(["super_admin"]), grantRolePermission);
router.delete("/user/:userId/:permissionId", authorizeRoles(["super_admin"]), revokeUserPermission);
router.delete("/role/:role/:permissionId", authorizeRoles(["super_admin"]), revokeRolePermission);

export default router;