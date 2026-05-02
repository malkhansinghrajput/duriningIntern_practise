import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { UserPlus } from 'lucide-react';

const registerSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await registerUser(data.name, data.email, data.password);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-white rounded-lg">
              <UserPlus size={32} className="text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-blue-100">Join our task management platform</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                {...register('name')}
                className="input-field"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="error-text">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                {...register('email')}
                className="input-field"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="error-text">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                {...register('password')}
                className="input-field"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="error-text">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                {...register('confirmPassword')}
                className="input-field"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="error-text">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms & Conditions */}
            <label className="flex items-start">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded mt-1"
                required
              />
              <span className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Terms & Conditions
                </a>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-2.5 flex items-center justify-center mt-5"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin mr-2">
                    <UserPlus size={18} />
                  </div>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-600 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-blue-100 text-sm mt-8">
          © 2024 Task Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Register;
