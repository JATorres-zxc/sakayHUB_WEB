import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    user: "John Doe",
    action: "completed ride",
    target: "Downtown to Airport",
    time: "2 minutes ago",
    type: "ride",
    status: "completed"
  },
  {
    id: 2,
    user: "Sarah Wilson",
    action: "new driver application",
    target: "pending verification",
    time: "5 minutes ago",
    type: "driver",
    status: "pending"
  },
  {
    id: 3,
    user: "Mike Johnson",
    action: "payment processed",
    target: "$45.50",
    time: "8 minutes ago",
    type: "payment",
    status: "success"
  },
  {
    id: 4,
    user: "Emma Davis",
    action: "support ticket",
    target: "payment issue",
    time: "12 minutes ago",
    type: "support",
    status: "open"
  },
  {
    id: 5,
    user: "Alex Brown",
    action: "delivery completed",
    target: "Package #DL-789",
    time: "15 minutes ago",
    type: "delivery",
    status: "completed"
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
    case "success":
      return <Badge className="status-active">Completed</Badge>;
    case "pending":
      return <Badge className="status-pending">Pending</Badge>;
    case "open":
      return <Badge className="status-suspended">Open</Badge>;
    default:
      return <Badge className="status-inactive">{status}</Badge>;
  }
};

const getActivityIcon = (type: string) => {
  const initials = type.charAt(0).toUpperCase();
  const colors = {
    ride: "bg-blue-500",
    driver: "bg-green-500", 
    payment: "bg-purple-500",
    support: "bg-orange-500",
    delivery: "bg-indigo-500"
  };
  
  return (
    <Avatar className="h-8 w-8">
      <AvatarFallback className={cn("text-white text-xs", colors[type as keyof typeof colors] || "bg-gray-500")}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

export function ActivityFeed() {
  return (
    <Card className="col-span-3 card-hover">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              {getActivityIcon(activity.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {activity.user}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.action} • {activity.target}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {getStatusBadge(activity.status)}
                <span className="text-xs text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}