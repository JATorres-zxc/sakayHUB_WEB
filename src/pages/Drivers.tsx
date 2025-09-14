import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SuspendConfirmModal from "@/components/SuspendConfirmModal";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  Car,
  DollarSign,
  Star,
  RotateCcw
} from "lucide-react";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DriverApplications from "./DriverApplications";
import { useToast } from "@/lib/toast";
import apiClient from "@/lib/api.ts";

type ApiDriver = {
  id: number
  name: string
  email: string
  phone: string
  status: string
  vehicle_type: string
  license_status: string
  rating: number
  total_rides: number
  earnings: number | string
  online: boolean
  join_date: string
  last_active: string
}

type UiDriver = {
  id: number
  name: string
  email: string
  phone: string
  status: string
  vehicleType: string
  licenseStatus: string
  rating: number
  totalRides: number
  earnings: string
  online: boolean
  joinDate: string
  lastActive: string
}

type DriverStats = {
  online: number
  verified: number
  avg_rating: number
  total_earnings: number
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="status-active">Active</Badge>;
    case "suspended":
      return <Badge className="status-suspended">Suspended</Badge>;
    case "pending":
      return <Badge className="status-pending">Pending</Badge>;
    default:
      return <Badge className="status-inactive">{status}</Badge>;
  }
};

const getLicenseBadge = (status: string) => {
  switch (status) {
    case "verified":
      return <Badge className="status-active">Verified</Badge>;
    case "pending":
    case "processing":
      return <Badge className="status-pending">Processing</Badge>;
    case "rejected":
      return <Badge className="status-suspended">Rejected</Badge>;
    default:
      return <Badge className="status-inactive">{status}</Badge>;
  }
};

const getVehicleIcon = (type: string) => {
  return <Car className="w-4 h-4" />;
};

export default function Drivers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [apiDrivers, setApiDrivers] = useState<ApiDriver[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [count, setCount] = useState(0);
  const [stats, setStats] = useState<DriverStats | null>(null);
  const [onlineFilters, setOnlineFilters] = useState<string[]>([]);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [vehicleFilters, setVehicleFilters] = useState<string[]>([]);
  const [licenseFilters, setLicenseFilters] = useState<string[]>([]);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<UiDriver | null>(null);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
        if (searchTerm.trim()) params.set("search", searchTerm.trim());
        const { data } = await apiClient.get<{ count: number; next: string | null; previous: string | null; results: ApiDriver[] }>(
          `drivers/list/?${params.toString()}`,
          { signal: controller.signal as AbortSignal }
        );
        if (!ignore) {
          setApiDrivers(data.results);
          setCount(data.count);
        }
      } catch (e) {
        if (!ignore) setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchDrivers();
    return () => { ignore = true; controller.abort(); };
  }, [page, pageSize, searchTerm]);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();
    const fetchStats = async () => {
      try {
        const { data } = await apiClient.get<DriverStats>(`drivers/stats/`, { signal: controller.signal as AbortSignal });
        if (!ignore) setStats(data);
      } catch (e) {
        // leave stats as null on error
      }
    };
    fetchStats();
    return () => { ignore = true; controller.abort(); };
  }, []);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(count / pageSize)), [count, pageSize]);

  const drivers: UiDriver[] = useMemo(() => {
    if (!apiDrivers) return [];
    return apiDrivers.map((d) => ({
      id: d.id,
      name: d.name,
      email: d.email,
      phone: d.phone,
      status: d.status,
      vehicleType: d.vehicle_type,
      licenseStatus: d.license_status,
      rating: d.rating,
      totalRides: d.total_rides,
      earnings: typeof d.earnings === "number" ? `$${d.earnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : d.earnings,
      online: d.online,
      joinDate: new Date(d.join_date).toISOString().slice(0, 10),
      lastActive: new Date(d.last_active).toLocaleString(),
    }));
  }, [apiDrivers]);

  const filteredDrivers = drivers.filter(driver => {
    const matchesOnline = onlineFilters.length === 0 || 
                         (onlineFilters.includes("online") && driver.online) ||
                         (onlineFilters.includes("offline") && !driver.online);
    const matchesStatus = statusFilters.length === 0 || statusFilters.includes(driver.status);
    const matchesVehicle = vehicleFilters.length === 0 || vehicleFilters.includes(driver.vehicleType);
    const matchesLicense = licenseFilters.length === 0 || licenseFilters.includes(driver.licenseStatus);
    return matchesOnline && matchesStatus && matchesVehicle && matchesLicense;
  });

  const toggleOnlineFilter = (online: string) => {
    setOnlineFilters(prev =>
      prev.includes(online)
        ? prev.filter(o => o !== online)
        : [...prev, online]
    );
  };

  const toggleStatusFilter = (status: string) => {
    setStatusFilters(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const toggleVehicleFilter = (vehicle: string) => {
    setVehicleFilters(prev =>
      prev.includes(vehicle)
        ? prev.filter(v => v !== vehicle)
        : [...prev, vehicle]
    );
  };

  const toggleLicenseFilter = (license: string) => {
    setLicenseFilters(prev =>
      prev.includes(license)
        ? prev.filter(l => l !== license)
        : [...prev, license]
    );
  };

  const clearFilters = () => {
    setOnlineFilters([]);
    setStatusFilters([]);
    setVehicleFilters([]);
    setLicenseFilters([]);
  };

  const hasActiveFilters = onlineFilters.length > 0 || statusFilters.length > 0 || 
                          vehicleFilters.length > 0 || licenseFilters.length > 0;

  const handleSuspendClick = (driver: UiDriver) => {
    setSelectedDriver(driver);
    setSuspendModalOpen(true);
  };

  const handleSuspendConfirm = async () => {
    if (!selectedDriver) return;
    const action = selectedDriver.status === "suspended" ? "unsuspend" : "suspend";

    try {
      // Ensure CSRF token (users app provides the endpoint)
      let csrftoken = "";
      try {
        const { data: csrfData } = await apiClient.get<{ csrftoken?: string }>("users/csrf/");
        csrftoken = csrfData?.csrftoken || "";
      } catch {
        /* ignore */
      }

      const { data: updated } = await apiClient.post<ApiDriver>(
        `drivers/${selectedDriver.id}/${action}/`,
        {},
        { headers: { "X-CSRFToken": csrftoken } }
      );
      setApiDrivers((prev) =>
        Array.isArray(prev)
          ? prev.map((d) => (d.id === updated.id ? updated : d))
          : prev
      );

      success(
        action === "suspend" ? "Driver suspended" : "Driver unsuspended",
        `${updated.name} is now ${updated.status}.`
      );
      setSuspendModalOpen(false);
      setSelectedDriver(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Please try again";
      toastError("Network error", message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Drivers</h1>
          <p className="text-muted-foreground">
            Manage driver accounts, vehicles, and documentation
          </p>
        </div>
        {/* <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Driver
        </Button> */}
      </div>

      <Tabs defaultValue="drivers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="applications">Driver Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="drivers" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Online Drivers</p>
                    <p className="text-2xl font-bold">{stats ? stats.online : "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Verified</p>
                    <p className="text-2xl font-bold">{stats ? stats.verified : "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Avg Rating</p>
                    <p className="text-2xl font-bold">{stats ? stats.avg_rating.toFixed(1) : "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Total Earnings</p>
                    <p className="text-2xl font-bold">{stats ? `$${stats.total_earnings.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search drivers by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="w-4 h-4" />
                      Filters
                      {hasActiveFilters && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {onlineFilters.length + statusFilters.length + vehicleFilters.length + licenseFilters.length}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 max-h-80 overflow-y-auto" align="end">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Filters</h4>
                        {hasActiveFilters && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={clearFilters}
                            className="text-muted-foreground"
                          >
                            Clear all
                          </Button>
                        )}
                      </div>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="online">
                          <AccordionTrigger className="text-sm">Online Status</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              {["online", "offline"].map((online) => (
                                <div key={online} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`online-${online}`}
                                    checked={onlineFilters.includes(online)}
                                    onCheckedChange={() => toggleOnlineFilter(online)}
                                  />
                                  <label htmlFor={`online-${online}`} className="text-sm capitalize cursor-pointer">
                                    {online}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="status">
                          <AccordionTrigger className="text-sm">Status</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              {["active", "suspended", "pending"].map((status) => (
                                <div key={status} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`status-${status}`}
                                    checked={statusFilters.includes(status)}
                                    onCheckedChange={() => toggleStatusFilter(status)}
                                  />
                                  <label htmlFor={`status-${status}`} className="text-sm capitalize cursor-pointer">
                                    {status}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="vehicle">
                          <AccordionTrigger className="text-sm">Vehicle Type</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              {["sedan", "suv", "motorcycle", "van"].map((vehicle) => (
                                <div key={vehicle} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`vehicle-${vehicle}`}
                                    checked={vehicleFilters.includes(vehicle)}
                                    onCheckedChange={() => toggleVehicleFilter(vehicle)}
                                  />
                                  <label htmlFor={`vehicle-${vehicle}`} className="text-sm capitalize cursor-pointer">
                                    {vehicle}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="license">
                          <AccordionTrigger className="text-sm">License Status</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              {["verified", "pending", "processing", "rejected"].map((license) => (
                                <div key={license} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`license-${license}`}
                                    checked={licenseFilters.includes(license)}
                                    onCheckedChange={() => toggleLicenseFilter(license)}
                                  />
                                  <label htmlFor={`license-${license}`} className="text-sm capitalize cursor-pointer">
                                    {license}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
          </Card>

          {/* Drivers Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Drivers ({count})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && <div className="text-sm text-muted-foreground">Loading drivers...</div>}
              {error && <div className="text-sm text-destructive">{error}</div>}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Driver</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>License</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Rides</TableHead>
                    <TableHead>Earnings</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDrivers.length === 0 && searchTerm.trim().length > 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center text-sm text-muted-foreground">
                        No driver with "{searchTerm}"
                      </TableCell>
                    </TableRow>
                  ) : filteredDrivers.map((driver) => (
                    <TableRow key={driver.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${driver.online ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <div>
                            <div className="font-medium">{driver.name}</div>
                            <div className="text-sm text-muted-foreground">
                              ID: {driver.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{driver.email}</div>
                          <div className="text-sm text-muted-foreground">{driver.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          {getStatusBadge(driver.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getVehicleIcon(driver.vehicleType)}
                          <span className="capitalize">{driver.vehicleType}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          {getLicenseBadge(driver.licenseStatus)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {driver.rating > 0 ? (
                          <div className="flex items-center justify-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-mono">{driver.rating}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono">
                        {driver.totalRides}
                      </TableCell>
                      <TableCell className="font-mono">
                        {driver.earnings}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {driver.lastActive}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2">
                              <Eye className="w-4 h-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Edit className="w-4 h-4" />
                              Edit Driver
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Verify License
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className={`gap-2 ${driver.status === 'suspended' ? '' : 'text-destructive'}`}
                              onClick={() => handleSuspendClick(driver)}
                            >
                              {driver.status === 'suspended' ? (
                                <>
                                  <RotateCcw className="w-4 h-4" />
                                  Unsuspend Driver
                                </>
                              ) : (
                                <>
                                  <Ban className="w-4 h-4" />
                                  Suspend Driver
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1); }}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), Math.min(totalPages, page + 2)).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === page}
                      onClick={(e) => { e.preventDefault(); setPage(p); }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => { e.preventDefault(); if (page < totalPages) setPage(page + 1); }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="applications" className="space-y-0">
      <DriverApplications />
    </TabsContent>
  </Tabs>

  <SuspendConfirmModal
    isOpen={suspendModalOpen}
    onClose={() => setSuspendModalOpen(false)}
    type="driver"
    action={selectedDriver?.status === 'suspended' ? 'unsuspend' : 'suspend'}
    name={selectedDriver?.name || ''}
    onConfirm={handleSuspendConfirm}
  />
    </div>
  );
}