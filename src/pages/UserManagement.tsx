import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Users from "./Users";
import Drivers from "./Drivers";
import DriverApplications from "./DriverApplications";

export default function UserManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage users, drivers, and driver applications
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="applications">Driver Applications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-0">
          <Users />
        </TabsContent>
        
        <TabsContent value="drivers" className="space-y-0">
          <Drivers />
        </TabsContent>
        
        <TabsContent value="applications" className="space-y-0">
          <DriverApplications />
        </TabsContent>
      </Tabs>
    </div>
  );
}