import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid, FiUsers, FiShoppingBag, FiStar, FiLogOut,
  FiBarChart2, FiLock, FiHome, FiMenu, FiX
} from 'react-icons/fi';
import { useState } from 'react';
import toast from 'react-hot-toast';

const navItems = {
  admin: [
    { to: '/admin', label: 'Dashboard', icon: FiGrid, exact: true },
    { to: '/admin/users', label: 'Users', icon: FiUsers },
    { to: '/admin/stores', label: 'Stores', icon: FiShoppingBag },
    { to: '/admin/change-password', label: 'Security', icon: FiLock },
  ],
  user: [
    { to: '/user', label: 'Dashboard', icon: FiHome, exact: true },
    { to: '/user/stores', label: 'Browse Stores', icon: FiShoppingBag },
    { to: '/user/change-password', label: 'Security', icon: FiLock },
  ],
  store_owner: [
    { to: '/owner', label: 'Dashboard', icon: FiBarChart2, exact: true },
    { to: '/owner/change-password', label: 'Security', icon: FiLock },
  ],
};

const roleLabels = { admin: 'Administrator', user: 'Normal User', store_owner: 'Store Owner' };
const roleColors = {
  admin: 'bg-purple-100 text-purple-700',
  user: 'bg-blue-100 text-blue-700',
  store_owner: 'bg-emerald-100 text-emerald-700',
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const items = navItems[user?.role] || [];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-surface-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-sm">
            <FiStar className="text-white text-lg" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-lg leading-tight">RateStore</h1>
            <p className="text-xs text-slate-400">Platform</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 mx-3 mt-4 bg-surface-50 rounded-xl border border-surface-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 text-sm truncate">{user?.name?.split(' ')[0]}</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleColors[user?.role]}`}>
              {roleLabels[user?.role]}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-2">Menu</p>
        {items.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <Icon className="text-[18px] flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6">
        <button onClick={handleLogout} className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600">
          <FiLogOut className="text-[18px]" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-card rounded-xl p-2.5 border border-surface-100"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white shadow-card border-r border-surface-100 h-screen sticky top-0 flex-shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
