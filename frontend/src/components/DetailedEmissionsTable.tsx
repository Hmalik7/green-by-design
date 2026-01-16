import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EmissionData {
  category: string;
  emissions: number;
  percentage: number;
  perUser: number;
}

interface DetailedEmissionsTableProps {
  data: EmissionData[];
}

export function DetailedEmissionsTable({ data }: DetailedEmissionsTableProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Detailed Emissions Data</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-gray-700/50">
              <TableHead className="text-gray-300">Category</TableHead>
              <TableHead className="text-gray-300">Emissions (kg CO2e/year)</TableHead>
              <TableHead className="text-gray-300">Percentage (%)</TableHead>
              <TableHead className="text-gray-300">Per user (kg CO2e/year)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} className="border-gray-700 hover:bg-gray-700/50">
                <TableCell className="text-white font-medium">{row.category}</TableCell>
                <TableCell className="text-white">
                  {row.emissions.toLocaleString("en-US", {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4,
                  })}
                </TableCell>
                <TableCell className="text-white">
                  {row.percentage.toFixed(2)}%
                </TableCell>
                <TableCell className="text-white">
                  {row.perUser.toLocaleString("en-US", {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

