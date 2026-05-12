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
router.use(authorizeRoles(["super_admin"]));

// Get permissions (super admin only)
router.get("/", getAllPermissions);
router.get("/role/:role", getPermissionsByRole);
router.get("/user/:userId", getPermissionsByUser);

// Grant/revoke permissions (super admin only)
router.post("/user", grantUserPermission);
router.post("/role", grantRolePermission);
router.delete("/user/:userId/:permissionId", revokeUserPermission);
router.delete("/role/:role/:permissionId",  revokeRolePermission);

export default router;   