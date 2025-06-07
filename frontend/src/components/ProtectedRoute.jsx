import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return <div>Loading authentication status...</div>; // Or a spinner
    }

    if (!isAuthenticated) {
        // Not logged in, redirect to login
        return <Navigate to="/login" replace />; // Or admin login page
    }

    if (user && user.role !== 'admin') {
        // Logged in but not an admin, redirect to a "not authorized" page or home
        // You might want to log them out or show a specific message
        console.warn("User is not an admin. Redirecting.");
        // For now, redirect to home page. Consider a dedicated 'Unauthorized' page.
        return <Navigate to="/" replace />;
    }

    // Authenticated and is an admin
    return <Outlet />;
};

export default ProtectedRoute;