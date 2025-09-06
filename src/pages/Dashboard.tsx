import { StatsCard } from "@/components/dashboard/StatsCard";
import { SimpleChart } from "@/components/dashboard/SimpleChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { 
  Users, 
  Car, 
  DollarSign, 
  TrendingUp,
  MapPin,
  Clock,
  Star,
  AlertTriangle
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your ride-hailing platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value="24,567"
          change={{ value: "12.5%", positive: true }}
          icon={Users}
          description="vs last month"
        />
        <StatsCard
          title="Active Drivers"
          value="1,234"
          change={{ value: "8.2%", positive: true }}
          icon={Car}
          description="currently online"
        />
        <StatsCard
          title="Monthly Revenue"
          value="$85,240"
          change={{ value: "15.3%", positive: true }}
          icon={DollarSign}
          description="vs last month"
        />
        <StatsCard
          title="Completion Rate"
          value="96.4%"
          change={{ value: "2.1%", positive: true }}
          icon={TrendingUp}
          description="ride success rate"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Today's Rides"
          value="456"
          icon={MapPin}
          description="rides completed today"
        />
        <StatsCard
          title="Avg Response Time"
          value="3.2 min"
          icon={Clock}
          description="driver pickup time"
        />
        <StatsCard
          title="Average Rating"
          value="4.8"
          icon={Star}
          description="customer satisfaction"
        />
        <StatsCard
          title="Pending Issues"
          value="12"
          icon={AlertTriangle}
          description="support tickets"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-6 md:grid-cols-7">
        <SimpleChart />
        <ActivityFeed />
      </div>
    </div>
  );
}