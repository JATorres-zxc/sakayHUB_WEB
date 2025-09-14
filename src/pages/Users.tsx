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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";
import { useToast } from "@/lib/toast";
import apiClient from "@/lib/api";

type ApiUser = {
  id: number
  name: string
  email: string
  phone: string
  status: "active" | "suspended" | "inactive" | string
  kyc_status: "verified" | "pending" | "rejected" | string
  total_rides: number
  total_spent: string | number
  join_date: string
  last_active: string
}

type UiUser = {
  id: number
  name: string
  email: string
  phone: string
  status: string
  kycStatus: string
  totalRides: number
  totalSpent: string
  joinDate: string
  lastActive: string
}

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
  const [apiUsers, setApiUsers] = useState<ApiUser[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [count, setCount] = useState(0);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [kycFilters, setKycFilters] = useState<string[]>([]);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
        if (searchTerm.trim()) params.set("search", searchTerm.trim());
        const { data } = await apiClient.get<{ count: number; next: string | null; previous: string | null; results: ApiUser[] }>(
          `users/list/?${params.toString()}`,
          { signal: controller.signal as any }
        );
        if (!ignore) {
          setApiUsers(data.results);
          setCount(data.count);
        }
      } catch (e: any) {
        if (!ignore) setError(e?.message ?? "Unknown error");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchUsers();
    return () => { ignore = true; controller.abort(); };
  }, [page, pageSize, searchTerm]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(count / pageSize)), [count, pageSize]);

  const users: UiUser[] = useMemo(() => {
    if (!apiUsers) return [];
    return apiUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      status: u.status,
      kycStatus: u.kyc_status,
      totalRides: u.total_rides,
      totalSpent: typeof u.total_spent === "number" ? `$${u.total_spent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : u.total_spent,
      joinDate: new Date(u.join_date).toISOString().slice(0, 10),
      lastActive: new Date(u.last_active).toLocaleString(),
    }));
  }, [apiUsers]);

  const filteredUsers = users.filter(user => {
    const matchesStatus = statusFilters.length === 0 || statusFilters.includes(user.status);
    const matchesKyc = kycFilters.length === 0 || kycFilters.includes(user.kycStatus);
    return matchesStatus && matchesKyc;
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

  const handleSuspendConfirm = async () => {
    if (!selectedUser) return;
    const action = selectedUser.status === "suspended" ? "unsuspend" : "suspend";

    try {
      // Ensure CSRF token
      let csrftoken = "";
      try {
        const { data: csrfData } = await apiClient.get("users/csrf/");
        csrftoken = (csrfData as any)?.csrftoken || "";
      } catch {}

      const { data: updated } = await apiClient.post(
        `users/${selectedUser.id}/${action}/`,
        {},
        { headers: { "X-CSRFToken": csrftoken } }
      );
      setApiUsers((prev) =>
        Array.isArray(prev)
          ? prev.map((u) => (u.id === updated.id ? updated : u))
          : prev
      );

      success(
        action === "suspend" ? "User suspended" : "User unsuspended",
        `${updated.name} is now ${updated.status}.`
      );
      setSuspendModalOpen(false);
      setSelectedUser(null);
    } catch (e: any) {
      toastError("Network error", e?.message || "Please try again");
    }
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
        {/* <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add User
        </Button> */}
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
                    <AccordionItem value="status">
                      <AccordionTrigger className="text-sm">Status</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {["active", "suspended", "inactive"].map((status) => (
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
                    <AccordionItem value="kyc">
                      <AccordionTrigger className="text-sm">KYC Status</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {["verified", "pending", "rejected"].map((kyc) => (
                            <div key={kyc} className="flex items-center space-x-2">
                              <Checkbox
                                id={`kyc-${kyc}`}
                                checked={kycFilters.includes(kyc)}
                                onCheckedChange={() => toggleKycFilter(kyc)}
                              />
                              <label htmlFor={`kyc-${kyc}`} className="text-sm capitalize cursor-pointer">
                                {kyc}
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

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({count})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <div className="text-sm text-muted-foreground">Loading users...</div>}
          {error && <div className="text-sm text-destructive">{error}</div>}
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
              {filteredUsers.length === 0 && searchTerm.trim().length > 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-sm text-muted-foreground">
                    No user with "{searchTerm}"
                  </TableCell>
                </TableRow>
              ) : filteredUsers.map((user) => (
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

          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1); }}
                  />
                </PaginationItem>
                {/* Simple numeric pages for first/last + current neighbors */}
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