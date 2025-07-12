import { useState, useEffect } from "react";
import { calculateAWSCarbonFootprint, formatCarbonResult, formatCurrency, CarbonCalculationResult, getCarbonComparisons } from "@/lib/carbon-calculator";
import { awsCarbonService } from "@/lib/aws-carbon-service";
import { AWSConfigForm } from "@/components/AWSConfigForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Cloud, Database, ChartBar, Leaf, Globe, BarChart3, TrendingUp, Zap, Shield, Settings } from "lucide-react";
import circuitBoard from "@/assets/circuit-board.jpg";
import codeScreen from "@/assets/code-screen.jpg";
import analyticsDashboard from "@/assets/analytics-dashboard.jpg";


const cloudProviders = [
  { value: "aws", label: "Amazon Web Services (AWS)" },
  { value: "gcp", label: "Google Cloud Platform (GCP)" },
  { value: "azure", label: "Microsoft Azure" },
  { value: "digitalocean", label: "DigitalOcean" },
  { value: "other", label: "Other" },
];

const serviceCategories = [
  { value: "all", label: "All Services" },
  { value: "compute", label: "Compute (EC2, VMs, App Engine)" },
  { value: "storage", label: "Storage (S3, Cloud Storage, Blob)" },
  { value: "database", label: "Database (RDS, CloudSQL, CosmosDB)" },
  { value: "networking", label: "Networking (VPC, Load Balancer, CDN)" },
  { value: "serverless", label: "Serverless (Lambda, Functions, Logic Apps)" },
  { value: "ai-ml", label: "AI/ML Services" },
  { value: "analytics", label: "Analytics & Big Data" },
  { value: "security", label: "Security & Identity" },
];

const carbonUnits = [
  { value: "tons", label: "Metric Tons CO₂e" },
  { value: "kg", label: "Kilograms CO₂e" },
  { value: "lbs", label: "Pounds CO₂e" },
];

const currencies = [
  { value: "USD", label: "US Dollar ($)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GBP", label: "British Pound (£)" },
  { value: "CAD", label: "Canadian Dollar (C$)" },
  { value: "AUD", label: "Australian Dollar (A$)" },
  { value: "JPY", label: "Japanese Yen (¥)" },
  { value: "CNY", label: "Chinese Yuan (¥)" },
  { value: "INR", label: "Indian Rupee (₹)" },
];

const Index = () => {
  const [formData, setFormData] = useState({
    organization: "",
    provider: "",
    services: "",
    monthlySpend: "",
    primaryUse: "",
    notes: ""
  });
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [totalCarbonFootprint, setTotalCarbonFootprint] = useState<number>(0);
  const [awsConfigured, setAwsConfigured] = useState(false);
  const [awsRegion, setAwsRegion] = useState<string>("");
  const [carbonUnit, setCarbonUnit] = useState<string>("tons");
  const [currency, setCurrency] = useState<string>("USD");
  const { toast } = useToast();

  const handleAWSCredentialsUpdate = (credentials: any) => {
    awsCarbonService.setCredentials(credentials);
    setAwsConfigured(!!credentials);
    setAwsRegion(credentials?.region || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate carbon footprint for this submission
    const carbonResult = await calculateAWSCarbonFootprint(
      Number(formData.monthlySpend),
      formData.services,
      awsRegion || 'us-east-1' // Use configured region or default
    );
    
    const newSubmission = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toLocaleDateString(),
      carbonFootprint: carbonResult,
      region: awsRegion || 'us-east-1',
      isAWSConfigured: awsConfigured
    };
    
    const updatedSubmissions = [...submissions, newSubmission];
    setSubmissions(updatedSubmissions);
    
    // Update total carbon footprint
    const totalCarbon = updatedSubmissions.reduce((sum, s) => 
      sum + (s.carbonFootprint?.co2eTons || 0), 0
    );
    setTotalCarbonFootprint(totalCarbon);
    
    toast({
      title: "Cloud Service Data Recorded!",
      description: `Added ${formData.provider} services with ${formatCarbonResult(carbonResult, carbonUnit)} impact`,
    });
    
    // Reset form
    setFormData({
      organization: "",
      provider: "",
      services: "",
      monthlySpend: "",
      primaryUse: "",
      notes: ""
    });
  };


  return (
      <div className="p-6 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your cloud infrastructure costs and carbon footprint
          </p>
        </div>
      </div>

    <h2 className="text-2xl font-semibold text-blue-600">
  👋 Hello World from Harsh1234, siddharth and Aaron!!
</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
                <p className="text-3xl font-bold text-primary">{submissions.length}</p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <Database className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Spend</p>
                <p className="text-3xl font-bold text-success">
                  {formatCurrency(submissions.reduce((sum, s) => sum + Number(s.monthlySpend || 0), 0), currency)}
                </p>
              </div>
              <div className="p-3 rounded-full bg-success/10">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Carbon Impact</p>
                <p className="text-3xl font-bold text-warning">
                  {totalCarbonFootprint > 0 
                    ? formatCarbonResult({ co2eTons: totalCarbonFootprint, kilowattHours: 0, cost: 0 }, carbonUnit)
                    : "0 tons CO₂e"
                  }
                </p>
              </div>
              <div className="p-3 rounded-full bg-warning/10">
                <Leaf className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Carbon Impact Comparisons */}
      {totalCarbonFootprint > 0 && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/20">
          <CardHeader className="bg-gradient-to-r from-warning/5 to-destructive/5 border-b">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-full bg-gradient-to-br from-warning to-destructive">
                <Globe className="w-5 h-5 text-primary-foreground" />
              </div>
              Carbon Impact Comparisons
            </CardTitle>
            <CardDescription className="text-base">
              Your {formatCarbonResult({ co2eTons: totalCarbonFootprint, kilowattHours: 0, cost: 0 }, carbonUnit)} footprint equals:
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {(() => {
              const comparisons = getCarbonComparisons(totalCarbonFootprint);
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                    <div className="flex items-center gap-3 mb-3">
                      <Zap className="w-6 h-6 text-primary" />
                      <h4 className="font-semibold text-primary">Flight Equivalent</h4>
                    </div>
                    <p className="text-2xl font-bold mb-2">{comparisons.flights.domesticFlights}</p>
                    <p className="text-sm text-muted-foreground mb-2">Domestic round-trip flights</p>
                    <p className="text-lg font-semibold">{comparisons.flights.internationalFlights}</p>
                    <p className="text-xs text-muted-foreground">International flights</p>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-success/5 to-success/10 rounded-xl border border-success/20">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="w-6 h-6 text-success" />
                      <h4 className="font-semibold text-success">Phone Impact</h4>
                    </div>
                    <p className="text-2xl font-bold mb-2">{comparisons.phones.smartphoneYears}</p>
                    <p className="text-sm text-muted-foreground mb-2">Years of smartphone use</p>
                    <p className="text-lg font-semibold">{comparisons.phones.phoneCharges.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Phone charges</p>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-warning/5 to-warning/10 rounded-xl border border-warning/20">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="w-6 h-6 text-warning" />
                      <h4 className="font-semibold text-warning">Transport Equivalent</h4>
                    </div>
                    <p className="text-2xl font-bold mb-2">{comparisons.cars.milesDriven.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mb-2">Miles driven by car</p>
                    <p className="text-lg font-semibold">{comparisons.cars.gasoline}</p>
                    <p className="text-xs text-muted-foreground">Gallons of gasoline</p>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Settings Section */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/20">
        <CardHeader className="bg-gradient-to-r from-muted/5 to-primary/5 border-b">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-full bg-gradient-to-br from-muted to-primary">
              <Settings className="w-5 h-5 text-primary-foreground" />
            </div>
            Display Settings
          </CardTitle>
          <CardDescription className="text-base">
            Customize units and currency for your carbon footprint tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="carbon-unit" className="text-base font-medium">Carbon Unit</Label>
              <Select value={carbonUnit} onValueChange={setCarbonUnit}>
                <SelectTrigger className="h-12 text-base border-2 focus:border-primary/50">
                  <SelectValue placeholder="Select carbon unit" />
                </SelectTrigger>
                <SelectContent className="bg-background border-2 shadow-lg z-50">
                  {carbonUnits.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value} className="text-base">
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="currency" className="text-base font-medium">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="h-12 text-base border-2 focus:border-primary/50">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-background border-2 shadow-lg z-50">
                  {currencies.map((curr) => (
                    <SelectItem key={curr.value} value={curr.value} className="text-base">
                      {curr.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      {formData.provider === "aws" && (
        <div className="space-y-4">
          {awsConfigured && awsRegion && (
            <Card className="bg-gradient-to-r from-success/10 to-primary/10 border-success/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium">AWS Region:</span>
                  <Badge variant="outline" className="bg-success/10 text-success">
                    {awsRegion}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
          <AWSConfigForm onCredentialsUpdate={handleAWSCredentialsUpdate} />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Data Collection Form */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/20">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary-glow/5 border-b">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-full bg-gradient-to-br from-primary to-primary-glow">
                <Cloud className="w-5 h-5 text-primary-foreground" />
              </div>
              Digital Platform Analytics
            </CardTitle>
            <CardDescription className="text-base">
              Collect your cloud infrastructure data to unlock cost and carbon insights
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="organization" className="text-base font-medium">Organization Name</Label>
                <Input
                  id="organization"
                  placeholder="e.g., Acme Corporation"
                  value={formData.organization}
                  onChange={(e) => setFormData({...formData, organization: e.target.value})}
                  required
                  className="h-12 text-base border-2 focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="provider" className="text-base font-medium">Primary Cloud Provider</Label>
                <Select value={formData.provider} onValueChange={(value) => setFormData({...formData, provider: value})} required>
                  <SelectTrigger className="h-12 text-base border-2 focus:border-primary/50">
                    <SelectValue placeholder="Select your main cloud provider" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-2 shadow-lg z-50">
                    {cloudProviders.map((provider) => (
                      <SelectItem key={provider.value} value={provider.value} className="text-base">
                        {provider.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="services" className="text-base font-medium">Service Categories</Label>
                <Select value={formData.services} onValueChange={(value) => setFormData({...formData, services: value})} required>
                  <SelectTrigger className="h-12 text-base border-2 focus:border-primary/50">
                    <SelectValue placeholder="Select primary service type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-2 shadow-lg z-50">
                    {serviceCategories.map((service) => (
                      <SelectItem key={service.value} value={service.value} className="text-base">
                        {service.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="monthlySpend" className="text-base font-medium">Estimated Monthly Spend ({currency})</Label>
                <Input
                  id="monthlySpend"
                  type="number"
                  placeholder="e.g., 5000"
                  value={formData.monthlySpend}
                  onChange={(e) => setFormData({...formData, monthlySpend: e.target.value})}
                  required
                  className="h-12 text-base border-2 focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="primaryUse" className="text-base font-medium">Primary Use Case</Label>
                <Input
                  id="primaryUse"
                  placeholder="e.g., Web application hosting, Data analytics"
                  value={formData.primaryUse}
                  onChange={(e) => setFormData({...formData, primaryUse: e.target.value})}
                  required
                  className="h-12 text-base border-2 focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="notes" className="text-base font-medium">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional details about your cloud infrastructure..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={4}
                  className="text-base border-2 focus:border-primary/50 transition-colors resize-none"
                />
              </div>

              <Button type="submit" variant="hero" className="w-full h-14 text-lg font-semibold">
                🚀 Analyze Platform Impact
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/20 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 -z-10">
            <img 
              src={analyticsDashboard} 
              alt="Analytics dashboard" 
              className="w-full h-full object-cover opacity-5"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-card/90 to-card/95"></div>
          </div>
          
          <CardHeader className="bg-gradient-to-r from-success/5 to-primary/5 border-b">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-full bg-gradient-to-br from-success to-primary">
                <ChartBar className="w-5 h-5 text-primary-foreground" />
              </div>
              Live Data Stream ({submissions.length} entries)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {submissions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Ready to Analyze</h3>
                <p className="text-muted-foreground text-lg mb-6">
                  Submit the form to see real-time data visualization
                </p>
                
                {/* Preview Card */}
                <div className="max-w-sm mx-auto p-4 rounded-lg bg-muted/30 border border-border/30">
                  <img 
                    src={codeScreen} 
                    alt="Code preview" 
                    className="w-full h-24 object-cover rounded opacity-60"
                  />
                  <p className="text-xs text-muted-foreground mt-3">Data processing pipeline ready</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Recent Submissions</h3>
                  <Badge variant="outline" className="bg-success/10 text-success">
                    {submissions.length} Active
                  </Badge>
                </div>
                
                {submissions.slice(-3).map((submission, index) => (
                  <div key={submission.id} className="p-6 bg-gradient-to-r from-background/80 to-muted/60 rounded-xl border border-muted hover:border-primary/30 transition-all duration-300 backdrop-blur-sm hover:shadow-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="font-semibold text-lg flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                        {submission.organization}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        #{submissions.length - index}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Cloud className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">Provider:</span>
                        <span className="font-medium">{submission.provider}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-success" />
                        <span className="text-muted-foreground">Spend:</span>
                        <span className="font-medium text-success">{formatCurrency(Number(submission.monthlySpend), currency)}/mo</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm mb-3">
                      <Leaf className="w-4 h-4 text-warning" />
                      <span className="text-muted-foreground">Carbon:</span>
                      <span className="font-medium text-warning">
                        {submission.carbonFootprint 
                          ? formatCarbonResult(submission.carbonFootprint, carbonUnit)
                          : "0 kg CO₂e"
                        }
                      </span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                      <span>•</span>
                      <span>{submission.services}</span>
                      <span>•</span>
                      <span>{submission.timestamp}</span>
                      {submission.region && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            <span>{submission.region}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                
                {submissions.length > 3 && (
                  <div className="text-center pt-4">
                    <Button variant="outline" size="sm">
                      View All {submissions.length} Entries
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
