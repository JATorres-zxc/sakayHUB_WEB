import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Phone, 
  Mail, 
  Car, 
  FileText, 
  CheckCircle,
  X,
  Calendar,
  MapPin
} from "lucide-react";
import { useToast } from "@/lib/toast";

interface DriverVerificationModalProps {
  application: any;
  isOpen: boolean;
  onClose: () => void;
}

export function DriverVerificationModal({ 
  application, 
  isOpen, 
  onClose 
}: DriverVerificationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success } = useToast();

  const handleVerify = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    success(
      "Driver Verified",
      `${application.name} has been successfully verified and approved as a driver.`
    );
    
    setIsSubmitting(false);
    onClose();
  };

  const mockDocuments = [
    { name: "Driver's License", url: "/placeholder.svg", verified: true },
    { name: "Vehicle Registration (OR/CR)", url: "/placeholder.svg", verified: true },
    { name: "Vehicle Insurance", url: "/placeholder.svg", verified: false },
    { name: "Profile Photo", url: "/placeholder.svg", verified: true },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Driver Application Verification
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Applicant Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{application.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{application.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{application.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Age</p>
                      <p className="font-medium">28 years old</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">123 Main St, Manila, Philippines</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">License Number</p>
                      <p className="font-medium font-mono">{application.licenseNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-4 h-4" />
                Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Vehicle Type</p>
                    <p className="font-medium capitalize">{application.vehicleType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Make & Model</p>
                    <p className="font-medium">Toyota Vios 2020</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Plate Number</p>
                    <p className="font-medium font-mono">ABC 1234</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Color</p>
                    <p className="font-medium">White</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Year</p>
                    <p className="font-medium">2020</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Seating Capacity</p>
                    <p className="font-medium">4 passengers</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Verification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Document Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {mockDocuments.map((doc, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{doc.name}</h4>
                      {doc.verified ? (
                        <Badge className="status-active gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge className="status-pending gap-1">
                          <X className="w-3 h-3" />
                          Pending
                        </Badge>
                      )}
                    </div>
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                      <img 
                        src={doc.url} 
                        alt={doc.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleVerify}
              disabled={isSubmitting}
              className="gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {isSubmitting ? "Verifying..." : "Verify & Approve"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}