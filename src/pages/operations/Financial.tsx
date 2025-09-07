import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Wallet, 
  Gift,
  ArrowUpDown,
  Check,
  X
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SimpleChart } from "@/components/dashboard/SimpleChart";

const mockTransactions = [
  {
    id: "TXN001",
    type: "ride",
    amount: "₱180",
    commission: "₱36",
    customer: "John Doe",
    driver: "Mike Wilson",
    status: "completed",
    timestamp: "2024-01-15 14:30"
  },
  {
    id: "TXN002",
    type: "delivery",
    amount: "₱45",
    commission: "₱9",
    customer: "Maria Santos",
    driver: "Jose Cruz",
    status: "completed",
    timestamp: "2024-01-15 14:15"
  },
  {
    id: "TXN003",
    type: "refund",
    amount: "-₱200",
    commission: "-₱40",
    customer: "Robert Kim",
    driver: "Anna Garcia",
    status: "processed",
    timestamp: "2024-01-15 13:45"
  }
];

const mockPayouts = [
  {
    id: "PAY001",
    driver: "Mike Wilson",
    amount: "₱2,450",
    rides: 12,
    status: "pending",
    requestDate: "2024-01-15"
  },
  {
    id: "PAY002",
    driver: "Jose Cruz",
    amount: "₱1,890",
    rides: 8,
    status: "approved",
    requestDate: "2024-01-14"
  },
  {
    id: "PAY003",
    driver: "Anna Garcia",
    amount: "₱3,120",
    rides: 15,
    status: "rejected",
    requestDate: "2024-01-14"
  }
];

const mockPromoCodes = [
  {
    id: "PROMO001",
    code: "NEWUSER50",
    type: "discount",
    value: "50%",
    usage: "245/500",
    status: "active",
    expires: "2024-02-15"
  },
  {
    id: "PROMO002",
    code: "DELIVERY20",
    type: "cashback",
    value: "₱20",
    usage: "89/200",
    status: "active",
    expires: "2024-01-31"
  }
];

const revenueData = [
  { name: "Mon", rides: 1200, deliveries: 800 },
  { name: "Tue", rides: 1400, deliveries: 900 },
  { name: "Wed", rides: 1100, deliveries: 700 },
  { name: "Thu", rides: 1600, deliveries: 1100 },
  { name: "Fri", rides: 1800, deliveries: 1300 },
  { name: "Sat", rides: 2200, deliveries: 1600 },
  { name: "Sun", rides: 1900, deliveries: 1400 }
];

export default function Financial() {
  const [farePerKm, setFarePerKm] = useState("12");
  const [commissionRate, setCommissionRate] = useState("20");
  const [surgeMultiplier, setSurgeMultiplier] = useState("1.5");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "approved":
      case "active":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
      case "rejected":
        return "bg-red-500/10 text-red-600 border-red-200";
      case "processed":
        return "bg-blue-500/10 text-blue-600 border-blue-200";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Financial Management</h1>
        <Button className="gap-2">
          <TrendingUp className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value="₱45,280"
          change={{ value: "18%", positive: true }}
          icon={DollarSign}
          description="This week"
        />
        <StatsCard
          title="Commission Earned"
          value="₱9,056"
          change={{ value: "22%", positive: true }}
          icon={CreditCard}
          description="This week"
        />
        <StatsCard
          title="Pending Payouts"
          value="₱12,340"
          change={{ value: "5%", positive: false }}
          icon={Wallet}
          description="Awaiting approval"
        />
        <StatsCard
          title="Active Promos"
          value="8"
          change={{ value: "2", positive: true }}
          icon={Gift}
          description="Currently running"
        />
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Driver Payouts</TabsTrigger>
          <TabsTrigger value="reports">Revenue Reports</TabsTrigger>
          <TabsTrigger value="settings">Fare Settings</TabsTrigger>
          <TabsTrigger value="promos">Promo Codes</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="w-5 h-5" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTransactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell className="font-mono text-sm">{txn.id}</TableCell>
                      <TableCell className="capitalize">{txn.type}</TableCell>
                      <TableCell className="font-medium">{txn.amount}</TableCell>
                      <TableCell className="text-sm">{txn.commission}</TableCell>
                      <TableCell>{txn.customer}</TableCell>
                      <TableCell>{txn.driver}</TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Badge variant="outline" className={getStatusColor(txn.status)}>
                            {txn.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{txn.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Driver Payout Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Rides</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPayouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-mono text-sm">{payout.id}</TableCell>
                      <TableCell>{payout.driver}</TableCell>
                      <TableCell className="font-medium">{payout.amount}</TableCell>
                      <TableCell>{payout.rides}</TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Badge variant="outline" className={getStatusColor(payout.status)}>
                            {payout.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{payout.requestDate}</TableCell>
                      <TableCell>
                        {payout.status === "pending" && (
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Check className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleChart data={revenueData} />
              </CardContent>
            </Card>
            
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₱6,468</div>
                  <p className="text-xs text-muted-foreground">+12% from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">20%</div>
                  <p className="text-xs text-muted-foreground">Standard rate</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Refund Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.3%</div>
                  <p className="text-xs text-muted-foreground">-0.5% from last week</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Fare & Commission Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="fare-per-km">Base Fare per KM (₱)</Label>
                  <Input
                    id="fare-per-km"
                    value={farePerKm}
                    onChange={(e) => setFarePerKm(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commission-rate">Commission Rate (%)</Label>
                  <Input
                    id="commission-rate"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surge-multiplier">Surge Multiplier</Label>
                  <Input
                    id="surge-multiplier"
                    value={surgeMultiplier}
                    onChange={(e) => setSurgeMultiplier(e.target.value)}
                  />
                </div>
              </div>
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Promo Codes & Vouchers
                </span>
                <Button>Create New Promo</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPromoCodes.map((promo) => (
                    <TableRow key={promo.id}>
                      <TableCell className="font-mono">{promo.code}</TableCell>
                      <TableCell className="capitalize">{promo.type}</TableCell>
                      <TableCell className="font-medium">{promo.value}</TableCell>
                      <TableCell>{promo.usage}</TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Badge variant="outline" className={getStatusColor(promo.status)}>
                            {promo.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{promo.expires}</TableCell>
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
      </Tabs>
    </div>
  );
}