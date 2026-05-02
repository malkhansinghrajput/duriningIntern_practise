// Centralized error handler
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (err, res) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode
  });
};

// Common error responses
export const errors = {
  INVALID_INPUT: new ApiError(400, "Invalid input provided"),
  USER_EXISTS: new ApiError(409, "User already exists"),
  USER_NOT_FOUND: new ApiError(404, "User not found"),
  INVALID_CREDENTIALS: new ApiError(401, "Invalid email or password"),
  UNAUTHORIZED: new ApiError(401, "Unauthorized access"),
  FORBIDDEN: new ApiError(403, "Forbidden - Insufficient permissions"),
  TOKEN_EXPIRED: new ApiError(401, "Token expired"),
  INVALID_TOKEN: new ApiError(401, "Invalid token"),
  PERMISSION_DENIED: new ApiError(403, "Permission denied"),
  TASK_NOT_FOUND: new ApiError(404, "Task not found"),
  PERMISSION_NOT_FOUND: new ApiError(404, "Permission not found"),
  CANNOT_PROMOTE_YOURSELF: new ApiError(400, "Cannot promote yourself"),
  CANNOT_DEMOTE_LAST_SUPER_ADMIN: new ApiError(400, "Cannot demote the last super admin"),
  INVALID_ROLE: new ApiError(400, "Invalid role specified"),
  ROLE_INPUT_NOT_ALLOWED: new ApiError(400, "Role input is not allowed during registration")
};
