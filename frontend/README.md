# React Frontend - Task Management System

A production-ready React.js frontend for RBAC-based Task & Team Management System.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Backend API running on `http://localhost:5000`

### Installation

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` if needed (default is `http://localhost:5000/api`)

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/           # Reusable common components
│   │   ├── layout/           # Sidebar, Navbar, MainLayout
│   │   └── ui/               # UI components
│   ├── pages/
│   │   ├── auth/            # Login, Register
│   │   ├── dashboard/       # Dashboard, AdminDashboard
│   │   ├── users/           # User Management
│   │   └── tasks/           # Task Management
│   ├── services/            # API services
│   │   ├── api.js           # Axios config
│   │   ├── auth.service.js  # Auth API calls
│   │   ├── user.service.js  # User API calls
│   │   └── task.service.js  # Task API calls
│   ├── context/             # Context API
│   │   └── AuthContext.jsx  # Auth state management
│   ├── routes/              # Protected routes
│   │   └── ProtectedRoute.jsx
│   ├── hooks/               # Custom hooks
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static files
├── index.html               # HTML template
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## 🔐 Authentication Flow

1. **Login/Register**
   - User submits credentials
   - Backend returns `accessToken` & `refreshToken`
   - Tokens stored in localStorage

2. **API Requests**
   - `accessToken` attached to every request header
   - On 401 error, `refreshToken` used to get new token
   - Automatic token refresh with Axios interceptors

3. **Logout**
   - Tokens cleared from localStorage
   - User redirected to login

---

## 🧠 RBAC Implementation

The app renders different UIs based on user role:

### Super Admin (`super_admin`)
- Full dashboard with all statistics
- Manage all users (create, delete, promote)
- Create & assign tasks
- View all tasks & permissions

### Admin (`admin`)
- Admin dashboard
- Manage regular users only
- Create & assign tasks
- View all team tasks

### User (`user`)
- Basic dashboard
- View assigned tasks only
- Update task status
- Cannot access user management

Protected routes are enforced via:
```jsx
<ProtectedRoute requiredRole={['admin', 'super_admin']}>
  <UsersPage />
</ProtectedRoute>
```

---

## 🎨 UI Features

### Components
- **Responsive Layout** - Mobile-first design
- **Sidebar Navigation** - Role-based menu items
- **Top Navbar** - Profile, notifications, search
- **Cards & Tables** - Tailwind styled components
- **Modal Forms** - Create/Edit dialogs
- **Toast Notifications** - Success/Error messages
- **Loading States** - Spinners & placeholders

### Tailwind CSS
- Custom colors & animations
- Responsive grid system
- Hover effects & transitions
- Dark mode ready

---

## 🔌 API Integration

### Axios Setup
- Base URL configured via `.env`
- Token interceptor for auth
- Error handling & retry logic
- Automatic token refresh on 401

### API Services
Each service module handles a specific resource:

**Auth Service** (`auth.service.js`)
- `register()` - Create account
- `login()` - Sign in
- `refresh()` - Refresh token
- `logout()` - Sign out

**User Service** (`user.service.js`)
- `getAllUsers()` - List users
- `deleteUser()` - Delete user
- `promoteUser()` - Change role
- `updateUser()` - Update info

**Task Service** (`task.service.js`)
- `getAllTasks()` - List tasks
- `createTask()` - Create task
- `updateTask()` - Update task
- `deleteTask()` - Delete task
- `updateTaskStatus()` - Change status

---

## 📝 Form Validation

Uses **React Hook Form** + **Yup** schema validation:

```jsx
const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

const { register, formState: { errors } } = useForm({
  resolver: yupResolver(schema),
});
```

---

## 🧪 Testing Demo Users

The login page shows demo credentials:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@task.com | Admin@123 |
| User | user@task.com | User@123 |

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy dist/ folder
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## 📚 Dependencies

### Core
- `react@18.2.0` - UI library
- `react-router-dom@6.22.0` - Routing
- `axios@1.6.5` - HTTP client

### Forms & Validation
- `react-hook-form@7.50.0` - Form management
- `yup@1.3.3` - Schema validation
- `@hookform/resolvers@3.3.4` - Form resolvers

### UI & Icons
- `tailwindcss@3.4.0` - CSS framework
- `lucide-react@0.294.0` - Icons
- `react-toastify@10.0.3` - Notifications

### State Management
- `zustand@4.4.1` - Optional state library

---

## 🐛 Troubleshooting

### CORS Issues
- Ensure backend has CORS enabled
- Check `VITE_API_BASE_URL` in `.env`

### 401 Unauthorized
- Token might be expired
- Check localStorage for tokens
- Interceptors should handle refresh

### Page Goes Blank
- Check browser console for errors
- Verify backend is running
- Clear localStorage and re-login

### Styles Not Loading
```bash
npm install -D tailwindcss autoprefixer postcss
npm run dev
```

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Commit changes: `git commit -m 'Add feature'`
3. Push to branch: `git push origin feature/name`
4. Open Pull Request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend API documentation
3. Create an issue on GitHub

---

**Built with ❤️ using React, Tailwind CSS & Vite**
