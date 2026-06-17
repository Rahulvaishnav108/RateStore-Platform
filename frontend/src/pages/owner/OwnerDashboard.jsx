import { useState, useEffect } from 'react';
import { FiUsers, FiBarChart2, FiTrendingUp, FiStar, FiMail, FiMapPin, FiCalendar } from 'react-icons/fi';
import api from '../../services/api';
import StarRating from '../../components/StarRating';
import toast from 'react-hot-toast';

/* ── Rating distribution bar ── */
const RatingBar = ({ star, count, total }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const colors = {
    5: { bar: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    4: { bar: 'bg-blue-500',    bg: 'bg-blue-50',    text: 'text-blue-700' },
    3: { bar: 'bg-amber-500',   bg: 'bg-amber-50',   text: 'text-amber-700' },
    2: { bar: 'bg-orange-500',  bg: 'bg-orange-50',  text: 'text-orange-700' },
    1: { bar: 'bg-red-500',     bg: 'bg-red-50',     text: 'text-red-700' },
  };
  const c = colors[star];
  return (
    <div className="flex items-center gap-3">
      <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${c.bg} flex-shrink-0`}>
        <span className={`text-xs font-bold ${c.text}`}>{star}★</span>
      </div>
      <div className="flex-1 h-2.5 bg-surface-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${c.bar} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center gap-1.5 w-16 flex-shrink-0 justify-end">
        <span className="text-sm font-semibold text-slate-700">{count}</span>
        <span className="text-xs text-slate-400">({pct}%)</span>
      </div>
    </div>
  );
};

/* ── Score Indicator Ring ── */
const ScoreRing = ({ score, max = 5 }) => {
  const pct = ((score || 0) / max) * 100;
  const color = score >= 4 ? '#10b981' : score >= 3 ? '#f59e0b' : '#ef4444';
  const r = 40, circ = 2 * Math.PI * r;
  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="112" height="112">
        <circle cx="56" cy="56" r={r} fill="none" stroke="#f1f5f9" strokeWidth="8" />
        <circle cx="56" cy="56" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="text-center">
        <p className="text-2xl font-black text-slate-800">{score || '—'}</p>
        <p className="text-xs text-slate-400">out of 5</p>
      </div>
    </div>
  );
};

const OwnerDashboard = () => {
  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/owner/dashboard')
      .then(r => { setData(r.data.data); setLoading(false); })
      .catch(err => {
        toast.error(err.response?.data?.message || 'Failed to load dashboard.');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-36 rounded-2xl" />)}
    </div>
  );

  if (!data) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="card text-center py-16 max-w-sm mx-auto">
        <div className="text-6xl mb-4">🏪</div>
        <h3 className="text-lg font-semibold text-slate-700">No Store Assigned</h3>
        <p className="text-slate-500 mt-2 text-sm">Contact the administrator to link your account to a store.</p>
      </div>
    </div>
  );

  const { store, avg_rating, total_ratings, distribution, raters } = data;
  const positive = (distribution[5] || 0) + (distribution[4] || 0);
  const positivePct = total_ratings > 0 ? Math.round((positive / total_ratings) * 100) : 0;

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Store Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Analytics and customer ratings for your store</p>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-indigo-600 rounded-2xl p-6 mb-6 text-white shadow-lg overflow-hidden relative">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute right-16 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex-1 min-w-0">
            <p className="text-primary-200 text-xs font-semibold uppercase tracking-wider mb-2">Your Store</p>
            <h2 className="text-2xl font-bold leading-tight truncate">{store.name}</h2>
            <div className="flex flex-col gap-1 mt-3">
              <p className="text-primary-200 text-sm flex items-center gap-2">
                <FiMapPin size={13} /> {store.address}
              </p>
              <p className="text-primary-200 text-sm flex items-center gap-2">
                <FiMail size={13} /> {store.email}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 text-center">
            <ScoreRing score={avg_rating} />
            <div className="mt-2">
              <StarRating value={Math.round(avg_rating)} readonly size="sm" />
              <p className="text-primary-200 text-xs mt-1">{total_ratings} ratings total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Average Rating', value: avg_rating ? `${avg_rating} / 5` : '—', icon: FiStar, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Total Ratings', value: total_ratings, icon: FiBarChart2, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: '5-Star Reviews', value: distribution[5] || 0, icon: FiTrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Positive Rate', value: `${positivePct}%`, icon: FiUsers, color: 'text-purple-500', bg: 'bg-purple-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card flex items-center gap-3">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Icon className={`${color} text-lg`} />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-bold text-slate-800 leading-tight">{value}</p>
              <p className="text-xs text-slate-500 leading-tight">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Distribution + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Rating Distribution */}
        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FiBarChart2 className="text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Rating Distribution</h3>
              <p className="text-xs text-slate-400">Breakdown by star count</p>
            </div>
          </div>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map(star => (
              <RatingBar key={star} star={star} count={distribution[star] || 0} total={total_ratings} />
            ))}
          </div>
          {total_ratings === 0 && (
            <p className="text-center text-slate-400 text-sm mt-4">No ratings yet</p>
          )}
        </div>

        {/* Insights Panel */}
        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FiTrendingUp className="text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Insights</h3>
              <p className="text-xs text-slate-400">Performance summary</p>
            </div>
          </div>
          <div className="space-y-1">
            {[
              {
                label: '⭐ Average Score',
                value: avg_rating ? `${avg_rating} / 5.0` : 'No ratings',
                cls: avg_rating >= 4 ? 'text-emerald-600 font-bold' : avg_rating >= 3 ? 'text-amber-600 font-bold' : 'text-red-500 font-bold',
              },
              { label: '👥 Total Customers', value: `${total_ratings} customer${total_ratings !== 1 ? 's' : ''}` },
              { label: '🏆 Five-Star Reviews', value: `${distribution[5] || 0} reviews` },
              { label: '👍 Positive (4–5 ★)', value: `${positive} reviews (${positivePct}%)` },
              { label: '👎 Critical (1–2 ★)', value: `${(distribution[1] || 0) + (distribution[2] || 0)} reviews` },
              {
                label: '📊 Rating Spread',
                value: total_ratings > 0
                  ? (() => {
                      const active = Object.entries(distribution).filter(([, v]) => v > 0).map(([k]) => Number(k));
                      return active.length ? `${Math.min(...active)}★ – ${Math.max(...active)}★` : '—';
                    })()
                  : '—',
              },
            ].map(({ label, value, cls }) => (
              <div key={label} className="flex justify-between items-center py-2.5 border-b border-surface-50 last:border-0">
                <span className="text-sm text-slate-500">{label}</span>
                <span className={`text-sm ${cls || 'text-slate-800 font-medium'}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Raters Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FiUsers className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Customer Ratings</h3>
              <p className="text-xs text-slate-400">All customers who rated your store</p>
            </div>
          </div>
          <span className="text-xs font-semibold bg-surface-100 text-slate-600 px-2.5 py-1 rounded-full">
            {raters.length} customer{raters.length !== 1 ? 's' : ''}
          </span>
        </div>

        {raters.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <div className="text-4xl mb-3">⭐</div>
            <p className="font-medium text-slate-500">No ratings yet</p>
            <p className="text-sm mt-1">Share your store to get your first rating</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-surface-100">
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Rating</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {raters.map(r => (
                  <tr key={r.id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {r.name[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-800 truncate max-w-[120px]">{r.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-xs">{r.email}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <StarRating value={r.rating} readonly size="sm" />
                        <span className="text-xs font-semibold text-slate-600">{r.rating}/5</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <FiCalendar size={11} />
                        {new Date(r.updated_at).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
