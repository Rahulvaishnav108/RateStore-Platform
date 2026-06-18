import { Link } from "react-router-dom";
import { FiUsers, FiShoppingBag, FiStar, FiBarChart2, FiActivity } from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";

const statConfig = [
  { key: "totalUsers", label: "Total Users", icon: FiUsers, color: "text-blue-600 bg-blue-50" },
  { key: "totalAdmins", label: "Admins", icon: FiBarChart2, color: "text-purple-600 bg-purple-50" },
  { key: "totalStores", label: "Total Stores", icon: FiShoppingBag, color: "text-emerald-600 bg-emerald-50" },
  { key: "totalRatings", label: "Total Ratings", icon: FiStar, color: "text-amber-600 bg-amber-50" },
  { key: "avgRating", label: "Platform Avg Rating", icon: FiActivity, color: "text-primary bg-primary/10" },
] as const;

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useAdminDashboard();

  const greeting = new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">
          Good {greeting}, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1">Here's what's happening on your platform today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? [...Array(5)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
          : statConfig.map(({ key, label, icon: Icon, color }) => (
              <Card key={key} className="flex items-center gap-4 p-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon className="text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {key === "avgRating" ? (stats?.avgRating ? `${stats.avgRating} ★` : "—") : stats?.[key] ?? "—"}
                  </p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </div>
              </Card>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Add New User", desc: "Create admin, user or store owner accounts", href: "/admin/users", color: "bg-blue-50 text-blue-700" },
              { label: "Add New Store", desc: "Register a store on the platform", href: "/admin/stores", color: "bg-emerald-50 text-emerald-700" },
            ].map(({ label, desc, href, color }) => (
              <Link
                key={label}
                to={href}
                className="flex items-center gap-4 p-4 rounded-xl border hover:border-primary/30 hover:bg-primary/5 transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform`}>
                  +
                </div>
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
          </CardHeader>
          <CardContent>
            {stats && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium">Average Platform Rating</span>
                    <span className="font-bold">{stats.avgRating ?? 0}/5</span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-700"
                      style={{ width: `${((stats.avgRating || 0) / 5) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[
                    { label: "Users", value: stats.totalUsers },
                    { label: "Stores", value: stats.totalStores },
                    { label: "Ratings", value: stats.totalRatings },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center p-3 bg-muted/50 rounded-xl">
                      <p className="text-lg font-bold">{value}</p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
