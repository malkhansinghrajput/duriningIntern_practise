# 🚀 Quick Start Guide

Get your RBAC Task Management System running in **5 minutes**!

---

## Step 1: Setup Environment (1 min)

```bash
# Copy the environment template
cp .env.example .env

# Edit .env with your settings
# Minimum required:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task_management
```

---

## Step 2: Install Dependencies (1 min)

```bash
npm install
```

---

## Step 3: Start Server (1 min)

```bash
npm start
```

You should see:
```
✓ Created role: super_admin
✓ Created role: admin
✓ Created role: user
✓ Created permission: task:create
... (more permissions)
✓ Assigned all permissions to super_admin
✓ Database initialization completed
Server running on port 5000
```

---

## Step 4: Test with Your First Request (1 min)

### Register as Super Admin (First User)

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "Admin123456"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Registered as Super Admin",
  "data": {
    "user": {
      "id": "...",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "super_admin"
    }
  }
}
```

---

## Step 5: Login & Get Tokens (1 min)

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123456"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Save the `accessToken` for next requests!**

---

## Key Endpoints

### Without Authentication ✓
```bash
POST /api/auth/register      # Register user
POST /api/auth/login         # Login user
POST /api/auth/refresh       # Refresh token
GET  /api/health             # Health check
```

### With Authentication (Add `Authorization: Bearer <accessToken>`)

```bash
# Profile
POST /api/auth/logout        # Logout
GET  /api/auth/profile       # Your profile

# Tasks (All Users)
GET  /api/tasks/my-tasks     # Your assigned tasks
GET  /api/tasks/:id          # View task
PUT  /api/tasks/:id          # Update task (status)

# Tasks (Admin+)
POST /api/tasks              # Create task
DELETE /api/tasks/:id        # Delete task

# Tasks (Super Admin)
GET  /api/tasks              # All tasks
GET  /api/tasks/status/pending  # Filter by status

# Users (Admin+)
GET  /api/auth/users         # List users

# Users (Super Admin)
DELETE /api/auth/users/:id   # Delete user
PATCH /api/auth/users/promote/:id  # Change role

# Permissions (Super Admin)
GET  /api/permissions        # List permissions
POST /api/permissions/user   # Grant user permission
POST /api/permissions/role   # Grant role permission
```

---

## Common Tasks

### Register a Normal User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "John123456"
  }'
```

### Create a Task (as Admin)
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Website Redesign",
    "description": "Redesign the landing page",
    "assignedTo": "<userId>",
    "priority": "high",
    "dueDate": "2026-05-15"
  }'
```

### Update Task Status (as User)
```bash
curl -X PUT http://localhost:5000/api/tasks/<taskId> \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress"
  }'
```

### Promote User to Admin (as Super Admin)
```bash
curl -X PATCH http://localhost:5000/api/auth/users/promote/<userId> \
  -H "Authorization: Bearer <superAdminToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "newRole": "admin"
  }'
```

---

## Important Notes

⚠️ **First User Becomes Super Admin**
- The first registered user automatically becomes `super_admin`
- Subsequent users default to `user` role
- Cannot input role during registration (ignored)

⚠️ **Role Input Prevention**
```bash
# This role will be IGNORED:
POST /api/auth/register
{
  "name": "Test",
  "email": "test@example.com",
  "password": "Test123456",
  "role": "admin"  # ❌ This is ignored!
}
```

⚠️ **Token Expiration**
- Access Token: 15 minutes
- Refresh Token: 7 days
- Use refresh endpoint to get new access token

⚠️ **Permission Hierarchy**
```
super_admin        ← All permissions
    ↓
 admin             ← Task & user read permissions
    ↓
 user              ← Task read & update (own tasks only)
```

---

## Troubleshooting

### "MongoDB connection failed"
```bash
# Make sure MongoDB is running
mongod

# Or update MONGODB_URI in .env for MongoDB Atlas
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
```

### "Invalid token"
- Token may be expired
- Use `/api/auth/refresh` with refresh token

### "Permission denied"
- Check user's role with `/api/auth/profile`
- Promote user if needed

### "User not found"
- Ensure you're using the correct userId
- Check user exists with `/api/auth/users` (admin+)

---

## Project Structure at a Glance

```
project/
├── config/          Database and services
├── models/          Database schemas
├── daos/            Database operations
├── services/        Business logic
├── controllers/     Request handlers
├── middleware/      Auth & authorization
├── routes/          API endpoints
├── utils/           Helper functions
├── constants/       Enums & constants
├── response/        Response formatter
└── server.js        Entry point
```

---

## Default Roles & Their Permissions

### Super Admin ⭐⭐⭐
✅ All permissions
✅ Manage everything

### Admin ⭐⭐
✅ Create & manage tasks
✅ Assign tasks to users
✅ View user list
✅ View all tasks

### User ⭐
✅ View assigned tasks
✅ Update task status
✅ View profile

---

## Testing Checklist

- [ ] Register first user (becomes super_admin)
- [ ] Login and get tokens
- [ ] Get your profile
- [ ] Register another user (becomes user)
- [ ] Create task as admin
- [ ] View assigned tasks as user
- [ ] Update task status
- [ ] Promote user to admin
- [ ] Delete user as super_admin
- [ ] Refresh token

---

## Next Steps

1. **Read** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference
2. **Learn** [README.md](./README.md) for architecture details
3. **Explore** [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md) for all changes
4. **Test** all endpoints with curl or Postman
5. **Deploy** to your production environment

---

## Additional Resources

- [API Documentation](./API_DOCUMENTATION.md)
- [Full README](./README.md)
- [Refactoring Summary](./REFACTORING_SUMMARY.md)
- [.env Template](./.env.example)

---

## Support

If you encounter any issues:

1. Check [README.md](./README.md) - Troubleshooting section
2. Review [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Complete endpoint reference
3. Check environment variables in `.env`
4. Ensure MongoDB is running
5. Check server console for error messages

---

## 🎉 You're All Set!

Your production-ready RBAC Task Management System is ready to use!

**Happy Coding!** ✨
