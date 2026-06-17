import { useState, useEffect } from 'react';
import { FiUsers, FiShoppingBag, FiStar, FiBarChart2, FiActivity } from 'react-icons/fi';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(r => {
      setStats(r.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { icon: FiUsers, label: 'Total Users', value: stats.totalUsers, color: 'blue' },
    { icon: FiBarChart2, label: 'Admins', value: stats.totalAdmins, color: 'purple' },
    { icon: FiShoppingBag, label: 'Total Stores', value: stats.totalStores, color: 'emerald' },
    { icon: FiStar, label: 'Total Ratings', value: stats.totalRatings, color: 'amber' },
    { icon: FiActivity, label: 'Platform Avg Rating', value: stats.avgRating ? `${stats.avgRating} ★` : '—', color: 'primary' },
  ] : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 mt-1">Here's what's happening on your platform today.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c, i) => <StatCard key={i} {...c} />)}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Add New User', desc: 'Create admin, user or store owner accounts', href: '/admin/users', color: 'bg-blue-50 text-blue-700' },
              { label: 'Add New Store', desc: 'Register a store on the platform', href: '/admin/stores', color: 'bg-emerald-50 text-emerald-700' },
            ].map(({ label, desc, href, color }) => (
              <a key={label} href={href}
                className="flex items-center gap-4 p-4 rounded-xl border border-surface-100 hover:border-primary-200 hover:bg-primary-50 transition-all group">
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform`}>+</div>
                <div>
                  <p className="font-medium text-slate-800">{label}</p>
                  <p className="text-sm text-slate-500">{desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">Platform Health</h3>
          {stats && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-600 font-medium">Average Platform Rating</span>
                  <span className="font-bold text-slate-800">{stats.avgRating ?? 0}/5</span>
                </div>
                <div className="h-2.5 bg-surface-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all duration-700" style={{ width: `${((stats.avgRating || 0) / 5) * 100}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="text-center p-3 bg-surface-50 rounded-xl">
                  <p className="text-lg font-bold text-slate-800">{stats.totalUsers}</p>
                  <p className="text-xs text-slate-500">Users</p>
                </div>
                <div className="text-center p-3 bg-surface-50 rounded-xl">
                  <p className="text-lg font-bold text-slate-800">{stats.totalStores}</p>
                  <p className="text-xs text-slate-500">Stores</p>
                </div>
                <div className="text-center p-3 bg-surface-50 rounded-xl">
                  <p className="text-lg font-bold text-slate-800">{stats.totalRatings}</p>
                  <p className="text-xs text-slate-500">Ratings</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
