/**
 * ProtectedRoute — wraps routes that require authentication.
 *
 * Guests are redirected to /account (which renders the login/register form)
 * with a `?returnTo=<currentPath>` param so they land back here after auth.
 *
 * AdminRoute additionally enforces the `admin` role.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If true, only `admin` role users may access */
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  // While the auth session is being restored from localStorage, show a
  // full-page spinner so we don't flash the login form prematurely.
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-forme-terracotta" />
      </div>
    );
  }

  // Guest → redirect to account login, preserving the intended destination
  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/account?returnTo=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  }

  // Authenticated but not admin → redirect home for admin-only routes
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

/** Convenience alias for admin-only routes */
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requireAdmin>{children}</ProtectedRoute>
);
