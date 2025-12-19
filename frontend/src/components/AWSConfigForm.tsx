import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Settings, Eye, EyeOff } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import dotenv from "dotenv";

dotenv.config();

interface AWSCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

interface AWSConfigFormProps {
  onCredentialsUpdate: (credentials: AWSCredentials | null) => void;
}

const AWS_REGIONS = [
  { value: "us-east-1", label: "US East (N. Virginia)" },
  { value: "us-west-2", label: "US West (Oregon)" },
  { value: "eu-west-1", label: "Europe (Ireland)" },
  { value: "ap-southeast-1", label: "Asia Pacific (Singapore)" },
  { value: "ap-northeast-1", label: "Asia Pacific (Tokyo)" },
  { value: "eu-central-1", label: "Europe (Frankfurt)" },
  { value: "us-west-1", label: "US West (N. California)" },
  { value: "ap-south-1", label: "Asia Pacific (Mumbai)" },
  { value: "ca-central-1", label: "Canada (Central)" }
];

export const AWSConfigForm = ({ onCredentialsUpdate }: AWSConfigFormProps) => {
  const [credentials, setCredentials] = useState<AWSCredentials>({
    accessKeyId: "",
    secretAccessKey: "",
    region: "us-east-1"
  });
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const { toast } = useToast();

  // Load existing credentials on mount
  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const { data, error } = await supabase
          .from('aws_credentials')
          .select('*')
          .eq('is_default', true)
          .maybeSingle();

        if (data && !error) {
          const creds = {
            accessKeyId: data.access_key_id,
            secretAccessKey: data.secret_access_key,
            region: data.region
          };
          setCredentials(creds);
          setIsConfigured(true);
          onCredentialsUpdate(creds);
        }
      } catch (error) {
        console.error('Failed to load AWS credentials:', error);
      }
    };

    loadCredentials();
  }, [onCredentialsUpdate]);

  const handleSave = async () => {
    if (!credentials.accessKeyId || !credentials.secretAccessKey) {
      toast({
        title: "Missing credentials",
        description: "Please provide both Access Key ID and Secret Access Key",
        variant: "destructive"
      });
      return;
    }

    try {
      // First, clear any existing default credentials
      await supabase
        .from('aws_credentials')
        .update({ is_default: false })
        .eq('is_default', true);

      // Insert or update the new default credentials
      const { error } = await supabase
        .from('aws_credentials')
        .upsert({
          access_key_id: credentials.accessKeyId,
          secret_access_key: credentials.secretAccessKey,
          region: credentials.region,
          is_default: true,
          user_id: null
        });

      if (error) throw error;

      setIsConfigured(true);
      onCredentialsUpdate(credentials);
      toast({
        title: "AWS credentials saved",
        description: "Real AWS carbon footprint data will now be used",
      });
    } catch (error) {
      toast({
        title: "Failed to save credentials",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleClear = async () => {
    try {
      const { error } = await supabase
        .from('aws_credentials')
        .delete()
        .eq('is_default', true);

      if (error) throw error;

      setCredentials({
        accessKeyId: "",
        secretAccessKey: "",
        region: "us-east-1"
      });
      setIsConfigured(false);
      onCredentialsUpdate(null);
      toast({
        title: "AWS credentials cleared",
        description: "Reverting to estimated carbon footprint calculations",
      });
    } catch (error) {
      toast({
        title: "Failed to clear credentials",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/20">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-warning/5 border-b">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-full bg-gradient-to-br from-primary to-warning">
            <Settings className="w-5 h-5 text-primary-foreground" />
          </div>
          AWS Configuration
        </CardTitle>
        <CardDescription className="text-base">
          {isConfigured
            ? "✅ Connected to AWS - Using real carbon footprint data"
            : "Configure AWS credentials for accurate carbon footprint calculations"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="access-key" className="text-base font-medium">
              AWS Access Key ID
            </Label>
            <Input
              id="access-key"
              type="text"
              placeholder="AKIA..."
              value={credentials.accessKeyId}
              onChange={(e) => setCredentials({...credentials, accessKeyId: e.target.value})}
              className="h-12 text-base border-2 focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="secret-key" className="text-base font-medium">
              AWS Secret Access Key
            </Label>
            <div className="relative">
              <Input
                id="secret-key"
                type={showSecretKey ? "text" : "password"}
                placeholder="Enter your secret access key"
                value={credentials.secretAccessKey}
                onChange={(e) => setCredentials({...credentials, secretAccessKey: e.target.value})}
                className="h-12 text-base border-2 focus:border-primary/50 transition-colors pr-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setShowSecretKey(!showSecretKey)}
              >
                {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="region" className="text-base font-medium">
              AWS Region
            </Label>
            <Select
              value={credentials.region}
              onValueChange={(value) => setCredentials({...credentials, region: value})}
            >
              <SelectTrigger className="h-12 text-base border-2 focus:border-primary/50">
                <SelectValue placeholder="Select AWS region" />
              </SelectTrigger>
              <SelectContent className="bg-background border-2 shadow-lg z-50">
                {AWS_REGIONS.map((region) => (
                  <SelectItem key={region.value} value={region.value} className="text-base">
                    {region.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleSave}
              className="flex-1 h-12 text-base font-semibold"
              variant={isConfigured ? "outline" : "default"}
            >
              {isConfigured ? "Update Credentials" : "Save Credentials"}
            </Button>

            {isConfigured && (
              <Button
                onClick={handleClear}
                variant="destructive"
                className="h-12 text-base font-semibold"
              >
                Clear
              </Button>
            )}
          </div>

          <div className="p-4 bg-muted/50 rounded-lg border border-muted-foreground/20">
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Security Note:</strong> Credentials are securely stored in your Supabase database.
              For production applications, consider using AWS IAM roles or a secure backend service.
            </p>
            <p className="text-xs text-muted-foreground">
              Required AWS permissions: CloudWatch, EC2, S3, RDS read access for carbon footprint calculations.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};