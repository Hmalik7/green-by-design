import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

export function CloudServicesTab() {
  const [cloudProvider, setCloudProvider] = useState("AWS");
  const [ec2InstanceType, setEc2InstanceType] = useState("t2.micro");
  const [ec2Instances, setEc2Instances] = useState(1);
  const [ec2Utilization, setEc2Utilization] = useState([50]);
  const [awsRegion, setAwsRegion] = useState("us-east-1");
  const [dynamoDBStorage, setDynamoDBStorage] = useState(0);
  const [dynamoDBRequests, setDynamoDBRequests] = useState(0);

  const increment = (setter: (val: number) => void, current: number) => {
    setter(current + 1);
  };

  const decrement = (setter: (val: number) => void, current: number) => {
    if (current > 0) {
      setter(current - 1);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Cloud Services Emissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cloud Provider Selection */}
          <div>
            <Label htmlFor="cloud-provider" className="text-white mb-2 block">
              Select Cloud Provider
            </Label>
            <Select value={cloudProvider} onValueChange={setCloudProvider}>
              <SelectTrigger
                id="cloud-provider"
                className="w-full bg-gray-900 border-gray-700 text-white"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="AWS" className="text-white hover:bg-gray-800">
                  AWS
                </SelectItem>
                <SelectItem value="GCP" className="text-white hover:bg-gray-800">
                  Google Cloud Platform
                </SelectItem>
                <SelectItem value="Azure" className="text-white hover:bg-gray-800">
                  Microsoft Azure
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* AWS Infrastructure Details */}
          {cloudProvider === "AWS" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">AWS Infrastructure Details</h3>

              {/* EC2 Instances */}
              <div className="space-y-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                <h4 className="text-md font-semibold text-white">EC2 Instances</h4>

                <div>
                  <Label htmlFor="ec2-instance-type" className="text-gray-300 mb-2 block">
                    EC2 Instance Type
                  </Label>
                  <Select value={ec2InstanceType} onValueChange={setEc2InstanceType}>
                    <SelectTrigger
                      id="ec2-instance-type"
                      className="w-full bg-gray-800 border-gray-700 text-white"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="t2.micro" className="text-white hover:bg-gray-800">
                        t2.micro
                      </SelectItem>
                      <SelectItem value="t2.small" className="text-white hover:bg-gray-800">
                        t2.small
                      </SelectItem>
                      <SelectItem value="t2.medium" className="text-white hover:bg-gray-800">
                        t2.medium
                      </SelectItem>
                      <SelectItem value="t3.micro" className="text-white hover:bg-gray-800">
                        t3.micro
                      </SelectItem>
                      <SelectItem value="t3.small" className="text-white hover:bg-gray-800">
                        t3.small
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ec2-instances" className="text-gray-300 mb-2 block">
                    Number of instances
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => decrement(setEc2Instances, ec2Instances)}
                      className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      id="ec2-instances"
                      type="number"
                      value={ec2Instances}
                      onChange={(e) => setEc2Instances(parseInt(e.target.value) || 0)}
                      className="flex-1 bg-gray-800 border-gray-700 text-white text-center"
                      min="0"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => increment(setEc2Instances, ec2Instances)}
                      className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300 mb-2 block">
                    Average Utilization (%): {ec2Utilization[0]}
                  </Label>
                  <Slider
                    value={ec2Utilization}
                    onValueChange={setEc2Utilization}
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="aws-region" className="text-gray-300 mb-2 block">
                    AWS Region
                  </Label>
                  <Select value={awsRegion} onValueChange={setAwsRegion}>
                    <SelectTrigger
                      id="aws-region"
                      className="w-full bg-gray-800 border-gray-700 text-white"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="us-east-1" className="text-white hover:bg-gray-800">
                        US East
                      </SelectItem>
                      <SelectItem value="us-west-1" className="text-white hover:bg-gray-800">
                        US West
                      </SelectItem>
                      <SelectItem value="eu-west-1" className="text-white hover:bg-gray-800">
                        EU West
                      </SelectItem>
                      <SelectItem value="ap-southeast-1" className="text-white hover:bg-gray-800">
                        Asia Pacific
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* DynamoDB */}
              <div className="space-y-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                <h4 className="text-md font-semibold text-white">DynamoDB</h4>

                <div>
                  <Label htmlFor="dynamodb-storage" className="text-gray-300 mb-2 block">
                    DynamoDB Storage (GB)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => decrement(setDynamoDBStorage, dynamoDBStorage)}
                      className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      id="dynamodb-storage"
                      type="number"
                      value={dynamoDBStorage}
                      onChange={(e) => setDynamoDBStorage(parseFloat(e.target.value) || 0)}
                      className="flex-1 bg-gray-800 border-gray-700 text-white text-center"
                      min="0"
                      step="0.1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => increment(setDynamoDBStorage, dynamoDBStorage)}
                      className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="dynamodb-requests" className="text-gray-300 mb-2 block">
                    Monthly Requests (millions)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => decrement(setDynamoDBRequests, dynamoDBRequests)}
                      className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      id="dynamodb-requests"
                      type="number"
                      value={dynamoDBRequests.toFixed(2)}
                      onChange={(e) => setDynamoDBRequests(parseFloat(e.target.value) || 0)}
                      className="flex-1 bg-gray-800 border-gray-700 text-white text-center"
                      min="0"
                      step="0.01"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => increment(setDynamoDBRequests, dynamoDBRequests)}
                      className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* EKS (Kubernetes) */}
              <div className="space-y-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                <h4 className="text-md font-semibold text-white">EKS (Kubernetes)</h4>
                <p className="text-sm text-gray-400">
                  EKS configuration options will be implemented here.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

