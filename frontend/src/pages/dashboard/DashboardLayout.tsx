import { ReactNode, useState } from "react";
import { Leaf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { UserPersonaSelector } from "@/components/UserPersonaSelector";
import { DashboardTabs } from "@/components/DashboardTabs";

type Persona = "Product Manager" | "Developer" | "Sustainability Officer" | "Financial Analyst";

interface DashboardLayoutProps {
  children: (activeTab: string) => ReactNode;
  persona: Persona;
  onPersonaChange: (persona: Persona) => void;
}

export function DashboardLayout({ children, persona, onPersonaChange }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-gray-900 border-r border-gray-800 p-6 space-y-6">
          {/* CFMT Branding */}
          <Card className="bg-gray-800 border-green-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 border border-green-500 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-green-500">CFMT</h2>
                  <p className="text-xs text-gray-400">Carbon Footprint Management Tool</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Persona Selector */}
          <UserPersonaSelector value={persona} onChange={onPersonaChange} />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Carbon Footprint Management Tool (CFMT)
            </h1>
            <p className="text-gray-400">
              Estimate the carbon footprint of your software applications based on their
              infrastructure, programming languages, AI components, and network usage.
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Page Content */}
          {children(activeTab)}
        </div>
      </div>
    </div>
  );
}

