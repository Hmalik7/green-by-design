import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  "Dashboard",
  "Cloud Services",
  "AI & ML",
  "Programming Languages",
  "Network Infrastructure",
  "Other Software",
  "Recommendations",
];

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="dashboard-tabs-container">
        <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-gray-800 border border-gray-700 p-1 text-muted-foreground min-w-max gap-1">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className={`
                inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium
                transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                disabled:pointer-events-none disabled:opacity-50
                data-[state=active]:bg-green-500 data-[state=active]:text-white
                text-gray-400 hover:text-gray-300
                ${activeTab === tab ? "bg-green-500 text-white" : ""}
                flex-shrink-0
              `}
            >
              <span className="whitespace-nowrap">{tab}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
}

