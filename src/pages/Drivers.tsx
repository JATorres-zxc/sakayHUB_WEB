import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Star
} from "lucide-react";

const drivers = [
  {
    id: 1,
    name: "David Rodriguez",
    email: "david.rodriguez@example.com",
    phone: "+1 234 567 8901",
    status: "active",
    vehicleType: "sedan",
    licenseStatus: "verified",
    rating: 4.8,
    totalRides: 234,
    earnings: "$3,456.80",
    online: true,
    joinDate: "2024-01-10",
    lastActive: "Online"
  },
  {
    id: 2,
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    phone: "+1 234 567 8902",
    status: "active",
    vehicleType: "suv",
    licenseStatus: "pending",
    rating: 4.9,
    totalRides: 189,
    earnings: "$2,789.50",
    online: false,
    joinDate: "2024-02-15",
    lastActive: "2 hours ago"
  },
  {
    id: 3,
    name: "James Wilson",
    email: "james.wilson@example.com",
    phone: "+1 234 567 8903",
    status: "suspended",
    vehicleType: "motorcycle",
    licenseStatus: "verified",
    rating: 4.2,
    totalRides: 456,
    earnings: "$5,234.20",
    online: false,
    joinDate: "2023-11-20",
    lastActive: "1 week ago"
  },
  {
    id: 4,
    name: "Lisa Thompson",
    email: "lisa.thompson@example.com",
    phone: "+1 234 567 8904",
    status: "active",
    vehicleType: "van",
    licenseStatus: "verified",
    rating: 4.7,
    totalRides: 123,
    earnings: "$1,867.30",
    online: true,
    joinDate: "2024-03-01",
    lastActive: "Online"
  },
  {
    id: 5,
    name: "Robert Chen",
    email: "robert.chen@example.com",
    phone: "+1 234 567 8905",
    status: "pending",
    vehicleType: "sedan",
    licenseStatus: "processing",
    rating: 0,
    totalRides: 0,
    earnings: "$0.00",
    online: false,
    joinDate: "2024-03-20",
    lastActive: "Never"
  },
];

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

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Driver
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Online Drivers</p>
                <p className="text-2xl font-bold">156</p>
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
                <p className="text-2xl font-bold">1,234</p>
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
                <p className="text-2xl font-bold">4.7</p>
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
                <p className="text-2xl font-bold">$45.2K</p>
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
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Drivers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Drivers ({filteredDrivers.length})</CardTitle>
        </CardHeader>
        <CardContent>
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
              {filteredDrivers.map((driver) => (
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
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <Ban className="w-4 h-4" />
                          Suspend Driver
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}