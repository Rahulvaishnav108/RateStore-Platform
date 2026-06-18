import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query-client';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import { AppShell } from './components/layout/AppShell';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ChangePassword from './pages/auth/ChangePassword';

import AdminDashboard from './pages/admin/AdminDashboard';
import Users from './pages/admin/Users';
import AdminStores from './pages/admin/AdminStores';

import UserDashboard from './pages/user/UserDashboard';
import StoreListing from './pages/user/StoreListing';

import OwnerDashboard from './pages/owner/OwnerDashboard';

const RoleRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const redirects = { admin: '/admin', user: '/user', store_owner: '/owner' };
  return <Navigate to={redirects[user.role as keyof typeof redirects] || '/login'} replace />;
};

const ProtectedLayout = ({ roles, children }: { roles?: Array<'admin' | 'user' | 'store_owner'>; children: ReactNode }) => (
  <ProtectedRoute roles={roles}>
    <AppShell>{children}</AppShell>
  </ProtectedRoute>
);

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/" element={<RoleRedirect />} />

    <Route path="/admin" element={<ProtectedLayout roles={['admin']}><AdminDashboard /></ProtectedLayout>} />
    <Route path="/admin/users" element={<ProtectedLayout roles={['admin']}><Users /></ProtectedLayout>} />
    <Route path="/admin/stores" element={<ProtectedLayout roles={['admin']}><AdminStores /></ProtectedLayout>} />
    <Route path="/admin/change-password" element={<ProtectedLayout roles={['admin']}><ChangePassword /></ProtectedLayout>} />

    <Route path="/user" element={<ProtectedLayout roles={['user']}><UserDashboard /></ProtectedLayout>} />
    <Route path="/user/stores" element={<ProtectedLayout roles={['user']}><StoreListing /></ProtectedLayout>} />
    <Route path="/user/change-password" element={<ProtectedLayout roles={['user']}><ChangePassword /></ProtectedLayout>} />

    <Route path="/owner" element={<ProtectedLayout roles={['store_owner']}><OwnerDashboard /></ProtectedLayout>} />
    <Route path="/owner/change-password" element={<ProtectedLayout roles={['store_owner']}><ChangePassword /></ProtectedLayout>} />

    <Route path="/unauthorized" element={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center card max-w-sm mx-4">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don't have permission to view this page.</p>
          <Link to="/" className="btn-primary inline-flex justify-center w-full">Go Home</Link>
        </div>
      </div>
    } />

    <Route path="*" element={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center card max-w-sm mx-4">
          <div className="text-5xl font-black text-primary/30 mb-4">404</div>
          <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
          <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
          <Link to="/" className="btn-primary inline-flex justify-center w-full">Go Home</Link>
        </div>
      </div>
    } />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
