import { FiUsers, FiBarChart2, FiTrendingUp, FiStar, FiMail, FiMapPin, FiCalendar } from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { StarRating } from "@/components/ui/StarRating";
import { EmptyState } from "@/components/EmptyState";
import { useOwnerDashboard } from "@/hooks/useOwnerDashboard";
import { formatDate } from "@/lib/utils";

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const colors: Record<number, { bar: string; bg: string; text: string }> = {
    5: { bar: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700" },
    4: { bar: "bg-blue-500", bg: "bg-blue-50", text: "text-blue-700" },
    3: { bar: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700" },
    2: { bar: "bg-orange-500", bg: "bg-orange-50", text: "text-orange-700" },
    1: { bar: "bg-red-500", bg: "bg-red-50", text: "text-red-700" },
  };
  const c = colors[star];

  return (
    <div className="flex items-center gap-3">
      <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${c.bg}`}>
        <span className={`text-xs font-bold ${c.text}`}>{star}★</span>
      </div>
      <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${c.bar} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex items-center gap-1.5 w-16 justify-end">
        <span className="text-sm font-semibold">{count}</span>
        <span className="text-xs text-muted-foreground">({pct}%)</span>
      </div>
    </div>
  );
}

function ScoreRing({ score }: { score?: number }) {
  const pct = ((score || 0) / 5) * 100;
  const color = (score ?? 0) >= 4 ? "#10b981" : (score ?? 0) >= 3 ? "#f59e0b" : "#ef4444";
  const r = 40;
  const circ = 2 * Math.PI * r;

  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="112" height="112">
        <circle cx="56" cy="56" r={r} fill="none" stroke="currentColor" className="text-muted" strokeWidth="8" />
        <circle
          cx="56"
          cy="56"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct / 100)}
          strokeLinecap="round"
        />
      </svg>
      <div className="text-center">
        <p className="text-2xl font-black">{score || "—"}</p>
        <p className="text-xs text-muted-foreground">out of 5</p>
      </div>
    </div>
  );
}

export default function OwnerDashboard() {
  const { data, isLoading, error } = useOwnerDashboard();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <EmptyState
        icon="🏪"
        title="No Store Assigned"
        description="Contact the administrator to link your account to a store."
      />
    );
  }

  const { store, avg_rating, total_ratings, distribution, raters } = data;
  const positive = (distribution[5] || 0) + (distribution[4] || 0);
  const positivePct = total_ratings > 0 ? Math.round((positive / total_ratings) * 100) : 0;
  const activeStars = Object.entries(distribution)
    .filter(([, v]) => v > 0)
    .map(([k]) => Number(k));
  const ratingSpread =
    total_ratings > 0 && activeStars.length
      ? `${Math.min(...activeStars)}★ – ${Math.max(...activeStars)}★`
      : "—";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Store Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Analytics and customer ratings for your store</p>
      </div>

      <div className="bg-gradient-to-r from-primary via-primary/90 to-indigo-600 rounded-2xl p-6 text-primary-foreground shadow-lg overflow-hidden relative">
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex-1 min-w-0">
            <p className="text-primary-foreground/70 text-xs font-semibold uppercase tracking-wider mb-2">Your Store</p>
            <h2 className="text-2xl font-bold truncate">{store.name}</h2>
            <div className="flex flex-col gap-1 mt-3 text-primary-foreground/80 text-sm">
              <p className="flex items-center gap-2">
                <FiMapPin size={13} /> {store.address}
              </p>
              <p className="flex items-center gap-2">
                <FiMail size={13} /> {store.email}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 text-center">
            <ScoreRing score={avg_rating} />
            <div className="mt-2">
              <StarRating value={Math.round(avg_rating)} readonly size="sm" />
              <p className="text-primary-foreground/70 text-xs mt-1">{total_ratings} ratings total</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Average Rating", value: avg_rating ? `${avg_rating} / 5` : "—", icon: FiStar, color: "text-amber-500 bg-amber-50" },
          { label: "Total Ratings", value: total_ratings, icon: FiBarChart2, color: "text-blue-500 bg-blue-50" },
          { label: "5-Star Reviews", value: distribution[5] || 0, icon: FiTrendingUp, color: "text-emerald-500 bg-emerald-50" },
          { label: "Positive Rate", value: `${positivePct}%`, icon: FiUsers, color: "text-purple-500 bg-purple-50" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="flex items-center gap-3 p-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="text-lg" />
            </div>
            <div>
              <p className="text-xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => (
              <RatingBar key={star} star={star} count={distribution[star] || 0} total={total_ratings} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {[
              {
                label: "Average Score",
                value: avg_rating ? `${avg_rating} / 5.0` : "No ratings",
                cls: avg_rating >= 4 ? "text-emerald-600 font-bold" : avg_rating >= 3 ? "text-amber-600 font-bold" : "text-red-500 font-bold",
              },
              { label: "Total Customers", value: `${total_ratings} customer${total_ratings !== 1 ? "s" : ""}` },
              { label: "Five-Star Reviews", value: `${distribution[5] || 0} reviews` },
              { label: "Positive (4–5 ★)", value: `${positive} reviews (${positivePct}%)` },
              { label: "Critical (1–2 ★)", value: `${(distribution[1] || 0) + (distribution[2] || 0)} reviews` },
              { label: "Rating Spread", value: ratingSpread },
            ].map(({ label, value, cls }) => (
              <div key={label} className="flex justify-between items-center py-2.5 border-b last:border-0">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className={`text-sm ${cls || "font-medium"}`}>{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Customer Ratings</CardTitle>
          <span className="text-xs font-semibold bg-muted px-2.5 py-1 rounded-full">
            {raters.length} customer{raters.length !== 1 ? "s" : ""}
          </span>
        </CardHeader>
        <CardContent>
          {raters.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="text-4xl mb-3">⭐</div>
              <p className="font-medium">No ratings yet</p>
              <p className="text-sm mt-1">Share your store to get your first rating</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase">Customer</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase">Email</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase">Rating</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {raters.map((r) => (
                    <tr key={r.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                            {r.name[0]?.toUpperCase()}
                          </div>
                          <span className="font-medium truncate max-w-[120px]">{r.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground text-xs">{r.email}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <StarRating value={r.rating} readonly size="sm" />
                          <span className="text-xs font-semibold">{r.rating}/5</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <FiCalendar size={11} />
                          {formatDate(r.updated_at)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
