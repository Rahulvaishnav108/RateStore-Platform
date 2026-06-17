import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiStar, FiArrowRight } from 'react-icons/fi';

const UserDashboard = () => {
  const { user } = useAuth();
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 mt-1">Discover and rate stores on the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/user/stores" className="card group hover:shadow-soft hover:border-primary-200 border border-surface-100 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center group-hover:bg-primary-600 transition-colors">
              <FiShoppingBag className="text-primary-600 group-hover:text-white text-2xl transition-colors" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 text-lg">Browse Stores</h3>
              <p className="text-slate-500 text-sm">Find and rate stores near you</p>
            </div>
            <FiArrowRight className="text-slate-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        <div className="card bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-400 rounded-2xl flex items-center justify-center">
              <FiStar className="text-white text-2xl" fill="currentColor" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Your Ratings</h3>
              <p className="text-slate-500 text-sm">Rate stores 1–5 stars and update anytime</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 card">
        <h3 className="font-semibold text-slate-800 mb-4">How it works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: '01', title: 'Browse Stores', desc: 'Find stores by name or address', emoji: '🔍' },
            { step: '02', title: 'Rate Stores', desc: 'Give a 1–5 star rating', emoji: '⭐' },
            { step: '03', title: 'Update Anytime', desc: 'Change your rating whenever you want', emoji: '✏️' },
          ].map(({ step, title, desc, emoji }) => (
            <div key={step} className="flex gap-4 p-4 bg-surface-50 rounded-xl">
              <span className="text-2xl">{emoji}</span>
              <div>
                <p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-1">{step}</p>
                <p className="font-semibold text-slate-800 text-sm">{title}</p>
                <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
