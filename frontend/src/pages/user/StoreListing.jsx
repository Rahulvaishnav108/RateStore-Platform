import { useState, useEffect, useCallback } from 'react';
import { FiSearch, FiX, FiMapPin, FiStar } from 'react-icons/fi';
import api from '../../services/api';
import StarRating from '../../components/StarRating';
import Modal from '../../components/Modal';
import { useDebounce } from '../../hooks/useDebounce';
import toast from 'react-hot-toast';

/* ── Rating Modal ── */
const RatingModal = ({ store, existingRating, existingRatingId, onClose, onSuccess }) => {
  const [rating, setRating]   = useState(existingRating || 0);
  const [loading, setLoading] = useState(false);
  const labels = { 1: 'Poor 😞', 2: 'Fair 😐', 3: 'Good 🙂', 4: 'Very Good 😊', 5: 'Excellent 🤩' };

  const handleSubmit = async () => {
    if (!rating) { toast.error('Please select a star rating.'); return; }
    setLoading(true);
    try {
      if (existingRatingId) {
        await api.put(`/ratings/${existingRatingId}`, { rating });
        toast.success('Rating updated successfully!');
      } else {
        await api.post('/ratings', { store_id: store.id, rating });
        toast.success('Rating submitted successfully!');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating.');
    } finally { setLoading(false); }
  };

  return (
    <Modal title={existingRatingId ? 'Update Rating' : 'Rate This Store'} onClose={onClose} size="sm">
      {/* Store Info */}
      <div className="flex items-center gap-3 mb-6 p-4 bg-surface-50 rounded-xl border border-surface-100">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          {store.name[0]}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-slate-800 truncate">{store.name}</p>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <FiMapPin size={10} />{store.address}
          </p>
        </div>
      </div>

      {/* Star Picker */}
      <div className="flex flex-col items-center gap-3 mb-6">
        <p className="text-sm text-slate-500">Tap a star to rate</p>
        <StarRating value={rating} onChange={setRating} size="lg" />
        <p className="h-6 text-sm font-semibold text-amber-600">
          {rating ? labels[rating] : ''}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
        <button onClick={handleSubmit} disabled={loading || !rating} className="btn-primary flex-1">
          {loading
            ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</span>
            : existingRatingId ? 'Update Rating' : 'Submit Rating'
          }
        </button>
      </div>
    </Modal>
  );
};

/* ── Store Card ── */
const StoreCard = ({ store, onRate }) => (
  <div className="card hover:shadow-soft transition-all duration-200 hover:-translate-y-0.5 flex flex-col">
    {/* Header */}
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0">
          {store.name[0]}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-800 truncate text-sm leading-tight">{store.name}</h3>
          <p className="text-xs text-slate-400 truncate mt-0.5">{store.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-2 py-1 rounded-lg flex-shrink-0 ml-2">
        <FiStar size={12} className="text-amber-500" fill="currentColor" />
        <span className="text-xs font-bold text-amber-700">{store.avg_rating || '—'}</span>
      </div>
    </div>

    {/* Address */}
    <p className="text-xs text-slate-500 flex items-start gap-1.5 mb-3 flex-1">
      <FiMapPin size={11} className="mt-0.5 flex-shrink-0 text-slate-400" />
      <span className="line-clamp-2">{store.address || 'Address not provided'}</span>
    </p>

    {/* Stats */}
    {store.total_ratings > 0 && (
      <p className="text-xs text-slate-400 mb-3">{store.total_ratings} rating{store.total_ratings !== 1 ? 's' : ''}</p>
    )}

    {/* Footer */}
    <div className="flex items-center justify-between pt-3 border-t border-surface-100 mt-auto">
      <div>
        {store.user_rating ? (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400">Your rating:</span>
            <StarRating value={store.user_rating} readonly size="sm" />
          </div>
        ) : (
          <span className="text-xs text-slate-300">Not rated yet</span>
        )}
      </div>
      <button
        onClick={() => onRate(store)}
        className={`text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-all ${
          store.user_rating
            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm'
        }`}
      >
        {store.user_rating ? '✏️ Update' : '⭐ Rate'}
      </button>
    </div>
  </div>
);

/* ── Main Page ── */
const StoreListing = () => {
  const [stores, setStores]           = useState([]);
  const [total, setTotal]             = useState(0);
  const [page, setPage]               = useState(1);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [sortBy, setSortBy]           = useState('name');
  const [sortOrder, setSortOrder]     = useState('asc');
  const [selectedStore, setSelected]  = useState(null);
  const limit = 9;

  const debouncedSearch = useDebounce(search, 400);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/stores', {
        params: { page, limit, search: debouncedSearch, sortBy, sortOrder },
      });
      setStores(data.data);
      setTotal(data.pagination.total);
    } catch {
      toast.error('Failed to load stores.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, sortBy, sortOrder]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Browse Stores</h1>
        <p className="text-slate-500 text-sm mt-1">
          {total > 0 ? `${total} stores available` : 'No stores found'}
        </p>
      </div>

      {/* Search + Sort */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by store name or address…"
              className="input-field pl-10 pr-10"
            />
            {search && (
              <button onClick={() => { setSearch(''); setPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <FiX size={16} />
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}
              className="input-field w-auto text-sm">
              <option value="name">Sort: Name</option>
              <option value="avg_rating">Sort: Rating</option>
              <option value="created_at">Sort: Newest</option>
            </select>
            <button
              onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
              className="btn-secondary px-4 text-sm font-medium"
            >
              {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton h-52 rounded-2xl" />
          ))}
        </div>
      ) : stores.length === 0 ? (
        <div className="card text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-slate-700">No stores found</h3>
          <p className="text-slate-400 text-sm mt-1">
            {search ? `No results for "${search}"` : 'No stores registered yet'}
          </p>
          {search && (
            <button onClick={() => setSearch('')} className="mt-4 btn-secondary mx-auto">
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map(store => (
              <StoreCard key={store.id} store={store} onRate={setSelected} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="btn-secondary disabled:opacity-40"
              >
                ← Previous
              </button>
              <span className="text-sm text-slate-500 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="btn-secondary disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {selectedStore && (
        <RatingModal
          store={selectedStore}
          existingRating={selectedStore.user_rating}
          existingRatingId={selectedStore.user_rating_id}
          onClose={() => setSelected(null)}
          onSuccess={fetchStores}
        />
      )}
    </div>
  );
};

export default StoreListing;
