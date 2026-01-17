import { CostAndUsageReportsClient } from '@aws-sdk/client-cost-and-usage-reports';
import { AthenaClient } from '@aws-sdk/client-athena';
import { S3Client } from '@aws-sdk/client-s3';

export interface AWSConfig {
  region: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  targetAccountRoleName?: string;
  billingDataBucket?: string;
  athenaDatabase?: string;
  athenaWorkgroup?: string;
  athenaQueryResultsLocation?: string;
}

export const awsConfig: AWSConfig = {
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
  secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  targetAccountRoleName: import.meta.env.VITE_AWS_TARGET_ACCOUNT_ROLE_NAME,
  billingDataBucket: import.meta.env.VITE_AWS_BILLING_DATA_BUCKET,
  athenaDatabase: import.meta.env.VITE_AWS_ATHENA_DATABASE || 'ccf',
  athenaWorkgroup: import.meta.env.VITE_AWS_ATHENA_WORKGROUP || 'primary',
  athenaQueryResultsLocation: import.meta.env.VITE_AWS_ATHENA_QUERY_RESULTS_LOCATION,
};

// AWS SDK clients
export const createAWSClients = () => {
  const clientConfig = {
    region: awsConfig.region,
    credentials: awsConfig.accessKeyId && awsConfig.secretAccessKey ? {
      accessKeyId: awsConfig.accessKeyId,
      secretAccessKey: awsConfig.secretAccessKey,
    } : undefined,
  };

  return {
    costAndUsageReports: new CostAndUsageReportsClient(clientConfig),
    athena: new AthenaClient(clientConfig),
    s3: new S3Client(clientConfig),
  };
};
