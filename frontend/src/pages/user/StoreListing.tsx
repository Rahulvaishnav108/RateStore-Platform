import * as React from "react";
import { FiMapPin, FiStar } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { StarRating } from "@/components/ui/StarRating";
import { SearchField } from "@/components/forms/SearchField";
import { Skeleton } from "@/components/ui/Skeleton";
import { usePublicStores } from "@/hooks/useStores";
import { useCreateRating, useUpdateRating } from "@/hooks/useRatings";
import { useDebounce } from "@/hooks/useDebounce";
import { RATINGS } from "@/config/constants";
import type { Store } from "@/types";

function RatingModal({
  store,
  onClose,
  onSuccess,
}: {
  store: Store;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [rating, setRating] = React.useState(store.user_rating || 0);
  const createRating = useCreateRating();
  const updateRating = useUpdateRating();
  const isLoading = createRating.isPending || updateRating.isPending;

  const handleSubmit = async () => {
    if (!rating) return;
    if (store.user_rating_id) {
      await updateRating.mutateAsync({ id: store.user_rating_id, rating });
    } else {
      await createRating.mutateAsync({ store_id: store.id, rating });
    }
    onSuccess();
    onClose();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{store.user_rating_id ? "Update Rating" : "Rate This Store"}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            {store.name[0]}
          </div>
          <div className="min-w-0">
            <p className="font-semibold truncate">{store.name}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <FiMapPin size={10} />
              {store.address}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3 py-4">
          <p className="text-sm text-muted-foreground">Tap a star to rate</p>
          <StarRating value={rating} onChange={setRating} size="lg" />
          <p className="h-6 text-sm font-semibold text-amber-600">
            {rating ? RATINGS.LABELS[rating as keyof typeof RATINGS.LABELS] : ""}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!rating || isLoading} loading={isLoading} className="flex-1">
            {store.user_rating_id ? "Update Rating" : "Submit Rating"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StoreCard({ store, onRate }: { store: Store; onRate: (store: Store) => void }) {
  return (
    <Card className="hover:shadow-lg transition-all hover:-translate-y-0.5 flex flex-col">
      <CardContent className="pt-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              {store.name[0]}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold truncate text-sm">{store.name}</h3>
              <p className="text-xs text-muted-foreground truncate">{store.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-2 py-1 rounded-lg">
            <FiStar size={12} className="text-amber-500" fill="currentColor" />
            <span className="text-xs font-bold text-amber-700">{store.avg_rating || "—"}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground flex items-start gap-1.5 mb-3 flex-1">
          <FiMapPin size={11} className="mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{store.address || "Address not provided"}</span>
        </p>
        {(store.total_ratings ?? 0) > 0 && (
          <p className="text-xs text-muted-foreground mb-3">
            {store.total_ratings} rating{store.total_ratings !== 1 ? "s" : ""}
          </p>
        )}
        <div className="flex items-center justify-between pt-3 border-t mt-auto">
          <div>
            {store.user_rating ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Your rating:</span>
                <StarRating value={store.user_rating} readonly size="sm" />
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">Not rated yet</span>
            )}
          </div>
          <Button size="sm" variant={store.user_rating ? "outline" : "primary"} onClick={() => onRate(store)}>
            {store.user_rating ? "Update" : "Rate"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StoreListing() {
  const [search, setSearch] = React.useState("");
  const [sortBy, setSortBy] = React.useState("name");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
  const [page, setPage] = React.useState(1);
  const [selectedStore, setSelectedStore] = React.useState<Store | null>(null);
  const limit = 9;

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, refetch } = usePublicStores({
    page,
    limit,
    sortBy,
    sortOrder,
    filters: debouncedSearch ? { search: debouncedSearch } : {},
  });

  const stores = data?.data || [];
  const total = data?.pagination.total || 0;
  const totalPages = data?.pagination.pages || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Browse Stores</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {total > 0 ? `${total} stores available` : "No stores found"}
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <SearchField
                placeholder="Search by store name or address…"
                value={search}
                onSearch={(val) => { setSearch(val); setPage(1); }}
                onClear={() => { setSearch(""); setPage(1); }}
              />
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="input h-10 w-auto text-sm"
              >
                <option value="name">Sort: Name</option>
                <option value="avg_rating">Sort: Rating</option>
                <option value="created_at">Sort: Newest</option>
              </select>
              <Button
                variant="outline"
                onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
              >
                {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-2xl" />
          ))}
        </div>
      ) : stores.length === 0 ? (
        <Card className="text-center py-20">
          <CardContent>
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold">No stores found</h3>
            <p className="text-muted-foreground text-sm mt-1">
              {search ? `No results for "${search}"` : "No stores registered yet"}
            </p>
            {search && (
              <Button variant="outline" onClick={() => setSearch("")} className="mt-4">
                Clear search
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map((store) => (
              <StoreCard key={store.id} store={store} onRate={setSelectedStore} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <span className="text-sm text-muted-foreground font-medium">
                Page {page} of {totalPages}
              </span>
              <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {selectedStore && (
        <RatingModal
          store={selectedStore}
          onClose={() => setSelectedStore(null)}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}
