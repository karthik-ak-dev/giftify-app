import { PutCommand, GetCommand, DeleteCommand, UpdateCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { User, USER_TABLE, USER_EMAIL_GSI } from '../models/UserModel';
import { docClient } from '../utils/database';

export class UserRepository {
  async create(user: User): Promise<User> {
    const command = new PutCommand({
      TableName: USER_TABLE,
      Item: user,
      ConditionExpression: 'attribute_not_exists(userId) AND attribute_not_exists(email)' // Prevent duplicate user or email
    });
    
    try {
      await docClient.send(command);
      return user;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('User already exists or email is already registered');
      }
      throw error;
    }
  }

  async findById(userId: string): Promise<User | null> {
    const command = new GetCommand({
      TableName: USER_TABLE,
      Key: { userId }
    });
    
    const result = await docClient.send(command);
    return result.Item ? new User(result.Item as any) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const command = new QueryCommand({
      TableName: USER_TABLE,
      IndexName: USER_EMAIL_GSI,
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    });
    
    const result = await docClient.send(command);
    return (result.Items && result.Items.length > 0) ? new User(result.Items[0] as any) : null;
  }

  async save(user: User): Promise<User> {
    user.update({}); // This updates the updatedAt timestamp
    
    const command = new PutCommand({
      TableName: USER_TABLE,
      Item: user
    });
    
    await docClient.send(command);
    return user;
  }

  async updateWalletBalance(user: User, newBalance: number): Promise<User> {
    user.update({ walletBalance: newBalance });
    
    const command = new UpdateCommand({
      TableName: USER_TABLE,
      Key: { userId: user.userId },
      UpdateExpression: 'SET walletBalance = :balance, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':balance': user.walletBalance,
        ':updatedAt': user.updatedAt
      },
      ConditionExpression: 'attribute_exists(userId)' // Ensure user exists
    });
    
    try {
      await docClient.send(command);
      return user;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('User not found');
      }
      throw error;
    }
  }

  async updateLastLogin(user: User): Promise<User> {
    user.update({ lastLoginAt: new Date().toISOString() });
    
    const command = new UpdateCommand({
      TableName: USER_TABLE,
      Key: { userId: user.userId },
      UpdateExpression: 'SET lastLoginAt = :lastLogin, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':lastLogin': user.lastLoginAt,
        ':updatedAt': user.updatedAt
      },
      ConditionExpression: 'attribute_exists(userId)' // Ensure user exists
    });
    
    try {
      await docClient.send(command);
      return user;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('User not found');
      }
      throw error;
    }
  }

  // Advanced user operations
  async updateUserStatus(user: User, status: 'ACTIVE' | 'SUSPENDED' | 'DELETED'): Promise<User> {
    switch (status) {
      case 'ACTIVE':
        user.activate();
        break;
      case 'SUSPENDED':
        user.suspend();
        break;
      case 'DELETED':
        user.markAsDeleted();
        break;
    }
    
    const command = new UpdateCommand({
      TableName: USER_TABLE,
      Key: { userId: user.userId },
      UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': user.status,
        ':updatedAt': user.updatedAt
      },
      ConditionExpression: 'attribute_exists(userId)' // Ensure user exists
    });
    
    try {
      await docClient.send(command);
      return user;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('User not found');
      }
      throw error;
    }
  }

  async verifyEmail(user: User): Promise<User> {
    user.verifyEmail();
    
    const command = new UpdateCommand({
      TableName: USER_TABLE,
      Key: { userId: user.userId },
      UpdateExpression: 'SET isEmailVerified = :verified, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':verified': user.isEmailVerified,
        ':updatedAt': user.updatedAt
      },
      ConditionExpression: 'attribute_exists(userId) AND isEmailVerified = :false', // Only verify if not already verified
      ExpressionAttributeNames: {},
    });
    
    // Add false to condition values
    command.input.ExpressionAttributeValues![':false'] = false;
    
    try {
      await docClient.send(command);
      return user;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('User not found or email already verified');
      }
      throw error;
    }
  }

  async atomicWalletOperation(userId: string, amount: number, operation: 'ADD' | 'SUBTRACT'): Promise<User> {
    const expression = operation === 'ADD' 
      ? 'ADD walletBalance :amount SET updatedAt = :updatedAt'
      : 'ADD walletBalance :negAmount SET updatedAt = :updatedAt';
    
    const command = new UpdateCommand({
      TableName: USER_TABLE,
      Key: { userId },
      UpdateExpression: expression,
      ExpressionAttributeValues: {
        [operation === 'ADD' ? ':amount' : ':negAmount']: operation === 'ADD' ? amount : -amount,
        ':updatedAt': new Date().toISOString()
      },
      ConditionExpression: operation === 'SUBTRACT' 
        ? 'attribute_exists(userId) AND walletBalance >= :minBalance'
        : 'attribute_exists(userId)',
      ReturnValues: 'ALL_NEW'
    });
    
    if (operation === 'SUBTRACT') {
      command.input.ExpressionAttributeValues![':minBalance'] = amount;
    }
    
    try {
      const result = await docClient.send(command);
      return new User(result.Attributes as any);
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        if (operation === 'SUBTRACT') {
          throw new Error('Insufficient wallet balance');
        } else {
          throw new Error('User not found');
        }
      }
      throw error;
    }
  }

  async delete(user: User): Promise<void> {
    const command = new DeleteCommand({
      TableName: USER_TABLE,
      Key: { userId: user.userId },
      ConditionExpression: '#status = :deleted OR #status = :suspended', // Only delete if already marked as deleted or suspended
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':deleted': 'DELETED',
        ':suspended': 'SUSPENDED'
      }
    });
    
    try {
      await docClient.send(command);
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Cannot delete active users. Mark as deleted first.');
      }
      throw error;
    }
  }

  // Validation and utility methods
  async validateUserExists(userId: string): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }
  }

  async validateEmailNotExists(email: string, excludeUserId?: string): Promise<void> {
    const existingUser = await this.findByEmail(email);
    if (existingUser && existingUser.userId !== excludeUserId) {
      throw new Error('Email already registered');
    }
  }
}

export const userRepository = new UserRepository(); 