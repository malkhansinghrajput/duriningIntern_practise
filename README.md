# RBAC Task & Team Management System

A production-ready Node.js + Express + MongoDB system with complete Role-Based Access Control (RBAC), task management, and team collaboration features.

## 🎯 Features

✅ **Role-Based Access Control (RBAC)**
- Three hierarchical roles: super_admin, admin, user
- Fine-grained permission system
- User-level and role-level permission overrides

✅ **Authentication & Security**
- JWT-based authentication (access + refresh tokens)
- Secure password hashing with bcrypt
- Protected routes with middleware
- Automatic session management

✅ **Task Management**
- Create, assign, and track tasks
- Multiple task statuses (pending, in_progress, completed)
- Priority levels (low, medium, high)
- Task assignment and tracking
- File upload support (Cloudinary integration)

✅ **User Management**
- User registration and login
- Auto-promotion of first user to super_admin
- Role management (promote/demote users)
- User account management
- Activity tracking

✅ **Permission System**
- Flexible permission model
- Role-based permissions
- User-specific permission overrides (allow/deny)
- Fine-grained control over resources and actions

✅ **Clean Architecture**
- Separation of concerns (Models, DAOs, Services, Controllers)
- Middleware layer for cross-cutting concerns
- Utility functions for reusable logic
- Centralized error handling

---

## 🏗️ Architecture Overview

```
project/
├── config/
│   ├── db.config.js          # Database connection
│   └── cloudinary.js         # File upload service
├── models/
│   ├── user.model.js
│   ├── role.model.js
│   ├── permission.model.js
│   ├── task.model.js
│   ├── rolePermission.model.js
│   └── userPermission.model.js
├── daos/
│   ├── user.daos.js
│   ├── role.dao.js
│   ├── permission.dao.js
│   └── task.dao.js
├── services/
│   ├── auth.service.js       # Business logic for auth
│   └── task.service.js       # Business logic for tasks
├── controllers/
│   ├── auth.controller.js    # Request handlers
│   ├── task.controller.js
│   └── permission.controller.js
├── middleware/
│   ├── auth.middleware.js    # JWT verification
│   ├── authorize.middleware.js # Permission checking
│   └── role.middleware.js    # Role validation
├── routes/
│   ├── auth.routes.js
│   ├── task.routes.js
│   └── permission.routes.js
├── utils/
│   ├── error.util.js         # Error handling
│   ├── jwt.util.js           # Token utilities
│   ├── bcrypt.util.js        # Password hashing
│   ├── validation.util.js    # Input validation
│   ├── permissionChecker.js  # Permission logic
│   └── db-init.util.js       # Database initialization
├── constants/
│   └── common.constant.js    # Constants and enums
├── response/
│   └── response.js           # Response formatting
├── server.js                 # Entry point
├── package.json
├── .env.example              # Environment template
├── API_DOCUMENTATION.md      # API docs
└── README.md                 # This file
```

---

## 🧱 Design Patterns

### Data Access Layer (DAO)
- Abstraction between services and models
- Single source of truth for database operations
- Easy to test and maintain

### Service Layer
- Business logic encapsulation
- Error handling and validation
- Reusable across controllers

### Middleware Pattern
- Request preprocessing (auth, validation)
- Cross-cutting concerns
- Chain of responsibility

### Centralized Error Handling
- Consistent error format
- Proper HTTP status codes
- Detailed error messages

---

## 🔐 Security Features

### Authentication
- **JWT Tokens**: Stateless authentication
- **Access + Refresh Tokens**: Better security with automatic refresh
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Secure Defaults**: All sensitive routes require authentication

### Authorization
- **Role-Based Access Control**: Easy role management
- **Permission-Based Control**: Granular access control
- **User Overrides**: Allow/deny permissions per user
- **Super Admin**: Full system access

### Password Security
- **Bcrypt Hashing**: Industry-standard password hashing
- **Salt Rounds**: 10 rounds of hashing
- **No Plain Text Storage**: Passwords never stored in plain text

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repo-url>
cd task1_refresh_token
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your values:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task_management
ACCESS_TOKEN_SECRET=your-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret-key
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (update MONGODB_URI in .env)
```

5. **Start the server**
```bash
npm start
```

The server will:
- Connect to MongoDB
- Initialize default roles and permissions
- Start listening on http://localhost:5000

---

## 📝 Default Roles & Permissions

### Roles
| Role | Description | First User |
|------|-------------|-----------|
| super_admin | Full system control | ✓ Yes |
| admin | Manage users and tasks | No |
| user | Work on assigned tasks | No |

### Permissions
```
Task Permissions:
├── task:create    - Create new tasks
├── task:read      - View tasks
├── task:update    - Update task details
├── task:delete    - Delete tasks
└── task:assign    - Assign tasks to users

User Permissions:
├── user:read      - View user list
├── user:delete    - Delete users
├── user:promote   - Change user roles
└── user:manage    - Full user management
```

### Default Assignments
```
super_admin → All permissions
admin → task:*, user:read
user → task:read, task:update (own tasks only)
```

---

## 🔄 Permission Logic Flow

```
Request → Protect Middleware → Extract User
                                    ↓
                            Check Route Permission
                                    ↓
                    ┌───────────────┼───────────────┐
                    ↓               ↓               ↓
            super_admin?      User Deny?      User Allow?
                ✓                 ✓                ✓
              Allow          → Block         → Allow
                                    ↓
                            Check Role Permissions
                                    ↓
                            ┌────────┴────────┐
                            ↓                 ↓
                        Match?            No Match
                        ✓                    ✓
                      Allow              Block
```

---

## 📚 Key Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile

### Users (Admin+)
- `GET /api/auth/users` - List all users
- `DELETE /api/auth/users/:id` - Delete user
- `PATCH /api/auth/users/promote/:id` - Change user role

### Tasks
- `POST /api/tasks` - Create task (Admin+)
- `GET /api/tasks/my-tasks` - Get assigned tasks
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (Admin+)

### Permissions (Super Admin)
- `GET /api/permissions` - List permissions
- `POST /api/permissions/user` - Grant user permission
- `POST /api/permissions/role` - Grant role permission
- `DELETE /api/permissions/user/:id/:permId` - Revoke user permission

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

---

## 🔒 Security Best Practices Implemented

✅ **Input Validation**: All inputs validated before processing
✅ **Error Handling**: Centralized error handler prevents info leakage
✅ **SQL Injection Prevention**: Using MongoDB (not vulnerable to SQL injection)
✅ **XSS Prevention**: HTTP-Only cookies, input sanitization
✅ **CSRF Protection**: Implement with additional middleware if needed
✅ **Rate Limiting**: Recommended to add rate limiting middleware
✅ **HTTPS**: Use HTTPS in production
✅ **Environment Variables**: Never commit secrets
✅ **Password Hashing**: Bcrypt with 10 salt rounds
✅ **Token Expiration**: Short-lived access tokens with refresh tokens

---

## 🧪 Testing Examples

### Test with cURL

```bash
# 1. Register first user (becomes super_admin)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@test.com",
    "password": "Admin123456"
  }'

# 2. Login to get tokens
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Admin123456"
  }' -c cookies.txt

# 3. Create a task
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Design Landing Page",
    "description": "Create modern landing page",
    "assignedTo": "<userId>",
    "priority": "high"
  }'

# 4. Get your assigned tasks
curl -X GET http://localhost:5000/api/tasks/my-tasks \
  -H "Authorization: Bearer <accessToken>"
```

---

## 📋 Request/Response Examples

### Register Response
```json
{
  "success": true,
  "message": "Registered as Super Admin",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Admin",
      "email": "admin@test.com",
      "role": "super_admin"
    }
  }
}
```

### Task Response
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "id": "507f1f77bcf86cd799439012",
      "title": "Design Landing Page",
      "status": "pending",
      "priority": "high",
      "assignedTo": {
        "id": "507f1f77bcf86cd799439013",
        "name": "John Doe",
        "email": "john@test.com"
      },
      "assignedBy": {
        "id": "507f1f77bcf86cd799439011",
        "name": "Admin",
        "email": "admin@test.com"
      },
      "createdAt": "2026-05-02T10:30:00Z",
      "updatedAt": "2026-05-02T10:30:00Z"
    }
  }
}
```

---

## 🔧 Environment Configuration

### Required Variables
```
PORT                    # Server port
MONGODB_URI             # Database connection string
ACCESS_TOKEN_SECRET     # JWT access token secret
REFRESH_TOKEN_SECRET    # JWT refresh token secret
CLOUDINARY_NAME         # Cloudinary account name
CLOUDINARY_API_KEY      # Cloudinary API key
CLOUDINARY_API_SECRET   # Cloudinary API secret
```

### Optional Variables
```
NODE_ENV                # development|production
ACCESS_TOKEN_EXPIRY     # Default: 15m
REFRESH_TOKEN_EXPIRY    # Default: 7d
```

---

## 🐛 Troubleshooting

### "Cannot find module"
```bash
npm install
```

### "Connection refused" (MongoDB)
- Ensure MongoDB is running
- Check MONGODB_URI in .env

### "Invalid token"
- Token may be expired, use refresh endpoint
- Check token secret matches in .env

### "Permission denied"
- Ensure user has required role
- Check role assignments

---

## 📈 Future Enhancements

- [ ] Rate limiting middleware
- [ ] Request logging system
- [ ] Audit trail for actions
- [ ] Email notifications
- [ ] Task comments and collaboration
- [ ] Team management
- [ ] Activity dashboard
- [ ] Advanced filtering and search
- [ ] Webhook integration
- [ ] API rate limiting
- [ ] Two-factor authentication
- [ ] OAuth integration

---

## 📄 License

ISC

---

## 👨‍💼 Support

For issues or questions, please refer to [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) or create an issue in the repository.

---

## ✨ Key Takeaways

1. **Clean Architecture**: Clear separation of concerns with models, DAOs, services, and controllers
2. **Security First**: JWT tokens, password hashing, permission-based access control
3. **Scalability**: Modular design that's easy to extend
4. **Maintainability**: Consistent patterns and centralized error handling
5. **Production Ready**: Environment configuration, error handling, input validation
6. **RBAC System**: Flexible and powerful role and permission management
7. **Task Management**: Complete task lifecycle with assignment tracking
8. **User Management**: Role-based user management with promotion capabilities

---

Last Updated: May 2, 2026
