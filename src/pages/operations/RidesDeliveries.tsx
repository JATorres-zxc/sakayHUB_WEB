import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import apiClient from "@/lib/api";

type ApiRide = {
  id: number
  customer: string
  driver: string
  pickup: string
  destination: string
  status: string
  fare: number | string
  time: string
}

type ApiDelivery = {
  id: number
  sender: string
  receiver: string
  driver: string
  package: string
  pickup: string
  destination: string
  status: string
  fee: number | string
  time: string
}

export default function RidesDeliveries() {
  const [selectedRide, setSelectedRide] = useState<ApiRide | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<ApiDelivery | null>(null);

  const [rides, setRides] = useState<ApiRide[]>([]);
  const [ridesCount, setRidesCount] = useState(0);
  const [ridesPage, setRidesPage] = useState(1);
  const ridesPageSize = 5;
  const [ridesLoading, setRidesLoading] = useState(false);

  const [deliveries, setDeliveries] = useState<ApiDelivery[]>([]);
  const [deliveriesCount, setDeliveriesCount] = useState(0);
  const [deliveriesPage, setDeliveriesPage] = useState(1);
  const deliveriesPageSize = 5;
  const [deliveriesLoading, setDeliveriesLoading] = useState(false);

  const [stats, setStats] = useState<{ active_rides: number; active_deliveries: number; weekly_rides: number; weekly_deliveries: number } | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();
    const fetchRides = async () => {
      try {
        setRidesLoading(true);
        const params = new URLSearchParams({ page: String(ridesPage), page_size: String(ridesPageSize) });
        const { data } = await apiClient.get<{ count: number; results: ApiRide[] }>(`rides/list/?${params.toString()}`,
          { signal: controller.signal as AbortSignal });
        if (!ignore) { setRides(data.results); setRidesCount(data.count); }
      } finally { if (!ignore) setRidesLoading(false); }
    };
    fetchRides();
    return () => { ignore = true; controller.abort(); };
  }, [ridesPage]);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();
    const fetchDeliveries = async () => {
      try {
        setDeliveriesLoading(true);
        const params = new URLSearchParams({ page: String(deliveriesPage), page_size: String(deliveriesPageSize) });
        const { data } = await apiClient.get<{ count: number; results: ApiDelivery[] }>(`deliveries/list/?${params.toString()}`,
          { signal: controller.signal as AbortSignal });
        if (!ignore) { setDeliveries(data.results); setDeliveriesCount(data.count); }
      } finally { if (!ignore) setDeliveriesLoading(false); }
    };
    fetchDeliveries();
    return () => { ignore = true; controller.abort(); };
  }, [deliveriesPage]);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const [ridesStatsRes, deliveriesStatsRes] = await Promise.all([
          apiClient.get<{ active_rides: number; weekly_rides: number }>("rides/stats/", { signal: controller.signal as AbortSignal }),
          apiClient.get<{ active_deliveries: number; weekly_deliveries: number }>("deliveries/stats/", { signal: controller.signal as AbortSignal }),
        ]);
        if (!ignore) {
          setStats({
            active_rides: ridesStatsRes.data.active_rides,
            weekly_rides: ridesStatsRes.data.weekly_rides,
            active_deliveries: deliveriesStatsRes.data.active_deliveries,
            weekly_deliveries: deliveriesStatsRes.data.weekly_deliveries,
          });
        }
      } finally { if (!ignore) setStatsLoading(false); }
    };
    fetchStats();
    return () => { ignore = true; controller.abort(); };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
      case "shipping":
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
      case "shipping":
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
          value={statsLoading ? "…" : (stats?.active_rides ?? 0)}
          icon={Car}
          description="Currently ongoing"
        />
        <StatsCard
          title="Active Deliveries"
          value={statsLoading ? "…" : (stats?.active_deliveries ?? 0)}
          icon={Package}
          description="In transit"
        />
        <StatsCard
          title="Weekly Rides"
          value={statsLoading ? "…" : (stats?.weekly_rides ?? 0)}
          icon={Car}
          description="This week"
        />
        <StatsCard
          title="Weekly Deliveries"
          value={statsLoading ? "…" : (stats?.weekly_deliveries ?? 0)}
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
                {rides.map((ride) => (
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
                    <TableCell className="font-medium">{typeof ride.fare === 'number' ? `₱${ride.fare.toFixed(2)}` : ride.fare}</TableCell>
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

            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                {ridesLoading ? <span>Loading rides…</span> : <span>Showing {rides.length} of {ridesCount}</span>}
              </div>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" disabled={ridesPage === 1} onClick={() => setRidesPage(p => Math.max(1, p-1))}>Previous</Button>
                <Button variant="outline" size="sm" disabled={ridesPage * ridesPageSize >= ridesCount} onClick={() => setRidesPage(p => p+1)}>Next</Button>
              </div>
            </div>
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
                {deliveries.map((delivery) => (
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
                    <TableCell className="font-medium">{typeof delivery.fee === 'number' ? `₱${delivery.fee.toFixed(2)}` : delivery.fee}</TableCell>
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

            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                {deliveriesLoading ? <span>Loading deliveries…</span> : <span>Showing {deliveries.length} of {deliveriesCount}</span>}
              </div>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" disabled={deliveriesPage === 1} onClick={() => setDeliveriesPage(p => Math.max(1, p-1))}>Previous</Button>
                <Button variant="outline" size="sm" disabled={deliveriesPage * deliveriesPageSize >= deliveriesCount} onClick={() => setDeliveriesPage(p => p+1)}>Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}