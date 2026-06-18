import { Link } from "react-router-dom";
import { FiShoppingBag, FiStar, FiArrowRight } from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
        <p className="text-muted-foreground mt-1">Discover and rate stores on the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/user/stores" className="block">
          <Card className="group hover:shadow-lg hover:border-primary/30 transition-all">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors">
                <FiShoppingBag className="text-primary group-hover:text-primary-foreground text-2xl transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Browse Stores</h3>
                <p className="text-muted-foreground text-sm">Find and rate stores near you</p>
              </div>
              <FiArrowRight className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </CardContent>
          </Card>
        </Link>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100 dark:from-amber-950/30 dark:to-orange-950/30">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="w-14 h-14 bg-amber-400 rounded-2xl flex items-center justify-center">
              <FiStar className="text-white text-2xl" fill="currentColor" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Your Ratings</h3>
              <p className="text-muted-foreground text-sm">Rate stores 1–5 stars and update anytime</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: "01", title: "Browse Stores", desc: "Find stores by name or address", emoji: "🔍" },
              { step: "02", title: "Rate Stores", desc: "Give a 1–5 star rating", emoji: "⭐" },
              { step: "03", title: "Update Anytime", desc: "Change your rating whenever you want", emoji: "✏️" },
            ].map(({ step, title, desc, emoji }) => (
              <div key={step} className="flex gap-4 p-4 bg-muted/50 rounded-xl">
                <span className="text-2xl">{emoji}</span>
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{step}</p>
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
