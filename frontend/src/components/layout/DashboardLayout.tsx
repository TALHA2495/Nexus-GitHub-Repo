import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const DashboardLayout: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;

    // Connect to socket server
    const socket = io('http://localhost:5000');

    // Register user with their socket
    socket.emit('register-user', user.id);

    // Listen for new meeting requests
    socket.on('new-meeting-request', (meetingData) => {
      toast.success(
        `New meeting request from ${meetingData.entrepreneur?.name || 'an entrepreneur'}!`,
        { duration: 5000 }
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect /dashboard to role-specific dashboard
  if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
    return <Navigate to={user?.role === 'investor' ? '/dashboard/investor' : '/dashboard/entrepreneur'} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-right" />
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};