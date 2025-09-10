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
  Search, 
  FileCheck, 
  MessageSquare,
  Clock,
  User
} from "lucide-react";
import { DriverVerificationModal } from "@/components/DriverVerificationModal";

const driverApplications = [
  {
    id: 1,
    name: "Carlos Martinez",
    email: "carlos.martinez@example.com",
    phone: "+1 234 567 8901",
    appliedDate: "2024-03-22",
    appliedTime: "10:30 AM",
    vehicleType: "sedan",
    licenseNumber: "DL123456789",
    status: "pending"
  },
  {
    id: 2,
    name: "Anna Kim",
    email: "anna.kim@example.com",
    phone: "+1 234 567 8902",
    appliedDate: "2024-03-21",
    appliedTime: "2:15 PM",
    vehicleType: "suv",
    licenseNumber: "DL987654321",
    status: "pending"
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "+1 234 567 8903",
    appliedDate: "2024-03-20",
    appliedTime: "4:45 PM",
    vehicleType: "motorcycle",
    licenseNumber: "DL456789123",
    status: "under_review"
  },
  {
    id: 4,
    name: "Sophie Chen",
    email: "sophie.chen@example.com",
    phone: "+1 234 567 8904",
    appliedDate: "2024-03-19",
    appliedTime: "11:20 AM",
    vehicleType: "van",
    licenseNumber: "DL789123456",
    status: "pending"
  },
];

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
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  const filteredApplications = driverApplications.filter(application => 
    application.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    application.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVerify = (application: any) => {
    setSelectedApplication(application);
  };

  const handleSendMessage = (application: any) => {
    // This would typically open a message composer
    console.log("Send message to:", application.name);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      {/* <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Driver Applications</h2>
          <p className="text-muted-foreground">
            Review and verify new driver applications
          </p>
        </div>
      </div> */}

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold">12</p>
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
                <p className="text-2xl font-bold">8</p>
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
                <p className="text-2xl font-bold">5</p>
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
                <p className="text-2xl font-bold">47</p>
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