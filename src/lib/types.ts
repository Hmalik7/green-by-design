export interface AWSAccount {
  id: string;
  name: string;
  isActive: boolean;
}

export interface CostAndUsageData {
  accountId: string;
  accountName: string;
  serviceName: string;
  usageType: string;
  cost: number;
  usage: number;
  timestamp: Date;
  region: string;
}

export interface EmissionEstimate {
  accountId: string;
  accountName: string;
  serviceName: string;
  co2Emissions: number;
  energyConsumption: number;
  cost: number;
  timestamp: Date;
  region: string;
}

export interface AthenaQueryResult {
  queryId: string;
  status: 'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED';
  results?: any[];
  error?: string;
}
