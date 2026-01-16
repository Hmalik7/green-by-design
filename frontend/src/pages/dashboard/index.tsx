import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "./DashboardLayout";
import { TotalImpact } from "@/components/TotalImpact";
import { EmissionsCharts } from "@/components/EmissionsCharts";
import { DetailedEmissionsTable } from "@/components/DetailedEmissionsTable";
import { GHGPStandards } from "@/components/GHGPStandards";
import { CloudServicesTab } from "./CloudServicesTab";

type Persona = "Product Manager" | "Developer" | "Sustainability Officer" | "Financial Analyst";

// Mock data - replace with actual data from API
const mockEmissionsData = [
  {
    category: "AWS: EKS",
    emissions: 1168.3509,
    percentage: 97.29,
    perUser: 1168.3509,
  },
  {
    category: "AWS: EC2",
    emissions: 32.3704,
    percentage: 2.7,
    perUser: 32.3704,
  },
  {
    category: "AWS: CloudWatch",
    emissions: 0.1826,
    percentage: 0.02,
    perUser: 0.1826,
  },
  {
    category: "AWS: DynamoDB",
    emissions: 0,
    percentage: 0,
    perUser: 0,
  },
  {
    category: "AWS: Route53",
    emissions: 0,
    percentage: 0,
    perUser: 0,
  },
];

const calculateTotal = (data: typeof mockEmissionsData) => {
  return data.reduce((sum, item) => sum + item.emissions, 0);
};

export default function Dashboard() {
  const [persona, setPersona] = useState<Persona>("Developer");

  const showCosts = persona === "Product Manager" || persona === "Financial Analyst";
  const totalCO2 = calculateTotal(mockEmissionsData);

  const renderContent = (activeTab: string) => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <div className="space-y-6">
            {/* Total Impact */}
            <TotalImpact totalCO2={totalCO2} showCosts={showCosts} />

            {/* Environmental & Financial Impact Breakdown */}
            <EmissionsCharts data={mockEmissionsData} />

            {/* Detailed Emissions Data */}
            <DetailedEmissionsTable data={mockEmissionsData} />

            {/* GHGP Standards */}
            <GHGPStandards totalEmissions={totalCO2} />
          </div>
        );

      case "Cloud Services":
        return (
          <div className="space-y-6">
            <div className="flex justify-end mb-4">
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                Calculate AWS Emissions
              </Button>
            </div>
            <CloudServicesTab />
          </div>
        );

      case "AI & ML":
      case "Programming Languages":
      case "Network Infrastructure":
      case "Other Software":
      case "Recommendations":
        return (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">{activeTab}</h2>
              <p className="text-gray-400">
                {activeTab} content will be implemented here.
              </p>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout persona={persona} onPersonaChange={setPersona}>
      {renderContent}
    </DashboardLayout>
  );
}

