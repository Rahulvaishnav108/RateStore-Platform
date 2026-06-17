import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiSearch, FiX } from 'react-icons/fi';
import api from '../../services/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import StarRating from '../../components/StarRating';
import { useDebounce } from '../../hooks/useDebounce';
import toast from 'react-hot-toast';

const validate = (form) => {
  const errs = {};
  if (form.name.trim().length < 20 || form.name.trim().length > 60)
    errs.name = 'Store name must be 20–60 characters.';
  if (!/\S+@\S+\.\S+/.test(form.email))
    errs.email = 'Enter a valid email.';
  if (form.address && form.address.length > 400)
    errs.address = 'Address max 400 characters.';
  return errs;
};

const AddStoreModal = ({ onClose, onSuccess }) => {
  const [form, setForm]     = useState({ name: '', email: '', address: '', owner_id: '' });
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  useEffect(() => {
    api.get('/admin/users', { params: { role: 'store_owner', limit: 100 } })
      .then(r => setOwners(r.data.data || []))
      .catch(() => {});
  }, []);

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
      await api.post('/admin/stores', {
        ...form,
        owner_id: form.owner_id || undefined,
      });
      toast.success('Store created successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create store.');
    } finally { setLoading(false); }
  };

  return (
    <Modal title="Add New Store" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-slate-700">Store Name *</label>
            <span className={`text-xs ${form.name.length < 20 ? 'text-red-400' : 'text-slate-400'}`}>{form.name.length}/60</span>
          </div>
          <input value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="Minimum 20 characters"
            className={`input-field ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`} required />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Store Email *</label>
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
            placeholder="store@example.com"
            className={`input-field ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`} required />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-slate-700">Address</label>
            <span className="text-xs text-slate-400">{form.address.length}/400</span>
          </div>
          <input value={form.address} onChange={e => set('address', e.target.value)}
            placeholder="Store address, city"
            className={`input-field ${errors.address ? 'border-red-400 focus:ring-red-400' : ''}`} />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Assign Owner (optional)</label>
          <select value={form.owner_id} onChange={e => set('owner_id', e.target.value)} className="input-field">
            <option value="">— No owner yet —</option>
            {owners.map(o => (
              <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
            ))}
          </select>
          {owners.length === 0 && (
            <p className="text-xs text-slate-400 mt-1">No store owners found. Create a store_owner user first.</p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading
              ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating...</span>
              : 'Create Store'
            }
          </button>
        </div>
      </form>
    </Modal>
  );
};

const AdminStores = () => {
  const [data, setData]           = useState([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters]     = useState({ name: '', email: '', address: '' });
  const [sortBy, setSortBy]       = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const limit = 10;

  const debouncedFilters = useDebounce(filters, 400);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const clean = Object.fromEntries(Object.entries(debouncedFilters).filter(([, v]) => v));
      const { data: res } = await api.get('/admin/stores', {
        params: { page, limit, sortBy, sortOrder, ...clean },
      });
      setData(res.data);
      setTotal(res.pagination.total);
    } catch {
      toast.error('Failed to load stores.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy, sortOrder, debouncedFilters]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const handleSort = (field) => {
    if (sortBy === field) setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortOrder('asc'); }
    setPage(1);
  };

  const setFilter = (key, val) => {
    setFilters(f => ({ ...f, [key]: val }));
    setPage(1);
  };

  const columns = [
    {
      key: 'name', label: 'Store', sortable: true,
      render: row => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {row.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-slate-800 truncate max-w-[160px]">{row.name}</p>
            <p className="text-xs text-slate-400 truncate">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'address', label: 'Address', sortable: true,
      render: row => <span className="text-slate-500 text-sm">{row.address || '—'}</span>,
    },
    {
      key: 'owner_name', label: 'Owner',
      render: row => row.owner_name
        ? <span className="text-slate-700 text-sm font-medium">{row.owner_name}</span>
        : <span className="text-slate-300 text-sm italic">Unassigned</span>,
    },
    {
      key: 'avg_rating', label: 'Rating', sortable: true,
      render: row => (
        <div className="flex items-center gap-2">
          <StarRating value={Math.round(row.avg_rating || 0)} readonly size="sm" />
          <span className="text-sm font-semibold text-slate-700">{row.avg_rating ?? '—'}</span>
          {row.total_ratings > 0 && (
            <span className="text-xs text-slate-400">({row.total_ratings})</span>
          )}
        </div>
      ),
    },
  ];

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Stores</h1>
          <p className="text-slate-500 text-sm mt-0.5">{total} stores registered on platform</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <FiPlus /> Add Store
        </button>
      </div>

      <div className="card mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
        </div>
        {hasFilters && (
          <button
            onClick={() => { setFilters({ name: '', email: '', address: '' }); setPage(1); }}
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
          emptyMessage="No stores found matching your search"
        />
      </div>

      {showModal && <AddStoreModal onClose={() => setShowModal(false)} onSuccess={fetchStores} />}
    </div>
  );
};

export default AdminStores;
