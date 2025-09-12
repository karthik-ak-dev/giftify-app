import { ENV_CONFIG } from '../config/env';

// Mock DynamoDB types for development (replace with actual AWS SDK when dependencies are installed)
interface MockDynamoDBItem {
  [key: string]: any;
}

interface MockQueryResult {
  Items?: MockDynamoDBItem[];
  LastEvaluatedKey?: any;
  Count?: number;
}

export class DatabaseClient {
  private mockData: Map<string, Map<string, MockDynamoDBItem>> = new Map();

  constructor() {
    console.log(`Database client initialized for environment: ${ENV_CONFIG.NODE_ENV}`);
    if (ENV_CONFIG.DYNAMODB_ENDPOINT) {
      console.log(`DynamoDB endpoint: ${ENV_CONFIG.DYNAMODB_ENDPOINT}`);
    }
  }

  async put(tableName: string, item: MockDynamoDBItem): Promise<MockDynamoDBItem> {
    if (!this.mockData.has(tableName)) {
      this.mockData.set(tableName, new Map());
    }
    
    const table = this.mockData.get(tableName)!;
    const key = this.generateKey(item);
    table.set(key, { ...item });
    
    console.log(`PUT item to ${tableName}:`, key);
    return item;
  }

  async get(tableName: string, key: MockDynamoDBItem): Promise<MockDynamoDBItem | null> {
    const table = this.mockData.get(tableName);
    if (!table) return null;
    
    const keyString = this.generateKey(key);
    const item = table.get(keyString);
    
    console.log(`GET item from ${tableName}:`, keyString, item ? 'found' : 'not found');
    return item || null;
  }

  async update(tableName: string, key: MockDynamoDBItem, updateData: MockDynamoDBItem): Promise<MockDynamoDBItem> {
    const table = this.mockData.get(tableName);
    if (!table) {
      throw new Error(`Table ${tableName} not found`);
    }
    
    const keyString = this.generateKey(key);
    const existingItem = table.get(keyString);
    
    if (!existingItem) {
      throw new Error(`Item not found in ${tableName}`);
    }
    
    const updatedItem = { ...existingItem, ...updateData };
    table.set(keyString, updatedItem);
    
    console.log(`UPDATE item in ${tableName}:`, keyString);
    return updatedItem;
  }

  async delete(tableName: string, key: MockDynamoDBItem): Promise<void> {
    const table = this.mockData.get(tableName);
    if (!table) return;
    
    const keyString = this.generateKey(key);
    table.delete(keyString);
    
    console.log(`DELETE item from ${tableName}:`, keyString);
  }

  async query(tableName: string, partitionKey: string, partitionValue: any, sortKey?: string, sortValue?: any): Promise<MockDynamoDBItem[]> {
    const table = this.mockData.get(tableName);
    if (!table) return [];
    
    const items = Array.from(table.values()).filter(item => {
      if (item[partitionKey] !== partitionValue) return false;
      if (sortKey && sortValue !== undefined && item[sortKey] !== sortValue) return false;
      return true;
    });
    
    console.log(`QUERY ${tableName} where ${partitionKey}=${partitionValue}${sortKey ? ` AND ${sortKey}=${sortValue}` : ''}:`, items.length, 'items');
    return items;
  }

  async queryGSI(tableName: string, indexName: string, partitionKey: string, partitionValue: any, sortKey?: string, sortValue?: any): Promise<MockDynamoDBItem[]> {
    // For mock implementation, treat GSI query same as regular query
    console.log(`QUERY GSI ${indexName} on ${tableName}`);
    return this.query(tableName, partitionKey, partitionValue, sortKey, sortValue);
  }

  async scan(tableName: string, options?: any): Promise<MockDynamoDBItem[]> {
    const table = this.mockData.get(tableName);
    if (!table) return [];
    
    const items = Array.from(table.values());
    console.log(`SCAN ${tableName}:`, items.length, 'items');
    return items;
  }

  // Helper method for paginated queries
  async queryWithPagination(
    tableName: string, 
    partitionKey: string, 
    partitionValue: any, 
    options: {
      sortKey?: string;
      sortValue?: any;
      limit?: number;
      lastEvaluatedKey?: any;
      scanIndexForward?: boolean;
    } = {}
  ): Promise<{ items: MockDynamoDBItem[]; lastEvaluatedKey?: any; count: number }> {
    const items = await this.query(tableName, partitionKey, partitionValue, options.sortKey, options.sortValue);
    
    let paginatedItems = items;
    if (options.limit) {
      paginatedItems = items.slice(0, options.limit);
    }
    
    return {
      items: paginatedItems,
      lastEvaluatedKey: undefined, // Mock implementation doesn't handle pagination keys
      count: paginatedItems.length
    };
  }

  // Helper method for paginated GSI queries
  async queryGSIWithPagination(
    tableName: string, 
    indexName: string,
    partitionKey: string, 
    partitionValue: any, 
    options: {
      sortKey?: string;
      sortValue?: any;
      limit?: number;
      lastEvaluatedKey?: any;
      scanIndexForward?: boolean;
    } = {}
  ): Promise<{ items: MockDynamoDBItem[]; lastEvaluatedKey?: any; count: number }> {
    console.log(`QUERY GSI with pagination ${indexName} on ${tableName}`);
    return this.queryWithPagination(tableName, partitionKey, partitionValue, options);
  }

  private generateKey(item: MockDynamoDBItem): string {
    // Generate a simple key from the item's properties
    const keys = Object.keys(item).sort();
    return keys.map(key => `${key}:${item[key]}`).join('|');
  }
}

// Export singleton instance
export const db = new DatabaseClient(); 