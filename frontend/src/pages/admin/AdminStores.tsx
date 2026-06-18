import * as React from "react";
import { type ColumnDef, type PaginationState, type SortingState } from "@tanstack/react-table";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { StarRating } from "@/components/ui/StarRating";
import { SearchField } from "@/components/forms/SearchField";
import { CreateStoreForm } from "@/components/forms/CreateStoreForm";
import { DataTable } from "@/components/table/DataTable";
import { EmptyState } from "@/components/EmptyState";
import { useStores, useCreateStore, useDeleteStore } from "@/hooks/useStores";
import { useDebounce } from "@/hooks/useDebounce";
import { PAGINATION } from "@/config/constants";
import type { Store } from "@/types";
import type { CreateStoreFormData } from "@/lib/validations";

export default function AdminStores() {
  const [filters, setFilters] = React.useState({ name: "", email: "", address: "" });
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGINATION.DEFAULT_LIMIT,
  });
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "created_at", desc: true }]);

  const debouncedFilters = {
    name: useDebounce(filters.name, 400),
    email: useDebounce(filters.email, 400),
    address: useDebounce(filters.address, 400),
  };

  const { data, isLoading, error } = useStores({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sortBy: sorting[0]?.id || "created_at",
    sortOrder: sorting[0]?.desc ? "desc" : "asc",
    filters: debouncedFilters,
  });

  const createStoreMutation = useCreateStore();
  const deleteStoreMutation = useDeleteStore();

  const columns: ColumnDef<Store>[] = React.useMemo(
    () => [
      {
        id: "name",
        header: "Store",
        accessorKey: "name",
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
              {row.original.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-medium truncate max-w-[160px]">{row.original.name}</p>
              <p className="text-xs text-muted-foreground truncate">{row.original.email}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.address || "—"}</span>,
      },
      {
        accessorKey: "owner_name",
        header: "Owner",
        cell: ({ row }) =>
          row.original.owner_name ? (
            <span className="text-sm font-medium">{row.original.owner_name}</span>
          ) : (
            <span className="text-muted-foreground text-sm italic">Unassigned</span>
          ),
      },
      {
        accessorKey: "avg_rating",
        header: "Rating",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <StarRating value={Math.round(row.original.avg_rating || 0)} readonly size="sm" />
            <span className="text-sm font-semibold">{row.original.avg_rating ?? "—"}</span>
            {(row.original.total_ratings ?? 0) > 0 && (
              <span className="text-xs text-muted-foreground">({row.original.total_ratings})</span>
            )}
          </div>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteStoreMutation.mutate(row.original.id)}
            disabled={deleteStoreMutation.isPending}
          >
            <FiTrash2 className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [deleteStoreMutation]
  );

  const hasFilters = Object.values(filters).some(Boolean);
  const stores = data?.data || [];
  const totalStores = data?.pagination.total || 0;
  const pageCount = data?.pagination.pages || 0;

  const clearFilters = () => setFilters({ name: "", email: "", address: "" });

  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        title="Failed to load stores"
        description="There was an error loading store data."
        action={{ label: "Try again", onClick: () => window.location.reload() }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stores</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{totalStores} stores registered on platform</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <FiPlus className="h-4 w-4 mr-2" />
          Add Store
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {([
              { key: "name", placeholder: "Search by name…" },
              { key: "email", placeholder: "Search by email…" },
              { key: "address", placeholder: "Search by address…" },
            ] as const).map(({ key, placeholder }) => (
              <SearchField
                key={key}
                placeholder={placeholder}
                value={filters[key]}
                onSearch={(val) => setFilters((f) => ({ ...f, [key]: val }))}
                onClear={() => setFilters((f) => ({ ...f, [key]: "" }))}
              />
            ))}
          </div>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="mt-3">
              Clear all filters
            </Button>
          )}
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={stores}
        loading={isLoading}
        pageCount={pageCount}
        pageSize={pagination.pageSize}
        pageIndex={pagination.pageIndex}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        sorting={sorting}
        totalRows={totalStores}
        emptyMessage="No stores found matching your search"
      />

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Store</DialogTitle>
          </DialogHeader>
          <CreateStoreForm
            onSubmit={(formData: CreateStoreFormData) =>
              createStoreMutation.mutate(formData, { onSuccess: () => setShowCreateModal(false) })
            }
            isLoading={createStoreMutation.isPending}
            onCancel={() => setShowCreateModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
