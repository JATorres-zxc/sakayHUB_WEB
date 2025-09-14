import { useEffect, useMemo, useState } from "react";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Search, 
  FileCheck, 
  MessageSquare,
  Clock,
  User
} from "lucide-react";
import { DriverVerificationModal } from "@/components/DriverVerificationModal";
import apiClient from "@/lib/api.ts";

type ApiApplication = {
  id: number
  name: string
  email: string
  phone: string
  applied_at: string
  vehicle_type: string
  license_number: string
  status: string
}

type UiApplication = {
  id: number
  name: string
  email: string
  phone: string
  appliedDate: string
  appliedTime: string
  vehicleType: string
  licenseNumber: string
  status: string
}

type AppStats = {
  pending: number
  under_review: number
  approved_today: number
  total_month: number
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge className="status-pending">Pending</Badge>;
    case "under_review":
      return <Badge className="status-active">Under Review</Badge>;
    case "approved":
      return <Badge className="status-active">Approved</Badge>;
    case "rejected":
      return <Badge className="status-suspended">Rejected</Badge>;
    default:
      return <Badge className="status-inactive">{status}</Badge>;
  }
};

export default function DriverApplications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<UiApplication | null>(null);
  const [apiApps, setApiApps] = useState<ApiApplication[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [count, setCount] = useState(0);
  const [stats, setStats] = useState<AppStats | null>(null);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();
    const fetchApps = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
        const { data } = await apiClient.get<{ count: number; next: string | null; previous: string | null; results: ApiApplication[] }>(
          `drivers/applications/?${params.toString()}`,
          { signal: controller.signal as AbortSignal }
        );
        if (!ignore) {
          setApiApps(data.results);
          setCount(data.count);
        }
      } catch (e) {
        if (!ignore) setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchApps();
    return () => { ignore = true; controller.abort(); };
  }, [page, pageSize]);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();
    const fetchStats = async () => {
      try {
        const { data } = await apiClient.get<AppStats>(`drivers/applications/stats/`, { signal: controller.signal as AbortSignal });
        if (!ignore) setStats(data);
      } catch (e) {
        // ignore
      }
    };
    fetchStats();
    return () => { ignore = true; controller.abort(); };
  }, []);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(count / pageSize)), [count, pageSize]);

  const driverApplications: UiApplication[] = useMemo(() => {
    if (!apiApps) return [];
    return apiApps.map(a => {
      const d = new Date(a.applied_at);
      return {
        id: a.id,
        name: a.name,
        email: a.email,
        phone: a.phone,
        appliedDate: d.toISOString().slice(0,10),
        appliedTime: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        vehicleType: a.vehicle_type,
        licenseNumber: a.license_number,
        status: a.status,
      };
    });
  }, [apiApps]);

  const filteredApplications = driverApplications.filter(application => 
    application.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    application.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVerify = (application: UiApplication) => {
    setSelectedApplication(application);
  };

  const handleSendMessage = (application: UiApplication) => {
    // This would typically open a message composer
    console.log("Send message to:", application.name);
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold">{stats ? stats.pending : "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Under Review</p>
                <p className="text-2xl font-bold">{stats ? stats.under_review : "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Approved Today</p>
                <p className="text-2xl font-bold">{stats ? stats.approved_today : "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total This Month</p>
                <p className="text-2xl font-bold">{stats ? stats.total_month : "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search applications by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Driver Applications ({filteredApplications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <div className="text-sm text-muted-foreground">Loading applications...</div>}
          {error && <div className="text-sm text-destructive">{error}</div>}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Applied Date & Time</TableHead>
                <TableHead>Vehicle Type</TableHead>
                <TableHead>License Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.length === 0 && searchTerm.trim().length > 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-sm text-muted-foreground">
                    No driver applicant with "{searchTerm}"
                  </TableCell>
                </TableRow>
              ) : filteredApplications.map((application) => (
                <TableRow key={application.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{application.name}</div>
                      <div className="text-sm text-muted-foreground">
                        ID: {application.id}
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
                    <div>
                      <div className="text-sm font-medium">{application.appliedDate}</div>
                      <div className="text-sm text-muted-foreground">{application.appliedTime}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">{application.vehicleType}</span>
                  </TableCell>
                  <TableCell className="font-mono">
                    {application.licenseNumber}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      {getStatusBadge(application.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleVerify(application)}
                        className="gap-2"
                      >
                        <FileCheck className="w-4 h-4" />
                        Verify
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSendMessage(application)}
                        className="gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Message
                      </Button>
                    </div>
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

      {/* Verification Modal */}
      {selectedApplication && (
        <DriverVerificationModal
          application={selectedApplication}
          isOpen={!!selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
}