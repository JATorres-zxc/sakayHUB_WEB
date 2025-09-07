import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  MapPin, 
  Car, 
  Package, 
  Clock, 
  User, 
  Phone, 
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";

const mockRides = [
  {
    id: "R001",
    customer: "John Doe",
    driver: "Mike Wilson",
    pickup: "Mall of Asia",
    destination: "BGC Taguig",
    status: "ongoing",
    fare: "₱180",
    time: "2:15 PM"
  },
  {
    id: "R002", 
    customer: "Sarah Chen",
    driver: "Carlos Reyes",
    pickup: "Makati CBD",
    destination: "Ortigas Center",
    status: "completed",
    fare: "₱250",
    time: "1:45 PM"
  },
  {
    id: "R003",
    customer: "Robert Kim",
    driver: "Anna Garcia",
    pickup: "Quezon City",
    destination: "Manila",
    status: "cancelled",
    fare: "₱200",
    time: "1:30 PM"
  }
];

const mockDeliveries = [
  {
    id: "D001",
    sender: "FoodPanda Store",
    receiver: "Maria Santos",
    driver: "Jose Cruz",
    package: "Food Order - 2x Burger Meals",
    pickup: "McDonald's Ayala",
    destination: "Unit 502, One Ayala",
    status: "in-transit",
    fee: "₱45",
    time: "2:30 PM"
  },
  {
    id: "D002",
    sender: "Shopee Logistics",
    receiver: "David Lee",
    driver: "Pedro Morales",
    package: "Electronics - iPhone Case",
    pickup: "Shopee Warehouse",
    destination: "Alabang Hills Village",
    status: "delivered",
    fee: "₱60",
    time: "12:45 PM"
  }
];

export default function RidesDeliveries() {
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
      case "in-transit":
        return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "completed":
      case "delivered":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-200";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ongoing":
      case "in-transit":
        return <Clock className="w-3 h-3" />;
      case "completed":
      case "delivered":
        return <CheckCircle className="w-3 h-3" />;
      case "cancelled":
        return <XCircle className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Rides & Deliveries</h1>
        <Button className="gap-2">
          <MapPin className="w-4 h-4" />
          Live Map View
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Active Rides"
          value="24"
          change={{ value: "12%", positive: true }}
          icon={Car}
          description="Currently ongoing"
        />
        <StatsCard
          title="Active Deliveries"
          value="18"
          change={{ value: "8%", positive: true }}
          icon={Package}
          description="In transit"
        />
        <StatsCard
          title="Weekly Rides"
          value="1,247"
          change={{ value: "23%", positive: true }}
          icon={Car}
          description="This week"
        />
        <StatsCard
          title="Weekly Deliveries"
          value="892"
          change={{ value: "15%", positive: true }}
          icon={Package}
          description="This week"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Rides */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5" />
              Recent Rides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fare</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRides.map((ride) => (
                  <TableRow key={ride.id}>
                    <TableCell className="font-mono text-sm">{ride.id}</TableCell>
                    <TableCell>{ride.customer}</TableCell>
                    <TableCell className="text-sm">
                      {ride.pickup} → {ride.destination}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Badge variant="outline" className={getStatusColor(ride.status)}>
                          {getStatusIcon(ride.status)}
                          <span className="ml-1 capitalize">{ride.status}</span>
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{ride.fare}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedRide(ride)}
                          >
                            Manage
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Manage Ride - {selectedRide?.id}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Customer</label>
                                <p className="text-sm text-muted-foreground">{selectedRide?.customer}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Driver</label>
                                <p className="text-sm text-muted-foreground">{selectedRide?.driver}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Button variant="outline" className="w-full">
                                Reassign Driver
                              </Button>
                              <Button variant="destructive" className="w-full">
                                Cancel Ride
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Active Deliveries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Active Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDeliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-mono text-sm">{delivery.id}</TableCell>
                    <TableCell className="text-sm">{delivery.package}</TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Badge variant="outline" className={getStatusColor(delivery.status)}>
                          {getStatusIcon(delivery.status)}
                          <span className="ml-1 capitalize">{delivery.status}</span>
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{delivery.fee}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedDelivery(delivery)}
                          >
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delivery Details - {selectedDelivery?.id}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Sender</label>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {selectedDelivery?.sender}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Receiver</label>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {selectedDelivery?.receiver}
                                </p>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Package Details</label>
                              <p className="text-sm text-muted-foreground">{selectedDelivery?.package}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Route</label>
                              <p className="text-sm text-muted-foreground">
                                {selectedDelivery?.pickup} → {selectedDelivery?.destination}
                              </p>
                            </div>
                            <div className="border rounded-lg p-3 bg-muted/30">
                              <label className="text-sm font-medium">Proof of Delivery</label>
                              <div className="mt-2 space-y-2">
                                <div className="h-32 bg-muted rounded border border-dashed flex items-center justify-center">
                                  <span className="text-sm text-muted-foreground">Photo placeholder</span>
                                </div>
                                <div className="h-16 bg-muted rounded border border-dashed flex items-center justify-center">
                                  <span className="text-sm text-muted-foreground">Signature placeholder</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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
}