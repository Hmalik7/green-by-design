import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts";

interface EmissionData {
  category: string;
  emissions: number;
  percentage: number;
}

interface EmissionsChartsProps {
  data: EmissionData[];
}

const COLORS = {
  "AWS: EKS": "#22c55e", // green
  "AWS: EC2": "#60a5fa", // light blue
  "AWS: CloudWatch": "#3b82f6", // blue
  "AWS: DynamoDB": "#1e40af", // dark blue
  "AWS: Route53": "#4ade80", // light green
};

const colorArray = [
  "#22c55e", // green - EKS
  "#60a5fa", // light blue - EC2
  "#3b82f6", // blue - CloudWatch
  "#1e40af", // dark blue - DynamoDB
  "#4ade80", // light green - Route53
];

export function EmissionsCharts({ data }: EmissionsChartsProps) {
  const chartConfig = {
    emissions: {
      label: "Emissions (kg CO2e/year)",
    },
  };

  const pieData = data.map((item) => ({
    name: item.category,
    value: item.percentage,
  }));

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Environmental & Financial Impact Breakdown</CardTitle>
        <p className="text-sm text-gray-400">Emissions by Category</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-4">Emissions by Category</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <XAxis
                  dataKey="category"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
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
                      return (
                        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                          <p className="text-white font-medium">
                            {payload[0].payload.category}
                          </p>
                          <p className="text-green-500">
                            {payload[0].value?.toLocaleString()} kg CO2e/year
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="emissions" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-4">Percentage Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    percent > 0.05 ? `${(percent * 100).toFixed(1)}%` : ""
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colorArray[index % colorArray.length]} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                          <p className="text-white font-medium">{payload[0].name}</p>
                          <p className="text-green-500">
                            {payload[0].value?.toFixed(2)}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          {data.map((item, index) => (
            <div key={item.category} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: colorArray[index % colorArray.length] }}
              />
              <span className="text-sm text-gray-300">{item.category}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

