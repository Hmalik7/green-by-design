import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer, Cell } from "recharts";

interface GHGPStandardsProps {
  totalEmissions: number; // in kg CO2e/year
}

export function GHGPStandards({ totalEmissions }: GHGPStandardsProps) {
  // Convert kg to metric tons
  const emissionsInTons = totalEmissions / 1000;
  const mandatoryThreshold = 25000; // metric tons
  const voluntaryThreshold = 5000; // metric tons

  const isAboveMandatory = emissionsInTons >= mandatoryThreshold;
  const isAboveVoluntary = emissionsInTons >= voluntaryThreshold;

  const scopeData = [
    { scope: "Scope 1", emissions: 0, color: "#ffffff" },
    { scope: "Scope 2", emissions: 0.3, color: "#3b82f6" }, // 300 kg = 0.3 tons
    { scope: "Scope 3", emissions: 0.9, color: "#f97316" }, // 900 kg = 0.9 tons
  ];

  return (
    <div className="space-y-6">
      {/* GHGP Reporting Thresholds */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">GHGP Reporting Thresholds</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-2">Mandatory Reporting Status:</p>
              <Badge
                variant={isAboveMandatory ? "destructive" : "default"}
                className={isAboveMandatory ? "bg-red-500" : "bg-green-500"}
              >
                {isAboveMandatory ? "Above Threshold" : "Below Threshold"}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">Voluntary Reporting Status:</p>
              <Badge
                variant={isAboveVoluntary ? "default" : "default"}
                className={isAboveVoluntary ? "bg-orange-500" : "bg-green-500"}
              >
                {isAboveVoluntary ? "Above Threshold" : "Below Threshold"}
              </Badge>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-300">
            <p>
              Emissions above {mandatoryThreshold.toLocaleString()} metric tons CO2e/year require
              mandatory reporting in many jurisdictions.
            </p>
            <p>
              Emissions above {voluntaryThreshold.toLocaleString()} metric tons CO2e/year should
              consider voluntary disclosure.
            </p>
          </div>

          <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">Your Software Emissions:</p>
            <p className="text-lg font-semibold text-white">
              {emissionsInTons.toFixed(2)} metric tons CO2e/year
            </p>
            <p className="text-xs text-gray-500 mt-1">
              - Calculated from your inputs to this tool
            </p>
          </div>

          {/* Chart placeholder */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-300 mb-4">
              Emissions relative to your reporting thresholds (log scale)
            </h4>
            <div className="h-64 bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center">
              <p className="text-gray-500 text-sm">Chart visualization coming soon</p>
            </div>
            <div className="flex gap-4 justify-center mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded" />
                <span className="text-xs text-gray-300">Mandatory Reporting Threshold</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded" />
                <span className="text-xs text-gray-300">Voluntary Reporting Threshold</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded" />
                <span className="text-xs text-gray-300">Your Software Emissions</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GHGP Standards Details */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">GHGP Standards Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">
              Greenhouse Gas Protocol (GHGP) Standards
            </h4>
            <p className="text-sm text-gray-300 mb-4">
              The GHGP provides the world's most widely used greenhouse gas accounting standards.
              For software and IT services:
            </p>
          </div>

          <div>
            <h5 className="text-sm font-semibold text-white mb-2">Key Standards Applicable to Software:</h5>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-300 ml-4">
              <li>
                <strong>Scope 2 Guidance:</strong> For electricity consumption in data centers and
                computing resources
                <ul className="list-disc list-inside ml-6 mt-1 text-gray-400">
                  <li>Market-based and location-based reporting methods apply</li>
                </ul>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* GHGP Emission Scopes */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">GHGP Emission Scopes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-300">
            The Greenhouse Gas Protocol categorizes emissions into three scopes:
          </p>

          <div className="space-y-3">
            <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
              <h5 className="font-semibold text-white mb-1">Scope 1</h5>
              <p className="text-sm text-gray-300">
                Direct emissions from owned/controlled sources
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Typically not applicable for software (no direct fuel combustion)
              </p>
            </div>

            <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
              <h5 className="font-semibold text-white mb-1">Scope 2</h5>
              <p className="text-sm text-gray-300">
                Indirect emissions from purchased electricity
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Examples: Server energy usage, Data center operations, Office electricity for
                development
              </p>
            </div>

            <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
              <h5 className="font-semibold text-white mb-1">Scope 3</h5>
              <p className="text-sm text-gray-300">
                All other indirect emissions in the value chain
              </p>
            </div>
          </div>

          {/* Emissions by GHGP Scope Chart */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-300 mb-4">Emissions by GHGP Scope</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scopeData}>
                <XAxis
                  dataKey="scope"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  label={{
                    value: "Emissions (kg CO2e/year)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "#9ca3af" },
                  }}
                />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const value = payload[0].value as number;
                      return (
                        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                          <p className="text-white font-medium">
                            {payload[0].payload.scope}
                          </p>
                          <p className="text-green-500">
                            {(value * 1000).toFixed(2)} kg CO2e/year
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="emissions" radius={[4, 4, 0, 0]}>
                  {scopeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 justify-center mt-4">
              {scopeData.map((scope) => (
                <div key={scope.scope} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: scope.color }}
                  />
                  <span className="text-xs text-gray-300">{scope.scope}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

