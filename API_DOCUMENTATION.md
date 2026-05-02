# RBAC Task & Team Management System - API Documentation

## 🔐 Authentication Endpoints

### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response:
{
  "success": true,
  "message": "Registered successfully",
  "data": {
    "user": {
      "id": "userId",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

**Note:** 
- First user registered becomes `super_admin`
- Subsequent users default to `user` role
- Role input during registration is ignored/rejected

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "accessToken": "jwt-token",
    "refreshToken": "jwt-token"
  }
}
```

### Refresh Access Token
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
OR pass refreshToken in cookie

Response:
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "accessToken": "new-jwt-token",
    "refreshToken": "new-jwt-token"
  }
}
```

### Logout
```
POST /api/auth/logout
Authorization: Bearer <accessToken>

Response:
{
  "success": true,
  "message": "Logout successful"
}
```

### Get User Profile
```
GET /api/auth/profile
Authorization: Bearer <accessToken>

Response:
{
  "success": true,
  "message": "Profile retrieved",
  "data": {
    "user": { id, name, email, role, ... }
  }
}
```

---

## 👥 User Management Endpoints (Admin+)

### Get All Users
```
GET /api/auth/users
Authorization: Bearer <accessToken>
Required Role: admin or super_admin

Response:
{
  "success": true,
  "message": "Users retrieved",
  "data": {
    "users": [
      { id, name, email, role, isActive, createdAt, ... }
    ]
  }
}
```

### Delete User (Super Admin Only)
```
DELETE /api/auth/users/:userId
Authorization: Bearer <accessToken>
Required Role: super_admin

Response:
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "user": { ... }
  }
}
```

### Promote/Change User Role (Super Admin Only)
```
PATCH /api/auth/users/promote/:userId
Authorization: Bearer <accessToken>
Content-Type: application/json
Required Role: super_admin

{
  "newRole": "admin"  // or "user" or "super_admin"
}

Response:
{
  "success": true,
  "message": "User role updated",
  "data": {
    "user": { id, name, email, role: "admin", ... }
  }
}
```

---

## 📋 Task Management Endpoints

### Create Task (Admin+)
```
POST /api/tasks
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
Required Role: admin or super_admin

{
  "title": "Design Homepage",
  "description": "Create modern responsive homepage design",
  "assignedTo": "userId",
  "priority": "high",
  "dueDate": "2026-05-15"
  "image": <file>
}

Response:
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "id": "taskId",
      "title": "Design Homepage",
      "description": "...",
      "status": "pending",
      "assignedTo": { id, name, email },
      "assignedBy": { id, name, email },
      "priority": "high",
      "dueDate": "2026-05-15",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

### Get My Assigned Tasks
```
GET /api/tasks/my-tasks
Authorization: Bearer <accessToken>

Response:
{
  "success": true,
  "message": "Tasks retrieved",
  "data": {
    "tasks": [ ... ]
  }
}
```

### Get Single Task
```
GET /api/tasks/:taskId
Authorization: Bearer <accessToken>

Response:
{
  "success": true,
  "message": "Task retrieved",
  "data": {
    "task": { ... }
  }
}
```

### Update Task
```
PUT /api/tasks/:taskId
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "status": "in_progress",  // or "completed"
  "priority": "medium",
  "dueDate": "2026-05-20"
}

Response:
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "task": { ... }
  }
}
```

**Note:**
- Users can only update their assigned tasks (status only)
- Admins can update all task fields
- Super admins have full control

### Delete Task (Admin+)
```
DELETE /api/tasks/:taskId
Authorization: Bearer <accessToken>
Required Role: admin or super_admin

Response:
{
  "success": true,
  "message": "Task deleted successfully"
}
```

### Get All Tasks (Super Admin Only)
```
GET /api/tasks
Authorization: Bearer <accessToken>
Required Role: super_admin

Response:
{
  "success": true,
  "message": "Tasks retrieved",
  "data": {
    "tasks": [ ... ]
  }
}
```

### Get Tasks by Status (Super Admin Only)
```
GET /api/tasks/status/:status
Authorization: Bearer <accessToken>
Required Role: super_admin
Status: pending | in_progress | completed

Response:
{
  "success": true,
  "message": "Tasks retrieved",
  "data": {
    "tasks": [ ... ]
  }
}
```

---

## 🔑 Permission Management Endpoints (Super Admin Only)

### Get All Permissions
```
GET /api/permissions
Authorization: Bearer <accessToken>
Required Role: super_admin

Response:
{
  "success": true,
  "message": "Permissions retrieved",
  "data": {
    "permissions": [
      {
        "id": "permissionId",
        "name": "task:create",
        "resource": "task",
        "action": "create",
        "description": "...",
        "createdAt": "..."
      }
    ]
  }
}
```

### Get Permissions by Role
```
GET /api/permissions/role/:role
Authorization: Bearer <accessToken>
Required Role: super_admin
Role: super_admin | admin | user

Response:
{
  "success": true,
  "message": "Permissions retrieved",
  "data": {
    "permissions": [ ... ]
  }
}
```

### Get Permissions by User
```
GET /api/permissions/user/:userId
Authorization: Bearer <accessToken>
Required Role: super_admin

Response:
{
  "success": true,
  "message": "Permissions retrieved",
  "data": {
    "permissions": [
      {
        "id": "permissionId",
        "user": "userId",
        "permission": { id, name, ... },
        "type": "allow" | "deny",
        "grantedAt": "..."
      }
    ]
  }
}
```

### Grant Permission to User
```
POST /api/permissions/user
Authorization: Bearer <accessToken>
Content-Type: application/json
Required Role: super_admin

{
  "userId": "userId",
  "permissionName": "task:delete",
  "type": "allow"  // or "deny"
}

Response:
{
  "success": true,
  "message": "Permission granted to user"
}
```

### Grant Permission to Role
```
POST /api/permissions/role
Authorization: Bearer <accessToken>
Content-Type: application/json
Required Role: super_admin

{
  "role": "admin",  // or "user"
  "permissionName": "task:assign"
}

Response:
{
  "success": true,
  "message": "Permission granted to role"
}
```

### Revoke Permission from User
```
DELETE /api/permissions/user/:userId/:permissionId
Authorization: Bearer <accessToken>
Required Role: super_admin

Response:
{
  "success": true,
  "message": "Permission revoked from user"
}
```

### Revoke Permission from Role
```
DELETE /api/permissions/role/:role/:permissionId
Authorization: Bearer <accessToken>
Required Role: super_admin

Response:
{
  "success": true,
  "message": "Permission revoked from role"
}
```

---

## 🛡️ Default Roles & Permissions

### Roles
- **super_admin**: Full system control, all permissions
- **admin**: Manage users and tasks
- **user**: Work on assigned tasks

### Permissions
```
Task Permissions:
- task:create    (Create tasks)
- task:read      (View tasks)
- task:update    (Update tasks)
- task:delete    (Delete tasks)
- task:assign    (Assign tasks)

User Permissions:
- user:read      (View users)
- user:delete    (Delete users)
- user:promote   (Promote/change user roles)
- user:manage    (Full user management)
```

### Default Permission Assignments
```
super_admin → All permissions
admin → task:create, task:read, task:update, task:delete, task:assign, user:read
user → task:read, task:update
```

---

## ⚠️ Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

### Common Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

---

## 🔐 Permission Logic

The system checks permissions in the following order:

1. **Super Admin**: Grant all permissions immediately
2. **User Deny**: If user has explicit deny → Block access
3. **User Allow**: If user has explicit allow → Grant access
4. **Role Permissions**: Check role-based permissions
5. **Default**: If no match found → Deny access

---

## 🚀 Usage Examples

### Example 1: Register and Login
```bash
# Register first user (becomes super_admin)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "Admin123456"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123456"
  }'
```

### Example 2: Create Task as Admin
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <accessToken>" \
  -F "title=Website Redesign" \
  -F "description=Complete website redesign" \
  -F "assignedTo=<userId>" \
  -F "priority=high" \
  -F "image=@design.png"
```

### Example 3: Update Task Status as User
```bash
curl -X PUT http://localhost:5000/api/tasks/<taskId> \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress"
  }'
```

### Example 4: Promote User as Super Admin
```bash
curl -X PATCH http://localhost:5000/api/auth/users/promote/<userId> \
  -H "Authorization: Bearer <superAdminToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "newRole": "admin"
  }'
```
