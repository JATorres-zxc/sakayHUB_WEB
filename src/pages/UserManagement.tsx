import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Users,
  MessageSquare,
  Calendar,
  FileText
} from "lucide-react";
import { DriverVerificationModal } from "@/components/DriverVerificationModal";

// Mock data for users
const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8901",
    status: "active",
    kycStatus: "verified",
    totalRides: 45,
    totalSpent: "$1,234.50",
    joinDate: "2024-01-15",
    lastActive: "2 hours ago"
  },
  {
    id: 2,
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    phone: "+1 234 567 8902",
    status: "active",
    kycStatus: "pending",
    totalRides: 23,
    totalSpent: "$567.80",
    joinDate: "2024-02-20",
    lastActive: "1 day ago"
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    phone: "+1 234 567 8903",
    status: "suspended",
    kycStatus: "verified",
    totalRides: 78,
    totalSpent: "$2,345.20",
    joinDate: "2023-11-10",
    lastActive: "3 days ago"
  },
  {
    id: 4,
    name: "Emma Davis",
    email: "emma.davis@example.com",
    phone: "+1 234 567 8904",
    status: "active",
    kycStatus: "rejected",
    totalRides: 12,
    totalSpent: "$234.70",
    joinDate: "2024-03-05",
    lastActive: "5 hours ago"
  },
  {
    id: 5,
    name: "Alex Brown",
    email: "alex.brown@example.com",
    phone: "+1 234 567 8905",
    status: "inactive",
    kycStatus: "verified",
    totalRides: 156,
    totalSpent: "$4,567.90",
    joinDate: "2023-08-22",
    lastActive: "2 weeks ago"
  },
];

// Mock data for drivers
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

// Mock data for driver applications
const driverApplications = [
  {
    id: 1,
    name: "Carlos Martinez",
    email: "carlos.martinez@example.com",
    phone: "+1 234 567 9001",
    applicationDate: "2024-03-25",
    applicationTime: "14:30",
    age: 29,
    vehicleType: "sedan",
    vehicleBrand: "Toyota Camry",
    vehicleYear: "2020",
    licenseNumber: "DL123456789",
    experience: "3 years",
    documents: {
      license: "/images/license-carlos.jpg",
      orCr: "/images/or-cr-carlos.jpg",
      insurance: "/images/insurance-carlos.jpg",
      photo: "/images/photo-carlos.jpg"
    },
    status: "pending"
  },
  {
    id: 2,
    name: "Anna Lopez",
    email: "anna.lopez@example.com",
    phone: "+1 234 567 9002",
    applicationDate: "2024-03-24",
    applicationTime: "10:15",
    age: 31,
    vehicleType: "motorcycle",
    vehicleBrand: "Honda Click",
    vehicleYear: "2022",
    licenseNumber: "DL987654321",
    experience: "5 years",
    documents: {
      license: "/images/license-anna.jpg",
      orCr: "/images/or-cr-anna.jpg",
      insurance: "/images/insurance-anna.jpg",
      photo: "/images/photo-anna.jpg"
    },
    status: "pending"
  },
  {
    id: 3,
    name: "Michael Torres",
    email: "michael.torres@example.com",
    phone: "+1 234 567 9003",
    applicationDate: "2024-03-23",
    applicationTime: "16:45",
    age: 35,
    vehicleType: "van",
    vehicleBrand: "Toyota Hiace",
    vehicleYear: "2019",
    licenseNumber: "DL456789123",
    experience: "7 years",
    documents: {
      license: "/images/license-michael.jpg",
      orCr: "/images/or-cr-michael.jpg",
      insurance: "/images/insurance-michael.jpg",
      photo: "/images/photo-michael.jpg"
    },
    status: "pending"
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="status-active">Active</Badge>;
    case "suspended":
      return <Badge className="status-suspended">Suspended</Badge>;
    case "inactive":
      return <Badge className="status-inactive">Inactive</Badge>;
    case "pending":
      return <Badge className="status-pending">Pending</Badge>;
    default:
      return <Badge className="status-inactive">{status}</Badge>;
  }
};

const getKycBadge = (status: string) => {
  switch (status) {
    case "verified":
      return <Badge className="status-active">Verified</Badge>;
    case "pending":
      return <Badge className="status-pending">Pending</Badge>;
    case "rejected":
      return <Badge className="status-suspended">Rejected</Badge>;
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

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("users");
  
  // Users filters
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [userStatusFilters, setUserStatusFilters] = useState<string[]>([]);
  const [userKycFilters, setUserKycFilters] = useState<string[]>([]);

  // Drivers filters
  const [driverSearchTerm, setDriverSearchTerm] = useState("");
  const [onlineFilters, setOnlineFilters] = useState<string[]>([]);
  const [driverStatusFilters, setDriverStatusFilters] = useState<string[]>([]);
  const [vehicleFilters, setVehicleFilters] = useState<string[]>([]);
  const [licenseFilters, setLicenseFilters] = useState<string[]>([]);

  // Applications filters
  const [applicationSearchTerm, setApplicationSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  // Filtered data
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(userSearchTerm.toLowerCase());
    const matchesStatus = userStatusFilters.length === 0 || userStatusFilters.includes(user.status);
    const matchesKyc = userKycFilters.length === 0 || userKycFilters.includes(user.kycStatus);
    
    return matchesSearch && matchesStatus && matchesKyc;
  });

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(driverSearchTerm.toLowerCase()) ||
                         driver.email.toLowerCase().includes(driverSearchTerm.toLowerCase());
    const matchesOnline = onlineFilters.length === 0 || 
                         (onlineFilters.includes("online") && driver.online) ||
                         (onlineFilters.includes("offline") && !driver.online);
    const matchesStatus = driverStatusFilters.length === 0 || driverStatusFilters.includes(driver.status);
    const matchesVehicle = vehicleFilters.length === 0 || vehicleFilters.includes(driver.vehicleType);
    const matchesLicense = licenseFilters.length === 0 || licenseFilters.includes(driver.licenseStatus);
    
    return matchesSearch && matchesOnline && matchesStatus && matchesVehicle && matchesLicense;
  });

  const filteredApplications = driverApplications.filter(application => {
    const matchesSearch = application.name.toLowerCase().includes(applicationSearchTerm.toLowerCase()) ||
                         application.email.toLowerCase().includes(applicationSearchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Filter handlers for users
  const toggleUserStatusFilter = (status: string) => {
    setUserStatusFilters(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const toggleUserKycFilter = (kyc: string) => {
    setUserKycFilters(prev =>
      prev.includes(kyc)
        ? prev.filter(k => k !== kyc)
        : [...prev, kyc]
    );
  };

  const clearUserFilters = () => {
    setUserStatusFilters([]);
    setUserKycFilters([]);
  };

  // Filter handlers for drivers
  const toggleOnlineFilter = (online: string) => {
    setOnlineFilters(prev =>
      prev.includes(online)
        ? prev.filter(o => o !== online)
        : [...prev, online]
    );
  };

  const toggleDriverStatusFilter = (status: string) => {
    setDriverStatusFilters(prev =>
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

  const clearDriverFilters = () => {
    setOnlineFilters([]);
    setDriverStatusFilters([]);
    setVehicleFilters([]);
    setLicenseFilters([]);
  };

  const hasUserActiveFilters = userStatusFilters.length > 0 || userKycFilters.length > 0;
  const hasDriverActiveFilters = onlineFilters.length > 0 || driverStatusFilters.length > 0 || 
                                vehicleFilters.length > 0 || licenseFilters.length > 0;

  const handleVerifyApplication = (application: any) => {
    setSelectedApplication(application);
    setIsVerificationModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, drivers, and driver applications
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="drivers" className="gap-2">
            <Car className="w-4 h-4" />
            Drivers
          </TabsTrigger>
          <TabsTrigger value="applications" className="gap-2">
            <FileText className="w-4 h-4" />
            Driver Applications
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Users</h2>
              <p className="text-sm text-muted-foreground">
                Manage customer accounts and KYC verification
              </p>
            </div>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </div>

          {/* Users Search and Filters */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="w-4 h-4" />
                      Filters
                      {hasUserActiveFilters && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {userStatusFilters.length + userKycFilters.length}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Filters</h4>
                        {hasUserActiveFilters && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={clearUserFilters}
                            className="text-muted-foreground"
                          >
                            Clear all
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-sm font-medium mb-2">Status</h5>
                          <div className="space-y-2">
                            {["active", "suspended", "inactive"].map((status) => (
                              <div key={status} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`user-status-${status}`}
                                  checked={userStatusFilters.includes(status)}
                                  onCheckedChange={() => toggleUserStatusFilter(status)}
                                />
                                <label
                                  htmlFor={`user-status-${status}`}
                                  className="text-sm capitalize cursor-pointer"
                                >
                                  {status}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium mb-2">KYC Status</h5>
                          <div className="space-y-2">
                            {["verified", "pending", "rejected"].map((kyc) => (
                              <div key={kyc} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`user-kyc-${kyc}`}
                                  checked={userKycFilters.includes(kyc)}
                                  onCheckedChange={() => toggleUserKycFilter(kyc)}
                                />
                                <label
                                  htmlFor={`user-kyc-${kyc}`}
                                  className="text-sm capitalize cursor-pointer"
                                >
                                  {kyc}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Users ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>KYC</TableHead>
                    <TableHead>Rides</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            ID: {user.id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{user.email}</div>
                          <div className="text-sm text-muted-foreground">{user.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          {getStatusBadge(user.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          {getKycBadge(user.kycStatus)}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">
                        {user.totalRides}
                      </TableCell>
                      <TableCell className="font-mono">
                        {user.totalSpent}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.lastActive}
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
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Edit className="w-4 h-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Verify KYC
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-destructive">
                              <Ban className="w-4 h-4" />
                              Suspend User
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
        </TabsContent>

        {/* Drivers Tab */}
        <TabsContent value="drivers" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Drivers</h2>
              <p className="text-sm text-muted-foreground">
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

          {/* Drivers Search and Filters */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search drivers by name or email..."
                    value={driverSearchTerm}
                    onChange={(e) => setDriverSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="w-4 h-4" />
                      Filters
                      {hasDriverActiveFilters && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {onlineFilters.length + driverStatusFilters.length + vehicleFilters.length + licenseFilters.length}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Filters</h4>
                        {hasDriverActiveFilters && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={clearDriverFilters}
                            className="text-muted-foreground"
                          >
                            Clear all
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-sm font-medium mb-2">Online Status</h5>
                          <div className="space-y-2">
                            {["online", "offline"].map((online) => (
                              <div key={online} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`online-${online}`}
                                  checked={onlineFilters.includes(online)}
                                  onCheckedChange={() => toggleOnlineFilter(online)}
                                />
                                <label
                                  htmlFor={`online-${online}`}
                                  className="text-sm capitalize cursor-pointer"
                                >
                                  {online}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium mb-2">Status</h5>
                          <div className="space-y-2">
                            {["active", "suspended", "pending"].map((status) => (
                              <div key={status} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`driver-status-${status}`}
                                  checked={driverStatusFilters.includes(status)}
                                  onCheckedChange={() => toggleDriverStatusFilter(status)}
                                />
                                <label
                                  htmlFor={`driver-status-${status}`}
                                  className="text-sm capitalize cursor-pointer"
                                >
                                  {status}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium mb-2">Vehicle Type</h5>
                          <div className="space-y-2">
                            {["sedan", "suv", "motorcycle", "van"].map((vehicle) => (
                              <div key={vehicle} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`vehicle-${vehicle}`}
                                  checked={vehicleFilters.includes(vehicle)}
                                  onCheckedChange={() => toggleVehicleFilter(vehicle)}
                                />
                                <label
                                  htmlFor={`vehicle-${vehicle}`}
                                  className="text-sm capitalize cursor-pointer"
                                >
                                  {vehicle}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium mb-2">License Status</h5>
                          <div className="space-y-2">
                            {["verified", "pending", "processing", "rejected"].map((license) => (
                              <div key={license} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`license-${license}`}
                                  checked={licenseFilters.includes(license)}
                                  onCheckedChange={() => toggleLicenseFilter(license)}
                                />
                                <label
                                  htmlFor={`license-${license}`}
                                  className="text-sm capitalize cursor-pointer"
                                >
                                  {license}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
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
                              View Details
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
        </TabsContent>

        {/* Driver Applications Tab */}
        <TabsContent value="applications" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Driver Applications</h2>
              <p className="text-sm text-muted-foreground">
                Review and verify new driver applications
              </p>
            </div>
          </div>

          {/* Applications Search */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search applications by name or email..."
                    value={applicationSearchTerm}
                    onChange={(e) => setApplicationSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Applications Table */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Applications ({filteredApplications.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Application Date</TableHead>
                    <TableHead>Vehicle Type</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application) => (
                    <TableRow key={application.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <div className="font-medium">{application.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Age: {application.age}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{application.email}</div>
                          <div className="text-sm text-muted-foreground">{application.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <div>
                            <div className="text-sm">{application.applicationDate}</div>
                            <div className="text-xs text-muted-foreground">{application.applicationTime}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getVehicleIcon(application.vehicleType)}
                          <span className="capitalize">{application.vehicleType}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {application.experience}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="gap-2"
                            onClick={() => handleVerifyApplication(application)}
                          >
                            <CheckCircle className="w-3 h-3" />
                            Verify
                          </Button>
                          <Button size="sm" variant="outline" className="gap-2">
                            <MessageSquare className="w-3 h-3" />
                            Message
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Driver Verification Modal */}
      <DriverVerificationModal
        application={selectedApplication}
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
      />
    </div>
  );
}