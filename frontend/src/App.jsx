import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

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
  return <Navigate to={redirects[user.role] || '/login'} replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/" element={<RoleRedirect />} />

    <Route path="/admin" element={<ProtectedRoute roles={['admin']}><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
    <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><Layout><Users /></Layout></ProtectedRoute>} />
    <Route path="/admin/stores" element={<ProtectedRoute roles={['admin']}><Layout><AdminStores /></Layout></ProtectedRoute>} />
    <Route path="/admin/change-password" element={<ProtectedRoute roles={['admin']}><Layout><ChangePassword /></Layout></ProtectedRoute>} />

    <Route path="/user" element={<ProtectedRoute roles={['user']}><Layout><UserDashboard /></Layout></ProtectedRoute>} />
    <Route path="/user/stores" element={<ProtectedRoute roles={['user']}><Layout><StoreListing /></Layout></ProtectedRoute>} />
    <Route path="/user/change-password" element={<ProtectedRoute roles={['user']}><Layout><ChangePassword /></Layout></ProtectedRoute>} />

    <Route path="/owner" element={<ProtectedRoute roles={['store_owner']}><Layout><OwnerDashboard /></Layout></ProtectedRoute>} />
    <Route path="/owner/change-password" element={<ProtectedRoute roles={['store_owner']}><Layout><ChangePassword /></Layout></ProtectedRoute>} />

    <Route path="/unauthorized" element={
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="text-center card max-w-sm mx-4">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h1>
          <p className="text-slate-500 mb-6">You don't have permission to view this page.</p>
          <a href="/" className="btn-primary inline-flex justify-center w-full">Go Home</a>
        </div>
      </div>
    } />

    <Route path="*" element={
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="text-center card max-w-sm mx-4">
          <div className="text-5xl font-black text-primary-200 mb-4">404</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h1>
          <p className="text-slate-500 mb-6">The page you're looking for doesn't exist.</p>
          <a href="/" className="btn-primary inline-flex justify-center w-full">Go Home</a>
        </div>
      </div>
    } />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '12px',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
