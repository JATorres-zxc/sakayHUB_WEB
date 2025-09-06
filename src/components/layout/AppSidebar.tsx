import { useState } from "react";
import { 
  BarChart3, 
  Users, 
  Car, 
  MapPin, 
  DollarSign, 
  MessageSquare, 
  Bell, 
  Settings,
  Home,
  UserCheck,
  TruckIcon,
  CreditCard,
  LifeBuoy,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", url: "/", icon: Home, category: "main" },
  { title: "Users", url: "/users", icon: Users, category: "management" },
  { title: "Drivers", url: "/drivers", icon: Car, category: "management" },
  { title: "Rides & Deliveries", url: "/rides", icon: MapPin, category: "operations" },
  { title: "Financial", url: "/financial", icon: DollarSign, category: "operations" },
  { title: "Support", url: "/support", icon: MessageSquare, category: "operations" },
  { title: "Notifications", url: "/notifications", icon: Bell, category: "communication" },
  { title: "Settings", url: "/settings", icon: Settings, category: "system" },
];

const categories = {
  main: "Overview",
  management: "User Management", 
  operations: "Operations",
  communication: "Communication",
  system: "System"
};

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["main", "management"]);

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      "transition-colors duration-200",
      isActive 
        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
    );

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const groupedItems = Object.entries(categories).map(([categoryKey, categoryLabel]) => ({
    key: categoryKey,
    label: categoryLabel,
    items: menuItems.filter(item => item.category === categoryKey),
    isExpanded: expandedCategories.includes(categoryKey),
    hasActiveItem: menuItems.some(item => 
      item.category === categoryKey && isActive(item.url)
    )
  }));

  return (
    <Sidebar
      className={cn(
        "transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
      collapsible="icon"
    >
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <TruckIcon className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h2 className="font-semibold text-sidebar-foreground">RideFlow CRM</h2>
              <p className="text-xs text-sidebar-foreground/60">Admin Dashboard</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="px-2 py-4">
        <div className="space-y-2">
          {groupedItems.map((group) => (
            <Collapsible
              key={group.key}
              open={group.isExpanded || collapsed}
              onOpenChange={() => !collapsed && toggleCategory(group.key)}
            >
              {!collapsed && (
                <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  <span className="uppercase tracking-wider">{group.label}</span>
                  {group.isExpanded ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </CollapsibleTrigger>
              )}
              
              <CollapsibleContent className="space-y-1">
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className="h-10">
                        <NavLink 
                          to={item.url} 
                          end 
                          className={getNavCls}
                          title={collapsed ? item.title : undefined}
                        >
                          <item.icon className={cn(
                            "transition-all duration-200",
                            collapsed ? "w-5 h-5" : "w-4 h-4 mr-3"
                          )} />
                          {!collapsed && (
                            <span className="animate-fade-in">{item.title}</span>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </SidebarContent>

      {collapsed && (
        <div className="p-2 border-t border-sidebar-border">
          <SidebarTrigger className="w-full h-10 hover:bg-sidebar-accent" />
        </div>
      )}
    </Sidebar>
  );
}