import { useState } from "react";
import { Leaf, Users, ChevronDown, BarChart3, Cloud, FileText, Brain, Code, Network, Package, Lightbulb } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";

const userRoles = [
  { value: "developer", label: "Developer" },
  { value: "devops", label: "DevOps Engineer" },
  { value: "architect", label: "Solution Architect" },
  { value: "manager", label: "Engineering Manager" },
  { value: "analyst", label: "Data Analyst" },
];


interface AppSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [selectedRole, setSelectedRole] = useState("developer");

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-card border-r">
        {/* Logo Section */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-bold text-lg text-primary">CFMT</h2>
                <p className="text-xs text-muted-foreground">Carbon Footprint Management Tool</p>
              </div>
            )}
          </div>
        </div>

        {/* User Persona Section */}
        {!collapsed && (
          <div className="p-6 border-b">
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">User Persona</h3>
              
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm text-muted-foreground">Select your role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-full bg-primary/10 border-primary/20">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {userRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedRole === "developer" && (
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="font-medium text-sm text-primary mb-1">Developer View</h4>
                  <p className="text-xs text-muted-foreground">
                    Technical view focusing on emissions without cost details.
                  </p>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Status */}
        {!collapsed && (
          <div className="mt-auto p-6">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              <div className="text-sm">
                <p className="font-medium text-success">System Online</p>
                <p className="text-xs text-muted-foreground">All services running</p>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
