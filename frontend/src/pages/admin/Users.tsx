import * as React from "react";
import { motion } from "framer-motion";
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiDownload, 
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiEye
} from "react-icons/fi";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { SearchField } from "@/components/forms/SearchField";
import { DataTable } from "@/components/table/DataTable";
import { EmptyState, NoUsersEmptyState } from "@/components/EmptyState";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useUsers, useCreateUser, useDeleteUser } from "@/hooks/useUsers";
import { useDebounce } from "@/hooks/useDebounce";
import { CreateUserForm } from "@/components/forms/CreateUserForm";
import { PAGINATION } from "@/config/constants";
import { formatDate } from "@/lib/utils";
import type { User } from "@/types";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }
};

export default function Users() {
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("");
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: PAGINATION.DEFAULT_LIMIT,
  });
  const [sorting, setSorting] = React.useState([
    { id: "created_at", desc: true }
  ]);

  const debouncedSearch = useDebounce(search, 400);
  
  // Prepare filters
  const filters = React.useMemo(() => ({
    ...(debouncedSearch && { name: debouncedSearch }),
    ...(roleFilter && { role: roleFilter }),
  }), [debouncedSearch, roleFilter]);

  const {
    data,
    isLoading,
    error
  } = useUsers({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sortBy: sorting[0]?.id || "created_at",
    sortOrder: sorting[0]?.desc ? "desc" : "asc",
    filters,
  });

  const createUserMutation = useCreateUser();
  const deleteUserMutation = useDeleteUser();

  // Table columns
  const columns: ColumnDef<User>[] = React.useMemo(
    () => [
      {
        id: "user",
        header: "User",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex items-center gap-3">
              <Avatar name={user.name} size="sm" />
              <div className="min-w-0">
                <p className="font-medium text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <Badge variant={row.original.role as any}>
            {row.original.role}
          </Badge>
        ),
      },
      {
        accessorKey: "address", 
        header: "Address",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {row.original.address || "—"}
          </span>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Joined",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatDate(row.original.created_at)}
          </span>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <FiEye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
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

  const handleCreateUser = (userData: any) => {
    createUserMutation.mutate(userData, {
      onSuccess: () => {
        setShowCreateModal(false);
      }
    });
  };

  const handleClearFilters = () => {
    setSearch("");
    setRoleFilter("");
  };

  const hasFilters = search || roleFilter;
  const users = data?.data || [];
  const totalUsers = data?.pagination.total || 0;
  const pageCount = data?.pagination.pages || 0;

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
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Users</h1>
            <p className="text-muted-foreground mt-1">
              {totalUsers > 0 ? `${totalUsers} users registered` : "Manage user accounts"}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
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

      {/* Filters */}
      <motion.div variants={fadeInUp}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <SearchField
                  placeholder="Search users by name or email..."
                  value={search}
                  onSearch={setSearch}
                  onClear={() => setSearch("")}
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="input h-10 w-auto min-w-[120px]"
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="store_owner">Store Owner</option>
                </select>
                
                {hasFilters && (
                  <Button variant="outline" size="sm" onClick={handleClearFilters}>
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Users table */}
      <motion.div variants={fadeInUp}>
        {isLoading && users.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading users...</p>
              </div>
            </CardContent>
          </Card>
        ) : users.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              {hasFilters ? (
                <EmptyState
                  icon="🔍"
                  title="No users found"
                  description="No users match your current filters."
                  action={{ label: "Clear filters", onClick: handleClearFilters }}
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
            emptyMessage="No users found"
          />
        )}
      </motion.div>

      {/* Create User Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <CreateUserForm
            onSubmit={handleCreateUser}
            isLoading={createUserMutation.isPending}
            onCancel={() => setShowCreateModal(false)}
          />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}