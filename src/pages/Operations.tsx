import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MapPin, Car, Package, Clock, TrendingUp, AlertCircle } from "lucide-react";

const Operations = () => {
  const mockRides = [
    { id: "R001", customer: "John Doe", driver: "Mike Chen", distance: "12.5km", cost: "$18.50", commission: "$2.78", status: "completed" },
    { id: "R002", customer: "Sarah Wilson", driver: "Alex Rodriguez", distance: "8.2km", cost: "$12.30", commission: "$1.85", status: "in-progress" },
    { id: "R003", customer: "David Kim", driver: "Lisa Thompson", distance: "15.7km", cost: "$23.40", commission: "$3.51", status: "cancelled" },
    { id: "R004", customer: "Emma Brown", driver: "Carlos Martinez", distance: "6.1km", cost: "$9.80", commission: "$1.47", status: "completed" },
  ];

  const mockDeliveries = [
    { id: "D001", sender: "TechMart Store", receiver: "Jennifer Lee", package: "Electronics", status: "delivered", proof: "Signature received" },
    { id: "D002", sender: "Fresh Foods Co", receiver: "Robert Taylor", package: "Groceries", status: "in-transit", proof: "Pending" },
    { id: "D003", sender: "Fashion Hub", receiver: "Maria Garcia", package: "Clothing", status: "picked-up", proof: "Photo taken" },
  ];

  const operationsData = [
    { name: 'Mon', rides: 45, deliveries: 32 },
    { name: 'Tue', rides: 52, deliveries: 38 },
    { name: 'Wed', rides: 48, deliveries: 41 },
    { name: 'Thu', rides: 61, deliveries: 35 },
    { name: 'Fri', rides: 75, deliveries: 48 },
    { name: 'Sat', rides: 82, deliveries: 55 },
    { name: 'Sun', rides: 68, deliveries: 42 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'in-progress': case 'in-transit': case 'picked-up': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Operations</h1>
          <p className="text-muted-foreground">Real-time ride and delivery management</p>
        </div>
        <Button variant="outline">
          <MapPin className="h-4 w-4 mr-2" />
          Live Map View
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rides</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">+8% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Delivery Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24m</div>
            <p className="text-xs text-muted-foreground">-3m from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancellation Rate</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.8%</div>
            <p className="text-xs text-muted-foreground">-0.5% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Operations Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Weekly Operations Overview
          </CardTitle>
          <CardDescription>Rides and deliveries completed this week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={operationsData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip />
              <Bar dataKey="rides" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="deliveries" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Ride History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Rides</CardTitle>
            <CardDescription>Latest ride transactions and assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRides.map((ride) => (
                  <TableRow key={ride.id}>
                    <TableCell className="font-medium">{ride.id}</TableCell>
                    <TableCell>{ride.customer}</TableCell>
                    <TableCell>{ride.driver}</TableCell>
                    <TableCell>{ride.distance}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(ride.status)}>
                        {ride.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Delivery Management */}
        <Card>
          <CardHeader>
            <CardTitle>Active Deliveries</CardTitle>
            <CardDescription>Real-time delivery tracking and management</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Receiver</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDeliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-medium">{delivery.id}</TableCell>
                    <TableCell>{delivery.sender}</TableCell>
                    <TableCell>{delivery.receiver}</TableCell>
                    <TableCell>{delivery.package}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(delivery.status)}>
                        {delivery.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Track
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Operations;