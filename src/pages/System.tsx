import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, MapPin, Percent, AlertTriangle, Smartphone, Shield, Gift } from "lucide-react";
import { CreatePromoModal } from "@/components/CreatePromoModal";
import { useState } from "react";

const System = () => {
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const mockPromoCodes = [
    { id: "WELCOME20", type: "Discount", value: "20%", usage: "128/500", expiry: "2024-03-15", status: "active" },
    { id: "FIRSTRIDE", type: "Free Ride", value: "$10", usage: "45/100", expiry: "2024-02-28", status: "active" },
    { id: "HOLIDAY50", type: "Discount", value: "50%", usage: "890/1000", expiry: "2024-01-31", status: "expired" },
    { id: "REFER25", type: "Referral", value: "$25", usage: "234/∞", expiry: "No expiry", status: "active" },
  ];

  const mockVersions = [
    { platform: "iOS", current: "2.1.3", latest: "2.1.4", users: "85%", forceUpdate: true },
    { platform: "Android", current: "2.1.2", latest: "2.1.4", users: "78%", forceUpdate: false },
    { platform: "Driver iOS", current: "1.8.1", latest: "1.8.2", users: "92%", forceUpdate: true },
    { platform: "Driver Android", current: "1.8.0", latest: "1.8.2", users: "88%", forceUpdate: false },
  ];

  const mockGeoZones = [
    { id: "ZONE001", name: "Downtown Core", type: "Surge Zone", multiplier: "1.8x", status: "active" },
    { id: "ZONE002", name: "Airport Area", type: "Special Zone", multiplier: "2.2x", status: "active" },
    { id: "ZONE003", name: "University District", type: "Student Zone", multiplier: "0.9x", status: "active" },
    { id: "ZONE004", name: "Industrial Area", type: "Limited Zone", multiplier: "1.0x", status: "inactive" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'inactive': case 'expired': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">System Settings</h1>
          <p className="text-muted-foreground">Configure pricing, zones, promos, and app settings</p>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Advanced Settings
        </Button>
      </div>

      {/* System Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Zones</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 surge zones active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Promos</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">2 expiring soon</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">App Version</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.1.4</div>
            <p className="text-xs text-muted-foreground">Latest stable release</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SOS Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Active emergency cases</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pricing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pricing">Pricing & Zones</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="emergency">Emergency & SOS</TabsTrigger>
          <TabsTrigger value="versions">App Versions</TabsTrigger>
        </TabsList>

        <TabsContent value="pricing" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5" />
                  Surge Pricing Settings
                </CardTitle>
                <CardDescription>Configure dynamic pricing rules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Base Surge Multiplier</label>
                  <Input type="number" placeholder="1.5" step="0.1" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Peak Hours Multiplier</label>
                  <Input type="number" placeholder="2.0" step="0.1" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Enable Automatic Surge</label>
                  <Switch checked />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Weekend Premium</label>
                  <Switch />
                </div>
                <Button className="w-full">Update Pricing</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Geo-fencing Zones
                </CardTitle>
                <CardDescription>Manage service areas and special zones</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Zone</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Multiplier</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockGeoZones.map((zone) => (
                      <TableRow key={zone.id}>
                        <TableCell className="font-medium">{zone.name}</TableCell>
                        <TableCell>{zone.type}</TableCell>
                        <TableCell>{zone.multiplier}</TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <Badge className={getStatusColor(zone.status)}>
                              {zone.status}
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="promotions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Promo Codes & Discounts
                  </CardTitle>
                  <CardDescription>Manage promotional campaigns and referral bonuses</CardDescription>
                </div>
                <Button onClick={() => setIsPromoModalOpen(true)}>Create New Promo</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPromoCodes.map((promo) => (
                    <TableRow key={promo.id}>
                      <TableCell className="font-medium">{promo.id}</TableCell>
                      <TableCell>{promo.type}</TableCell>
                      <TableCell>{promo.value}</TableCell>
                      <TableCell>{promo.usage}</TableCell>
                      <TableCell>{promo.expiry}</TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Badge className={getStatusColor(promo.status)}>
                            {promo.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Emergency & SOS Settings
              </CardTitle>
              <CardDescription>Configure safety features and emergency protocols</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Enable SOS Button</h4>
                    <p className="text-sm text-muted-foreground">Allow users to trigger emergency alerts</p>
                  </div>
                  <Switch checked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Automatic Location Sharing</h4>
                    <p className="text-sm text-muted-foreground">Share location with emergency contacts during SOS</p>
                  </div>
                  <Switch checked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Emergency Contact Alerts</h4>
                    <p className="text-sm text-muted-foreground">Notify emergency contacts during incidents</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Law Enforcement Integration</h4>
                    <p className="text-sm text-muted-foreground">Automatically notify local authorities</p>
                  </div>
                  <Switch />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Emergency Hotline</label>
                <Input placeholder="+1-800-EMERGENCY" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Response Time Target (minutes)</label>
                <Input type="number" placeholder="5" />
              </div>
              <Button>Update Emergency Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="versions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                App Version Management
              </CardTitle>
              <CardDescription>Manage app versions and force updates across platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Platform</TableHead>
                    <TableHead>Current Version</TableHead>
                    <TableHead>Latest Version</TableHead>
                    <TableHead>User Adoption</TableHead>
                    <TableHead>Force Update</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockVersions.map((version, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{version.platform}</TableCell>
                      <TableCell>{version.current}</TableCell>
                      <TableCell>{version.latest}</TableCell>
                      <TableCell>{version.users}</TableCell>
                      <TableCell>
                        <Switch checked={version.forceUpdate} />
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreatePromoModal 
        open={isPromoModalOpen} 
        onOpenChange={setIsPromoModalOpen} 
      />
    </div>
  );
};

export default System;