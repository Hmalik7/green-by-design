import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TotalImpactProps {
  totalCO2: number;
  showCosts: boolean;
}

export function TotalImpact({ totalCO2, showCosts }: TotalImpactProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Total Impact</CardTitle>
        <p className="text-sm text-gray-400">Total CO2 Emissions</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-4xl font-bold text-white mb-2">
              {totalCO2.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              kg CO2e/year
            </p>
          </div>
          {!showCosts && (
            <p className="text-sm text-gray-400">
              Note: Cost information is hidden in the Developer view. Switch to Product Manager or
              Financial Analyst view to see cost details.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

