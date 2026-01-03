import { useState } from "react";
import { Leaf, BarChart3, Laptop, Globe, DollarSign, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

type Persona = "Product Manager" | "Developer" | "Sustainability Officer" | "Financial Analyst";

interface PersonaConfig {
  icon: typeof Leaf;
  description: string;
  showCosts: boolean;
}

const personaConfigs: Record<Persona, PersonaConfig> = {
  "Product Manager": {
    icon: BarChart3,
    description: "Business view with emissions and cost details",
    showCosts: true,
  },
  Developer: {
    icon: Laptop,
    description: "Technical view focusing on emissions without cost details",
    showCosts: false,
  },
  "Sustainability Officer": {
    icon: Globe,
    description: "Environmental view with detailed emissions breakdown",
    showCosts: false,
  },
  "Financial Analyst": {
    icon: DollarSign,
    description: "Financial view with cost analysis and emissions",
    showCosts: true,
  },
};

interface UserPersonaSelectorProps {
  value: Persona;
  onChange: (persona: Persona) => void;
}

export function UserPersonaSelector({ value, onChange }: UserPersonaSelectorProps) {
  const config = personaConfigs[value];
  const Icon = config.icon;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-white mb-2">User Persona</h3>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full bg-gray-800 border-green-500 text-white">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            {Object.keys(personaConfigs).map((persona) => {
              const PersonaIcon = personaConfigs[persona as Persona].icon;
              return (
                <SelectItem
                  key={persona}
                  value={persona}
                  className="text-white hover:bg-gray-700 focus:bg-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <PersonaIcon className="w-4 h-4" />
                    <span>{persona}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-gray-800 border-green-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 border border-green-500 flex items-center justify-center">
              <Icon className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-white">{value} View</h4>
              <p className="text-xs text-gray-400 mt-1">{config.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

