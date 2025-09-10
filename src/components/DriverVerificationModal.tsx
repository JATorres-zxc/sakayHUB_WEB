import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  X,
  User,
  Car,
  CreditCard,
  FileText,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock
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
  const [isVerifying, setIsVerifying] = useState(false);
  const { success, error } = useToast();

  if (!application) return null;

  const handleVerifyDriver = async () => {
    setIsVerifying(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      success(`${application.name} has been verified and approved as a driver.`);
      onClose();
    }, 2000);
  };

  const handleRejectApplication = () => {
    error(`Application for ${application.name} has been rejected.`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Driver Application Verification
          </DialogTitle>
          <DialogDescription>
            Review all application details and documents before approving
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Application Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold">{application.name}</h3>
              <p className="text-muted-foreground">{application.email}</p>
            </div>
            <Badge className="status-pending">Pending Review</Badge>
          </div>

          <Separator />

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="font-medium">{application.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Age</label>
                  <p className="font-medium">{application.age} years old</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <p>{application.email}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <p>{application.phone}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Application Date</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <p>{application.applicationDate}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Application Time</label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <p>{application.applicationTime}</p>
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
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Vehicle Type</label>
                  <p className="font-medium capitalize">{application.vehicleType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Brand & Model</label>
                  <p className="font-medium">{application.vehicleBrand}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Year</label>
                  <p className="font-medium">{application.vehicleYear}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Driving Experience</label>
                  <p className="font-medium">{application.experience}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* License Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                License Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="text-sm font-medium text-muted-foreground">License Number</label>
                <p className="font-medium font-mono">{application.licenseNumber}</p>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Required Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Driver's License</span>
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Uploaded
                      </Badge>
                    </div>
                    <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">License Document</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Vehicle OR/CR</span>
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Uploaded
                      </Badge>
                    </div>
                    <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">OR/CR Document</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Insurance</span>
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Uploaded
                      </Badge>
                    </div>
                    <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Insurance Document</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Profile Photo</span>
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Uploaded
                      </Badge>
                    </div>
                    <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center">
                      <div className="text-center">
                        <User className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Profile Photo</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleVerifyDriver}
              disabled={isVerifying}
              className="flex-1 gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {isVerifying ? "Verifying..." : "Verify & Approve Driver"}
            </Button>
            <Button 
              variant="destructive"
              onClick={handleRejectApplication}
              className="flex-1 gap-2"
            >
              <X className="w-4 h-4" />
              Reject Application
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}