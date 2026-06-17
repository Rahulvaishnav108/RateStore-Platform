import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiSearch, FiX } from 'react-icons/fi';
import api from '../../services/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import StarRating from '../../components/StarRating';
import { useDebounce } from '../../hooks/useDebounce';
import toast from 'react-hot-toast';

const INITIAL_FORM = { name: '', email: '', password: '', address: '', role: 'user' };

const validate = (form) => {
  const errs = {};
  if (form.name.trim().length < 20 || form.name.trim().length > 60)
    errs.name = 'Name must be 20–60 characters.';
  if (!/\S+@\S+\.\S+/.test(form.email))
    errs.email = 'Enter a valid email.';
  if (form.password.length < 8 || form.password.length > 16)
    errs.password = 'Password must be 8–16 characters.';
  else if (!/[A-Z]/.test(form.password))
    errs.password = 'Must include at least one uppercase letter.';
  else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password))
    errs.password = 'Must include at least one special character.';
  if (form.address && form.address.length > 400)
    errs.address = 'Address max 400 characters.';
  return errs;
};

const AddUserModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await api.post('/admin/users', form);
      toast.success('User created successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create user.';
      toast.error(msg);
      if (err.response?.data?.errors) {
        const fe = {};
        err.response.data.errors.forEach(e => { fe[e.field] = e.message; });
        setErrors(fe);
      }
    } finally { setLoading(false); }
  };

  return (
    <Modal title="Add New User" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-slate-700">Full Name *</label>
            <span className={`text-xs ${form.name.length < 20 ? 'text-red-400' : 'text-slate-400'}`}>{form.name.length}/60</span>
          </div>
          <input
            value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="Minimum 20 characters required"
            className={`input-field ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
            required
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Email Address *</label>
          <input
            type="email" value={form.email} onChange={e => set('email', e.target.value)}
            placeholder="user@example.com"
            className={`input-field ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
            required
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Password *</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={form.password} onChange={e => set('password', e.target.value)}
              placeholder="8–16 chars, 1 uppercase, 1 special"
              className={`input-field pr-20 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
              required
            />
            <button type="button" onClick={() => setShowPass(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary-600 font-medium">
              {showPass ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-slate-700">Address</label>
            <span className="text-xs text-slate-400">{form.address.length}/400</span>
          </div>
          <input
            value={form.address} onChange={e => set('address', e.target.value)}
            placeholder="City, State, PIN"
            className={`input-field ${errors.address ? 'border-red-400 focus:ring-red-400' : ''}`}
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Role *</label>
          <select value={form.role} onChange={e => set('role', e.target.value)} className="input-field">
            <option value="user">Normal User</option>
            <option value="admin">Administrator</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading
              ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating...</span>
              : 'Create User'
            }
          </button>
        </div>
      </form>
    </Modal>
  );
};

const Users = () => {
  const [data, setData]           = useState([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters]     = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy]       = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const limit = 10;

  const debouncedFilters = useDebounce(filters, 400);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const clean = Object.fromEntries(Object.entries(debouncedFilters).filter(([, v]) => v));
      const { data: res } = await api.get('/admin/users', {
        params: { page, limit, sortBy, sortOrder, ...clean },
      });
      setData(res.data);
      setTotal(res.pagination.total);
    } catch {
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy, sortOrder, debouncedFilters]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSort = (field) => {
    if (sortBy === field) setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortOrder('asc'); }
    setPage(1);
  };

  const setFilter = (key, val) => {
    setFilters(f => ({ ...f, [key]: val }));
    setPage(1);
  };

  const hasFilters = Object.values(filters).some(Boolean);

  const columns = [
    {
      key: 'name', label: 'Name', sortable: true,
      render: row => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {row.name?.[0]?.toUpperCase()}
          </div>
          <span className="font-medium text-slate-800 truncate max-w-[180px]">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'email', label: 'Email', sortable: true,
      render: row => <span className="text-slate-600 text-sm">{row.email}</span>,
    },
    {
      key: 'address', label: 'Address', sortable: true,
      render: row => <span className="text-slate-500 text-sm truncate max-w-[160px] block">{row.address || '—'}</span>,
    },
    {
      key: 'role', label: 'Role', sortable: true,
      render: row => <Badge variant={row.role}>{row.role}</Badge>,
    },
    {
      key: 'avg_rating', label: 'Store Rating',
      render: row => row.avg_rating
        ? <div className="flex items-center gap-1.5"><StarRating value={Math.round(row.avg_rating)} readonly size="sm" /><span className="text-xs text-slate-500">{row.avg_rating}</span></div>
        : <span className="text-slate-300 text-sm">—</span>,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Users</h1>
          <p className="text-slate-500 text-sm mt-0.5">{total} total users registered</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <FiPlus /> Add User
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { key: 'name',    placeholder: 'Search by name…' },
            { key: 'email',   placeholder: 'Search by email…' },
            { key: 'address', placeholder: 'Search by address…' },
          ].map(({ key, placeholder }) => (
            <div key={key} className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                value={filters[key]}
                onChange={e => setFilter(key, e.target.value)}
                placeholder={placeholder}
                className="input-field pl-9 py-2.5 text-sm"
              />
            </div>
          ))}
          <select value={filters.role} onChange={e => setFilter('role', e.target.value)} className="input-field py-2.5 text-sm">
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>
        {hasFilters && (
          <button
            onClick={() => { setFilters({ name: '', email: '', address: '', role: '' }); setPage(1); }}
            className="mt-3 text-xs text-slate-500 hover:text-primary-600 flex items-center gap-1 transition-colors"
          >
            <FiX size={12} /> Clear all filters
          </button>
        )}
      </div>

      <div className="card">
        <DataTable
          columns={columns} data={data} loading={loading}
          total={total} page={page} limit={limit} onPageChange={setPage}
          sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}
          emptyMessage="No users found matching your search"
        />
      </div>

      {showModal && <AddUserModal onClose={() => setShowModal(false)} onSuccess={fetchUsers} />}
    </div>
  );
};

export default Users;
