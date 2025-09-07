import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  XCircle,
  User,
  RefreshCw,
  Send
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";

const mockTickets = [
  {
    id: "SUP001",
    customer: "John Doe",
    subject: "Refund Request - Cancelled Ride",
    category: "refund",
    priority: "high",
    status: "open",
    assignee: "Sarah Chen",
    created: "2024-01-15 14:30",
    lastReply: "2024-01-15 15:45"
  },
  {
    id: "SUP002",
    customer: "Maria Santos",
    subject: "Driver was rude during delivery",
    category: "complaint",
    priority: "medium",
    status: "resolving",
    assignee: "Mike Wilson",
    created: "2024-01-15 13:15",
    lastReply: "2024-01-15 14:20"
  },
  {
    id: "SUP003",
    customer: "Robert Kim",
    subject: "App not working properly",
    category: "technical",
    priority: "low",
    status: "resolved",
    assignee: "Anna Garcia",
    created: "2024-01-14 16:20",
    lastReply: "2024-01-15 09:30"
  }
];

const mockRefunds = [
  {
    id: "REF001",
    ticketId: "SUP001",
    customer: "John Doe",
    amount: "₱180",
    reason: "Driver cancelled after pickup",
    status: "pending",
    requestDate: "2024-01-15 14:30"
  },
  {
    id: "REF002",
    ticketId: "SUP004",
    customer: "Lisa Park",
    amount: "₱45",
    reason: "Food order not delivered",
    status: "approved",
    requestDate: "2024-01-14 19:45"
  },
  {
    id: "REF003",
    ticketId: "SUP007",
    customer: "David Lee",
    amount: "₱120",
    reason: "Wrong fare calculation",
    status: "rejected",
    requestDate: "2024-01-14 11:30"
  }
];

const mockChatMessages = [
  {
    id: 1,
    sender: "John Doe",
    message: "I need a refund for my cancelled ride",
    timestamp: "14:30",
    isSupport: false
  },
  {
    id: 2,
    sender: "Sarah Chen",
    message: "Hi John, I'm sorry to hear about your experience. Can you provide me with your ride ID?",
    timestamp: "14:35",
    isSupport: true
  },
  {
    id: 3,
    sender: "John Doe",
    message: "The ride ID is R001",
    timestamp: "14:37",
    isSupport: false
  },
  {
    id: 4,
    sender: "Sarah Chen",
    message: "Thank you. I can see the ride was cancelled by the driver after pickup. I'll process your refund right away.",
    timestamp: "14:40",
    isSupport: true
  }
];

export default function Support() {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [chatMessage, setChatMessage] = useState("");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-600 border-red-200";
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
      case "low":
        return "bg-green-500/10 text-green-600 border-green-200";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "resolving":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
      case "resolved":
        return "bg-green-500/10 text-green-600 border-green-200";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
      case "approved":
        return "bg-green-500/10 text-green-600 border-green-200";
      case "rejected":
        return "bg-red-500/10 text-red-600 border-red-200";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="w-3 h-3" />;
      case "resolving":
        return <Clock className="w-3 h-3" />;
      case "resolved":
        return <CheckCircle className="w-3 h-3" />;
      case "pending":
        return <RefreshCw className="w-3 h-3" />;
      case "approved":
        return <CheckCircle className="w-3 h-3" />;
      case "rejected":
        return <XCircle className="w-3 h-3" />;
      default:
        return <AlertTriangle className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Support & Disputes</h1>
        <Button className="gap-2">
          <MessageSquare className="w-4 h-4" />
          New Ticket
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Open Tickets"
          value="24"
          change={{ value: "3", positive: false }}
          icon={AlertTriangle}
          description="Awaiting response"
        />
        <StatsCard
          title="In Progress"
          value="18"
          change={{ value: "2", positive: true }}
          icon={Clock}
          description="Being handled"
        />
        <StatsCard
          title="Resolved Today"
          value="12"
          change={{ value: "4", positive: true }}
          icon={CheckCircle}
          description="Completed"
        />
        <StatsCard
          title="Avg Response Time"
          value="2.3h"
          change={{ value: "15m", positive: true }}
          icon={MessageSquare}
          description="This week"
        />
      </div>

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="refunds">Refund Processing</TabsTrigger>
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
          <TabsTrigger value="escalation">Escalation Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Support Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-mono text-sm">{ticket.id}</TableCell>
                      <TableCell>{ticket.customer}</TableCell>
                      <TableCell className="max-w-xs truncate">{ticket.subject}</TableCell>
                      <TableCell className="capitalize">{ticket.category}</TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Badge variant="outline" className={getStatusColor(ticket.status)}>
                            {getStatusIcon(ticket.status)}
                            <span className="ml-1">{ticket.status}</span>
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{ticket.assignee}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{ticket.created}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refunds">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Refund Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Refund ID</TableHead>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRefunds.map((refund) => (
                    <TableRow key={refund.id}>
                      <TableCell className="font-mono text-sm">{refund.id}</TableCell>
                      <TableCell className="font-mono text-sm">{refund.ticketId}</TableCell>
                      <TableCell>{refund.customer}</TableCell>
                      <TableCell className="font-medium">{refund.amount}</TableCell>
                      <TableCell className="max-w-xs truncate">{refund.reason}</TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Badge variant="outline" className={getStatusColor(refund.status)}>
                            {getStatusIcon(refund.status)}
                            <span className="ml-1">{refund.status}</span>
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{refund.requestDate}</TableCell>
                      <TableCell>
                        {refund.status === "pending" && (
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="text-green-600">
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              Reject
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

        <TabsContent value="chat">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Live Chat Support - Ticket SUP001</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-64 bg-muted/30 rounded-lg p-4 overflow-y-auto space-y-3">
                    {mockChatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isSupport ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg text-sm ${
                            msg.isSupport
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <div className="font-medium text-xs mb-1">
                            {msg.sender} • {msg.timestamp}
                          </div>
                          <div>{msg.message}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                    />
                    <Button size="sm">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p className="text-sm text-muted-foreground">John Doe</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground">john.doe@email.com</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <p className="text-sm text-muted-foreground">+63 912 345 6789</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Total Rides</label>
                  <p className="text-sm text-muted-foreground">47 rides</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Rating</label>
                  <p className="text-sm text-muted-foreground">⭐ 4.8/5.0</p>
                </div>
                <Button variant="outline" className="w-full">
                  View Full Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="escalation">
          <Card>
            <CardHeader>
              <CardTitle>Escalation Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">SUP001 - Refund Request</span>
                    <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-200">
                      Level 2 Escalation
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Customer unsatisfied with initial response. Escalated to senior support.
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Escalated by: Sarah Chen • 2 hours ago
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">SUP008 - Driver Complaint</span>
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-200">
                      Level 1 Escalation
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Complex driver behavioral issue requiring manager review.
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Escalated by: Mike Wilson • 5 hours ago
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}