export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500
};

export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  USER: "user"
};

export const PERMISSIONS = {
  // Task permissions
  TASK_CREATE: "task:create",
  TASK_READ: "task:read",
  TASK_UPDATE: "task:update",
  TASK_DELETE: "task:delete",
  TASK_ASSIGN: "task:assign",
  
  // User permissions
  USER_READ: "user:read",
  USER_DELETE: "user:delete",
  USER_PROMOTE: "user:promote",
  USER_MANAGE: "user:manage"
};

export const TASK_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed"
};