import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import TasksPage from './pages/tasks/Tasks';
import UsersPage from './pages/users/Users';
import { useAuth } from './context/AuthContext';

const DashboardRouter = () => {
  const { user } = useAuth();

  // Route to appropriate dashboard based on role
  if (user?.role === 'super_admin' || user?.role === 'admin') {
    return <AdminDashboard />;
  }

  return <Dashboard />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <DashboardRouter />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <TasksPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute requiredRole={['admin', 'super_admin']}>
                <MainLayout>
                  <UsersPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
