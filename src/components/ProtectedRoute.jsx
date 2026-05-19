import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ authentication = true }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (authentication && !isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (!authentication && isAuthenticated) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
