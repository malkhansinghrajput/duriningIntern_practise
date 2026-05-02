import Role from "../model/role.model.js";
import Permission from "../model/permission.model.js";
import RolePermission from "../model/rolePermisssion.model.js";
import { ROLES, PERMISSIONS } from "../constants/common.constant.js";

/**
 * Initialize database with default roles and permissions
 */
export const initializeDatabase = async () => {
  try {
    // Create default roles
    const roleNames = Object.values(ROLES);
    for (const roleName of roleNames) {
      const exists = await Role.findOne({ name: roleName });
      if (!exists) {
        await Role.create({
          name: roleName,
          description: `${roleName.replace("_", " ")} role`
        });
        console.log(`✓ Created role: ${roleName}`);
      }
    }

    // Create default permissions
    const permissionsList = [
      // Task permissions
      { name: PERMISSIONS.TASK_CREATE, resource: "task", action: "create" },
      { name: PERMISSIONS.TASK_READ, resource: "task", action: "read" },
      { name: PERMISSIONS.TASK_UPDATE, resource: "task", action: "update" },
      { name: PERMISSIONS.TASK_DELETE, resource: "task", action: "delete" },
      { name: PERMISSIONS.TASK_ASSIGN, resource: "task", action: "assign" },

      // User permissions
      { name: PERMISSIONS.USER_READ, resource: "user", action: "read" },
      { name: PERMISSIONS.USER_DELETE, resource: "user", action: "delete" },
      { name: PERMISSIONS.USER_PROMOTE, resource: "user", action: "promote" },
      { name: PERMISSIONS.USER_MANAGE, resource: "user", action: "manage" }
    ];

    for (const perm of permissionsList) {
      const exists = await Permission.findOne({ name: perm.name });
      if (!exists) {
        await Permission.create(perm);
        console.log(`✓ Created permission: ${perm.name}`);
      }
    }

    // Assign permissions to roles
    await assignDefaultPermissions();

    console.log("✓ Database initialization completed");
  } catch (error) {
    console.error("Error initializing database:", error.message);
  }
};

/**
 * Assign default permissions to roles
 */
const assignDefaultPermissions = async () => {
  try {
    // Super admin gets all permissions
    const permissions = await Permission.find();
    const superAdminPerms = await RolePermission.find({ role: ROLES.SUPER_ADMIN });

    if (superAdminPerms.length === 0) {
      for (const perm of permissions) {
        await RolePermission.create({
          role: ROLES.SUPER_ADMIN,
          permission: perm._id
        });
      }
      console.log(`✓ Assigned all permissions to ${ROLES.SUPER_ADMIN}`);
    }

    // Admin gets task and user management permissions
    const adminPermissions = [
      PERMISSIONS.TASK_CREATE,
      PERMISSIONS.TASK_READ,
      PERMISSIONS.TASK_UPDATE,
      PERMISSIONS.TASK_DELETE,
      PERMISSIONS.TASK_ASSIGN,
      PERMISSIONS.USER_READ
    ];

    const adminPerms = await RolePermission.find({ role: ROLES.ADMIN });
    if (adminPerms.length === 0) {
      for (const permName of adminPermissions) {
        const perm = await Permission.findOne({ name: permName });
        if (perm) {
          await RolePermission.create({
            role: ROLES.ADMIN,
            permission: perm._id
          });
        }
      }
      console.log(`✓ Assigned admin permissions to ${ROLES.ADMIN}`);
    }

    // User gets basic permissions
    const userPermissions = [
      PERMISSIONS.TASK_READ,
      PERMISSIONS.TASK_UPDATE
    ];

    const userPerms = await RolePermission.find({ role: ROLES.USER });
    if (userPerms.length === 0) {
      for (const permName of userPermissions) {
        const perm = await Permission.findOne({ name: permName });
        if (perm) {
          await RolePermission.create({
            role: ROLES.USER,
            permission: perm._id
          });
        }
      }
      console.log(`✓ Assigned user permissions to ${ROLES.USER}`);
    }
  } catch (error) {
    console.error("Error assigning default permissions:", error.message);
  }
};
