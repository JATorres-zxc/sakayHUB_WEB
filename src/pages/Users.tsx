import { useState } from "react";
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
  RotateCcw
} from "lucide-react";

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

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="status-active">Active</Badge>;
    case "suspended":
      return <Badge className="status-suspended">Suspended</Badge>;
    case "inactive":
      return <Badge className="status-inactive">Inactive</Badge>;
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

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [kycFilters, setKycFilters] = useState<string[]>([]);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilters.length === 0 || statusFilters.includes(user.status);
    const matchesKyc = kycFilters.length === 0 || kycFilters.includes(user.kycStatus);
    
    return matchesSearch && matchesStatus && matchesKyc;
  });

  const toggleStatusFilter = (status: string) => {
    setStatusFilters(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const toggleKycFilter = (kyc: string) => {
    setKycFilters(prev =>
      prev.includes(kyc)
        ? prev.filter(k => k !== kyc)
        : [...prev, kyc]
    );
  };

  const clearFilters = () => {
    setStatusFilters([]);
    setKycFilters([]);
  };

  const hasActiveFilters = statusFilters.length > 0 || kycFilters.length > 0;

  const handleSuspendClick = (user: any) => {
    setSelectedUser(user);
    setSuspendModalOpen(true);
  };

  const handleSuspendConfirm = () => {
    // Here you would typically make an API call to suspend/unsuspend the user
    console.log(`${selectedUser?.status === 'suspended' ? 'Unsuspending' : 'Suspending'} user:`, selectedUser?.name);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage customer accounts and KYC verification
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search users by name or email..."
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
                      {statusFilters.length + kycFilters.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
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
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-medium mb-2">Status</h5>
                      <div className="space-y-2">
                        {["active", "suspended", "inactive"].map((status) => (
                          <div key={status} className="flex items-center space-x-2">
                            <Checkbox
                              id={`status-${status}`}
                              checked={statusFilters.includes(status)}
                              onCheckedChange={() => toggleStatusFilter(status)}
                            />
                            <label
                              htmlFor={`status-${status}`}
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
                              id={`kyc-${kyc}`}
                              checked={kycFilters.includes(kyc)}
                              onCheckedChange={() => toggleKycFilter(kyc)}
                            />
                            <label
                              htmlFor={`kyc-${kyc}`}
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
                        <DropdownMenuItem 
                          className={`gap-2 ${user.status === 'suspended' ? '' : 'text-destructive'}`}
                          onClick={() => handleSuspendClick(user)}
                        >
                          {user.status === 'suspended' ? (
                            <>
                              <RotateCcw className="w-4 h-4" />
                              Unsuspend User
                            </>
                          ) : (
                            <>
                              <Ban className="w-4 h-4" />
                              Suspend User
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
        </CardContent>
      </Card>

      <SuspendConfirmModal
        isOpen={suspendModalOpen}
        onClose={() => setSuspendModalOpen(false)}
        type="user"
        action={selectedUser?.status === 'suspended' ? 'unsuspend' : 'suspend'}
        name={selectedUser?.name || ''}
        onConfirm={handleSuspendConfirm}
      />
    </div>
  );
}