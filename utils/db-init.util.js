import Role from "../model/role.model.js";
import Permission from "../model/permission.model.js";
import RolePermission from "../model/rolePermisssion.model.js";

import {
  ROLES,
  PERMISSIONS
} from "../constants/common.constant.js";


/**
 * Initialize database with default roles & permissions
 */
export const initializeDatabase = async () => {

  try {

    // =========================
    // CREATE DEFAULT ROLES
    // =========================

    const roleNames = Object.values(ROLES);

    for (const roleName of roleNames) {

      const exists = await Role.findOne({
        name: roleName
      });

      if (!exists) {

        await Role.create({
          name: roleName,
          description: `${roleName.replace("_", " ")} role`
        });

        console.log(`✓ Created role: ${roleName}`);
      }
    }


    // =========================
    // CREATE DEFAULT PERMISSIONS
    // =========================

    const permissionsList = [

      {
        name: PERMISSIONS.TASK_CREATE,
        resource: "task",
        action: "create"
      },

      {
        name: PERMISSIONS.TASK_READ,
        resource: "task",
        action: "read"
      },

      {
        name: PERMISSIONS.TASK_UPDATE,
        resource: "task",
        action: "update"
      },

      {
        name: PERMISSIONS.TASK_DELETE,
        resource: "task",
        action: "delete"
      },

      {
        name: PERMISSIONS.TASK_ASSIGN,
        resource: "task",
        action: "assign"
      },


      // USER

      {
        name: PERMISSIONS.USER_READ,
        resource: "user",
        action: "read"
      },

      {
        name: PERMISSIONS.USER_DELETE,
        resource: "user",
        action: "delete"
      },

      {
        name: PERMISSIONS.USER_PROMOTE,
        resource: "user",
        action: "promote"
      },

      {
        name: PERMISSIONS.USER_MANAGE,
        resource: "user",
        action: "manage"
      }

    ];


    for (const perm of permissionsList) {

      const exists = await Permission.findOne({
        name: perm.name
      });

      if (!exists) {

        await Permission.create(perm);

        console.log(`✓ Created permission: ${perm.name}`);
      }
    }


    // ASSIGN DEFAULT PERMISSIONS

    await assignDefaultPermissions();

    console.log("✓ Database initialization completed");

  } catch (error) {

    console.error(
      "Error initializing database:",
      error.message
    );

  }
};




/**
 * Assign permissions to roles
 */
const assignDefaultPermissions = async () => {

  try {

    // =========================
    // FETCH ROLES
    // =========================

    const superAdminRole = await Role.findOne({
      name: ROLES.SUPER_ADMIN
    });

    const adminRole = await Role.findOne({
      name: ROLES.ADMIN
    });

    const userRole = await Role.findOne({
      name: ROLES.USER
    });


    // =========================
    // FETCH ALL PERMISSIONS
    // =========================

    const permissions = await Permission.find();


    // =========================
    // SUPER ADMIN
    // =========================

    const superAdminExists = await RolePermission.findOne({
      role: superAdminRole._id
    });

    if (!superAdminExists) {

      const superAdminMappings = permissions.map((perm) => ({
        role: superAdminRole._id,
        permission: perm._id
      }));

      await RolePermission.insertMany(
        superAdminMappings
      );

      console.log(
        `✓ Assigned permissions to ${ROLES.SUPER_ADMIN}`
      );
    }

    // =========================
    // ADMIN
    // =========================

    const adminPermissions = [

      PERMISSIONS.TASK_CREATE,
      PERMISSIONS.TASK_READ,
      PERMISSIONS.TASK_UPDATE,
      PERMISSIONS.TASK_DELETE,
      PERMISSIONS.TASK_ASSIGN,
      PERMISSIONS.USER_READ

    ];

    const adminExists = await RolePermission.findOne({
      role: adminRole._id
    });

    if (!adminExists) {

      const adminPermissionDocs =
        await Permission.find({
          name: { $in: adminPermissions }
        });

      const adminMappings =
        adminPermissionDocs.map((perm) => ({
          role: adminRole._id,
          permission: perm._id
        }));

      await RolePermission.insertMany(
        adminMappings
      );

      console.log(
        `✓ Assigned permissions to ${ROLES.ADMIN}`
      );
    }

    // =========================
    // USER
    // =========================

    const userPermissions = [

      PERMISSIONS.TASK_READ,
      PERMISSIONS.TASK_UPDATE

    ];

    const userExists = await RolePermission.findOne({
      role: userRole._id
    });

    if (!userExists) {

      const userPermissionDocs =
        await Permission.find({
          name: { $in: userPermissions }
        });

      const userMappings =
        userPermissionDocs.map((perm) => ({
          role: userRole._id,
          permission: perm._id
        }));

      await RolePermission.insertMany(
        userMappings
      );

      console.log(
        `✓ Assigned permissions to ${ROLES.USER}`
      );
    }

  } catch (error) {

    console.error(
      "Error assigning default permissions:",
      error.message
    );

  }
};