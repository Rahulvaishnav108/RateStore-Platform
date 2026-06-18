import * as React from "react";
import { motion } from "framer-motion";
import { FiPlus, FiDownload, FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import { type ColumnDef, type PaginationState, type SortingState } from "@tanstack/react-table";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { StarRating } from "@/components/ui/StarRating";
import { SearchField } from "@/components/forms/SearchField";
import { DataTable } from "@/components/table/DataTable";
import { EmptyState, NoUsersEmptyState } from "@/components/EmptyState";
import { CreateUserForm } from "@/components/forms/CreateUserForm";
import { EditUserForm } from "@/components/forms/EditUserForm";
import { useUsers, useCreateUser, useDeleteUser, useUpdateUser, useUserById } from "@/hooks/useUsers";
import { useDebounce } from "@/hooks/useDebounce";
import { PAGINATION } from "@/config/constants";
import { formatDate } from "@/lib/utils";
import type { User } from "@/types";
import type { CreateUserFormData, UpdateUserFormData } from "@/lib/validations";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] },
};

function exportUsersCsv(users: User[]) {
  const headers = ["Name", "Email", "Role", "Address", "Joined"];
  const rows = users.map((u) => [
    u.name,
    u.email,
    u.role,
    u.address || "",
    formatDate(u.created_at),
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `users-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function Users() {
  const [filters, setFilters] = React.useState({ name: "", email: "", address: "", role: "" });
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [viewUserId, setViewUserId] = React.useState<number | null>(null);
  const [editUser, setEditUser] = React.useState<User | null>(null);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGINATION.DEFAULT_LIMIT,
  });
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "created_at", desc: true }]);

  const debouncedFilters = {
    name: useDebounce(filters.name, 400),
    email: useDebounce(filters.email, 400),
    address: useDebounce(filters.address, 400),
    role: filters.role,
  };

  const activeFilters = React.useMemo(
    () => ({
      ...(debouncedFilters.name && { name: debouncedFilters.name }),
      ...(debouncedFilters.email && { email: debouncedFilters.email }),
      ...(debouncedFilters.address && { address: debouncedFilters.address }),
      ...(debouncedFilters.role && { role: debouncedFilters.role }),
    }),
    [debouncedFilters.name, debouncedFilters.email, debouncedFilters.address, debouncedFilters.role]
  );

  const { data, isLoading, error } = useUsers({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sortBy: sorting[0]?.id || "created_at",
    sortOrder: sorting[0]?.desc ? "desc" : "asc",
    filters: activeFilters,
  });

  const { data: viewedUser, isLoading: viewLoading } = useUserById(viewUserId);
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const columns: ColumnDef<User>[] = React.useMemo(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "User",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex items-center gap-3">
              <Avatar name={user.name} size="sm" />
              <div className="min-w-0">
                <p className="font-medium truncate">{user.name}</p>
                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => <Badge variant={row.original.role as "admin" | "user" | "store_owner"}>{row.original.role}</Badge>,
      },
      {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.address || "—"}</span>,
      },
      {
        accessorKey: "created_at",
        header: "Joined",
        cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.created_at)}</span>,
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setViewUserId(row.original.id)}>
              <FiEye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setEditUser(row.original)}>
              <FiEdit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteUserMutation.mutate(row.original.id)}
              disabled={deleteUserMutation.isPending}
            >
              <FiTrash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [deleteUserMutation]
  );

  const hasFilters = Object.values(filters).some(Boolean);
  const users = data?.data || [];
  const totalUsers = data?.pagination.total || 0;
  const pageCount = data?.pagination.pages || 0;
  const clearFilters = () => setFilters({ name: "", email: "", address: "", role: "" });

  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        title="Failed to load users"
        description="There was an error loading the users data."
        action={{ label: "Try again", onClick: () => window.location.reload() }}
      />
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{ initial: { opacity: 0 }, animate: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
      className="space-y-6"
    >
      <motion.div variants={fadeInUp}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="text-muted-foreground mt-1">
              {totalUsers > 0 ? `${totalUsers} users registered` : "Manage user accounts"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => exportUsersCsv(users)} disabled={users.length === 0}>
              <FiDownload className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setShowCreateModal(true)}>
              <FiPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-3">
                {([
                  { key: "name", placeholder: "Filter by name..." },
                  { key: "email", placeholder: "Filter by email..." },
                  { key: "address", placeholder: "Filter by address..." },
                ] as const).map(({ key, placeholder }) => (
                  <SearchField
                    key={key}
                    placeholder={placeholder}
                    value={filters[key]}
                    onSearch={(value) => setFilters((current) => ({ ...current, [key]: value }))}
                    onClear={() => setFilters((current) => ({ ...current, [key]: "" }))}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <select
                  value={filters.role}
                  onChange={(e) => setFilters((current) => ({ ...current, role: e.target.value }))}
                  className="input h-10 w-auto min-w-[120px]"
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="store_owner">Store Owner</option>
                </select>
                {hasFilters && (
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeInUp}>
        {isLoading && users.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">Loading users...</CardContent>
          </Card>
        ) : users.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              {hasFilters ? (
                <EmptyState
                  icon="🔍"
                  title="No users found"
                  description="No users match your current filters."
                  action={{ label: "Clear filters", onClick: clearFilters }}
                />
              ) : (
                <NoUsersEmptyState onCreate={() => setShowCreateModal(true)} />
              )}
            </CardContent>
          </Card>
        ) : (
          <DataTable
            columns={columns}
            data={users}
            loading={isLoading}
            pageCount={pageCount}
            pageSize={pagination.pageSize}
            pageIndex={pagination.pageIndex}
            onPaginationChange={setPagination}
            onSortingChange={setSorting}
            sorting={sorting}
            totalRows={totalUsers}
            emptyMessage="No users found"
          />
        )}
      </motion.div>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <CreateUserForm
            onSubmit={(userData: CreateUserFormData) =>
              createUserMutation.mutate(userData, { onSuccess: () => setShowCreateModal(false) })
            }
            isLoading={createUserMutation.isPending}
            onCancel={() => setShowCreateModal(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={viewUserId != null} onOpenChange={(open) => !open && setViewUserId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {viewLoading ? (
            <p className="text-muted-foreground text-sm py-4">Loading...</p>
          ) : viewedUser ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar name={viewedUser.name} />
                <div>
                  <p className="font-semibold">{viewedUser.name}</p>
                  <Badge variant={viewedUser.role as "admin" | "user" | "store_owner"}>{viewedUser.role}</Badge>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Email:</span> {viewedUser.email}</p>
                <p><span className="text-muted-foreground">Address:</span> {viewedUser.address || "—"}</p>
                <p><span className="text-muted-foreground">Joined:</span> {formatDate(viewedUser.created_at)}</p>
                {viewedUser.store_name && (
                  <p><span className="text-muted-foreground">Store:</span> {viewedUser.store_name}</p>
                )}
                {viewedUser.avg_rating != null && viewedUser.avg_rating > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Store rating:</span>
                    <StarRating value={Math.round(viewedUser.avg_rating)} readonly size="sm" />
                    <span>{viewedUser.avg_rating}</span>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={editUser != null} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editUser && (
            <EditUserForm
              user={editUser}
              onSubmit={(formData: UpdateUserFormData) =>
                updateUserMutation.mutate(
                  { id: editUser.id, ...formData },
                  { onSuccess: () => setEditUser(null) }
                )
              }
              isLoading={updateUserMutation.isPending}
              onCancel={() => setEditUser(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
