# Quick Setup Guide - Task Management Frontend

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

This installs all required packages (React, Vite, Tailwind, Axios, etc.)

---

### Step 2: Verify Environment Configuration
```bash
# Check that .env file exists
cat .env
```

Should show:
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Task Management System
VITE_APP_VERSION=1.0.0
```

---

### Step 3: Start the Development Server
```bash
npm run dev
```

✅ **App will open automatically at `http://localhost:3000`**

---

## 📋 Checklist Before Running

- [ ] Node.js v16+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Backend running on `http://localhost:5000`
- [ ] `.env` file exists with correct API URL
- [ ] No other app running on port 3000

---

## 🔓 Demo Login Credentials

The login page displays these demo accounts:

**Super Admin (Full Access)**
- Email: `admin@task.com`
- Password: `Admin@123`

**Regular User (Limited Access)**
- Email: `user@task.com`
- Password: `User@123`

> These are created automatically by the backend on first run

---

## 🗂️ What Was Created

### Configuration Files
- ✅ `package.json` - Dependencies & scripts
- ✅ `vite.config.js` - Vite bundler config
- ✅ `tailwind.config.js` - Tailwind CSS config
- ✅ `postcss.config.js` - PostCSS config
- ✅ `.env` - Environment variables
- ✅ `index.html` - HTML template

### Core Application
- ✅ `src/App.jsx` - Main app with routing
- ✅ `src/main.jsx` - Entry point
- ✅ `src/index.css` - Global styles

### Authentication
- ✅ `src/context/AuthContext.jsx` - Auth state management
- ✅ `src/pages/auth/Login.jsx` - Login page
- ✅ `src/pages/auth/Register.jsx` - Registration page

### Dashboards
- ✅ `src/pages/dashboard/Dashboard.jsx` - User dashboard
- ✅ `src/pages/dashboard/AdminDashboard.jsx` - Admin dashboard

### Pages
- ✅ `src/pages/tasks/Tasks.jsx` - Task management
- ✅ `src/pages/users/Users.jsx` - User management

### Layout
- ✅ `src/components/layout/MainLayout.jsx` - Main layout wrapper
- ✅ `src/components/layout/Sidebar.jsx` - Navigation sidebar
- ✅ `src/components/layout/Navbar.jsx` - Top navigation bar

### Services
- ✅ `src/services/api.js` - Axios configuration
- ✅ `src/services/auth.service.js` - Auth API calls
- ✅ `src/services/user.service.js` - User API calls
- ✅ `src/services/task.service.js` - Task API calls

### Routes
- ✅ `src/routes/ProtectedRoute.jsx` - Route protection with RBAC

### Documentation
- ✅ `README.md` - Project overview
- ✅ `IMPLEMENTATION_GUIDE.md` - Detailed file documentation

---

## 🎯 Feature Overview

### ✅ Implemented Features

#### Authentication
- [x] Login with JWT tokens
- [x] Register new users
- [x] Auto token refresh on 401
- [x] Logout functionality
- [x] Persistent session (localStorage)

#### Role-Based Access Control
- [x] Super Admin role
- [x] Admin role
- [x] User role
- [x] Role-based route protection
- [x] Role-based UI rendering
- [x] Role-based menu items

#### Dashboards
- [x] Admin dashboard with statistics
- [x] User dashboard with my tasks
- [x] Recent tasks display
- [x] Recent users display
- [x] Completion rate progress

#### Task Management
- [x] View all tasks (admin)
- [x] View assigned tasks (user)
- [x] Create new tasks
- [x] Edit tasks
- [x] Delete tasks
- [x] Update task status
- [x] Filter by status
- [x] Search tasks

#### User Management
- [x] View all users
- [x] Create users (via registration)
- [x] Delete users (super_admin)
- [x] Promote users to admin/super_admin
- [x] Search users
- [x] User statistics

#### UI/UX
- [x] Responsive design (mobile, tablet, desktop)
- [x] Modern Tailwind CSS styling
- [x] Toast notifications
- [x] Loading states
- [x] Error handling
- [x] Form validation
- [x] Mobile-friendly sidebar
- [x] Icon-rich interface

#### API Integration
- [x] Axios configuration
- [x] Token interceptors
- [x] Error handling
- [x] API service layer
- [x] Environment configuration

---

## 📁 Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/         (Empty - for future components)
│   │   ├── layout/         (Sidebar, Navbar, MainLayout)
│   │   └── ui/             (Empty - for future UI components)
│   ├── pages/
│   │   ├── auth/           (Login, Register)
│   │   ├── dashboard/      (Dashboard, AdminDashboard)
│   │   ├── users/          (Users management page)
│   │   └── tasks/          (Tasks management page)
│   ├── services/           (API service modules)
│   ├── context/            (AuthContext for state)
│   ├── routes/             (ProtectedRoute wrapper)
│   ├── hooks/              (Empty - for custom hooks)
│   ├── utils/              (Empty - for utilities)
│   ├── App.jsx             (Main app & routing)
│   ├── main.jsx            (Entry point)
│   └── index.css           (Global styles)
├── public/                 (Static files)
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## 🔌 API Endpoints Used

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users` - List all users
- `DELETE /api/users/:id` - Delete user
- `PATCH /api/users/:id` - Update user/promote

### Tasks
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id` - Update task status

---

## 🎨 Color Scheme & Theme

### Primary Colors
- **Blue** (#3b82f6) - Primary actions, buttons
- **Green** (#10b981) - Success, completed tasks
- **Red** (#ef4444) - Danger, delete actions
- **Orange** (#f59e0b) - Warning, in-progress

### Component Colors
- **Cards** - White background, gray borders
- **Buttons** - Blue primary, gray secondary, red danger
- **Badges** - Color-coded by status/priority
- **Background** - Light gray (#f9fafb)

---

## 🚀 Available Commands

```bash
# Start development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install dependencies
npm install

# Install new package
npm install package-name

# Uninstall package
npm uninstall package-name
```

---

## 🔧 Environment Variables

Edit `frontend/.env` to configure:

```env
# API Base URL (must match backend)
VITE_API_BASE_URL=http://localhost:5000/api

# App information (optional)
VITE_APP_NAME=Task Management System
VITE_APP_VERSION=1.0.0
```

---

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# Use different port
npm run dev -- --port 3001
```

### CORS errors when calling API
- Ensure backend has CORS enabled
- Check `VITE_API_BASE_URL` matches backend URL
- Restart both frontend and backend

### Dependencies not installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Blank page or build errors
```bash
# Clear cache and rebuild
rm -rf dist .vite

# Restart dev server
npm run dev
```

---

## 📊 Production Build

```bash
# Create optimized production build
npm run build

# Output in dist/ folder
# Deploy dist/ folder to hosting (Vercel, Netlify, etc.)
```

---

## 🎓 Key Concepts

### AuthContext
Global state management for:
- Current user information
- Access token & refresh token
- Authentication status
- Login/logout/register functions

### Protected Routes
Wrapper component that:
- Checks if user is logged in
- Redirects to `/login` if not authenticated
- Checks user role for specific pages
- Shows loading state while checking auth

### API Services
Modules for specific resources:
- `auth.service.js` - Authentication endpoints
- `user.service.js` - User management endpoints
- `task.service.js` - Task management endpoints

### Interceptors
Axios middleware that:
- Adds auth token to all requests
- Handles 401 errors
- Auto-refreshes expired tokens
- Clears session on refresh failure

---

## ✅ Verification Checklist

After starting the app, verify:

- [ ] App opens on `http://localhost:3000`
- [ ] Login page displays with form fields
- [ ] Can login with demo credentials
- [ ] Dashboard displays with correct content
- [ ] Sidebar shows role-based menu items
- [ ] Can navigate to Tasks page
- [ ] Can navigate to Users page (if admin)
- [ ] Notifications appear for actions
- [ ] Responsive on mobile view
- [ ] Logout works and redirects to login

---

## 📞 Need Help?

1. **Check the IMPLEMENTATION_GUIDE.md** - Detailed file documentation
2. **Check README.md** - Project overview and setup
3. **Check browser console** - For JavaScript errors
4. **Check network tab** - For API call issues
5. **Restart dev server** - Often fixes cache issues

---

**🎉 You're all set! Start building amazing features!**
