import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { ENV_CONFIG } from '../config/env';

// Production DynamoDB client configuration
const dynamoDBClient = new DynamoDBClient({
  region: ENV_CONFIG.AWS_REGION || 'us-east-1',
  ...(ENV_CONFIG.DYNAMODB_ENDPOINT && {
    endpoint: ENV_CONFIG.DYNAMODB_ENDPOINT
  })
});

// Document client for easier JSON operations
export const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

console.log(`DynamoDB client initialized for region: ${ENV_CONFIG.AWS_REGION || 'us-east-1'}`);
if (ENV_CONFIG.DYNAMODB_ENDPOINT) {
  console.log(`Using DynamoDB endpoint: ${ENV_CONFIG.DYNAMODB_ENDPOINT}`);
} 