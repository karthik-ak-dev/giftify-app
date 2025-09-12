# Giftify - Gift Card Selling Platform

## Technical Design Document

### Overview
Giftify is a serverless gift card selling platform built on AWS with Node.js/TypeScript Lambda functions, DynamoDB for data storage, and RESTful APIs. The platform features an internal wallet system, comprehensive product management, cart functionality, and intelligent order fulfillment with automatic refund processing.

### System Architecture

#### Technology Stack
- **Backend**: Node.js with TypeScript
- **Runtime**: AWS Lambda Functions
- **Database**: Amazon DynamoDB
- **API**: RESTful APIs with JSON
- **Authentication**: JWT-based authentication
- **Deployment**: Serverless Framework / AWS SAM

#### Core Components
1. **User Management Service** - User registration, authentication, profile management
2. **Wallet Service** - Balance management, transactions, refunds
3. **Product Management Service** - Products, variants, inventory
4. **Cart Service** - Shopping cart operations
5. **Order Management Service** - Order processing, fulfillment, status tracking
6. **Inventory Service** - Stock management and updates

---

## Database Design (DynamoDB)

### Table Structure Overview
DynamoDB tables are designed with single-table design principles where applicable, using composite keys and GSIs for efficient querying.

### 1. Users Table

**Table Name**: `giftify-users`

**Primary Key**: 
- Partition Key: `userId` (String)

**Attributes**:
```json
{
  "userId": "user_01HXXX...", // ULID
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "isEmailVerified": true,
  "isPhoneVerified": false,
  "status": "ACTIVE", // ACTIVE, SUSPENDED, DELETED
  "walletBalance": 0, // In cents/paise
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "lastLoginAt": "2024-01-15T10:30:00Z"
}
```

**Global Secondary Indexes**:
- GSI1: `email` (Partition Key) - for login by email

### 2. Wallet Transactions Table

**Table Name**: `giftify-wallet-transactions`

**Primary Key**:
- Partition Key: `userId` (String)
- Sort Key: `transactionId` (String)

**Attributes**:
```json
{
  "userId": "user_01HXXX...",
  "transactionId": "txn_01HXXX...", // ULID
  "type": "CREDIT", // CREDIT, DEBIT, REFUND
  "amount": 50000, // In cents/paise
  "balanceAfter": 150000,
  "description": "Manual wallet top-up",
  "orderId": "order_01HXXX...", // Optional, for order-related transactions
  "status": "COMPLETED", // PENDING, COMPLETED, FAILED
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Global Secondary Indexes**:
- GSI1: `transactionId` (Partition Key) - for transaction lookup
- GSI2: `userId` + `createdAt` (Sort Key) - for transaction history

### 3. Products Table

**Table Name**: `giftify-products`

**Primary Key**: 
- Partition Key: `productId` (String)

**Attributes**:
```json
{
  "productId": "prod_01HXXX...", // ULID
  "name": "Zomato",
  "description": "Zomato Gift Card - Food delivery and dining",
  "brand": "Zomato",
  "category": "FOOD_DELIVERY", // FOOD_DELIVERY, SHOPPING, ENTERTAINMENT, etc.
  "imageUrl": "https://cdn.giftify.com/products/zomato.jpg",
  "thumbnailUrl": "https://cdn.giftify.com/products/zomato-thumb.jpg",
  "isActive": true,
  "termsAndConditions": "Valid for 1 year from purchase date...",
  "howToRedeem": "Present this gift card at checkout...",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Global Secondary Indexes**:
- GSI1: `category` + `createdAt` (Sort Key) - for category-based listing
- GSI2: `isActive` + `name` (Sort Key) - for active products listing

### 4. Product Variants Table

**Table Name**: `giftify-product-variants`

**Primary Key**:
- Partition Key: `productId` (String)
- Sort Key: `variantId` (String)

**Attributes**:
```json
{
  "productId": "prod_01HXXX...",
  "variantId": "var_01HXXX...", // ULID
  "name": "Zomato 250",
  "denomination": 250, // Face value in rupees
  "mrp": 25000, // MRP in cents/paise (₹250)
  "costPrice": 22000, // Cost price in cents/paise (₹220) - what we paid for this variant
  "discountPercent": 5, // 5% discount
  "sellingPrice": 23750, // Selling price in cents/paise (₹237.50)
  "stockQuantity": 1000,
  "minOrderQuantity": 1,
  "maxOrderQuantity": 10,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Global Secondary Indexes**:
- GSI1: `variantId` (Partition Key) - for direct variant lookup
- GSI2: `productId` + `isActive` + `denomination` (Sort Key) - for active variants by denomination

### 5. Shopping Cart Table

**Table Name**: `giftify-cart`

**Primary Key**:
- Partition Key: `userId` (String)

**Attributes**:
```json
{
  "userId": "user_01HXXX...",
  "items": [
    {
      "variantId": "var_01HXXX...",
      "productId": "prod_01HXXX...",
      "productName": "Zomato",
      "variantName": "Zomato 250",
      "quantity": 2,
      "unitPrice": 23750, // Price at time of adding to cart
      "totalPrice": 47500
    },
    {
      "variantId": "var_01HYYY...",
      "productId": "prod_01HYYY...",
      "productName": "Amazon",
      "variantName": "Amazon 500",
      "quantity": 1,
      "unitPrice": 47500,
      "totalPrice": 47500
    }
  ],
  "totalAmount": 95000, // Sum of all item totalPrices
  "totalItems": 3, // Sum of all quantities
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Note**: Each user can have only one active cart with multiple variants and quantities stored as an array. The cart is locked during order processing and cleared once the order is completed.

### 6. Orders Table

**Table Name**: `giftify-orders`

**Primary Key**:
- Partition Key: `orderId` (String)

**Attributes**:
```json
{
  "orderId": "order_01HXXX...", // ULID
  "userId": "user_01HXXX...",
  "status": "PROCESSING", // PENDING, PROCESSING, PARTIALLY_FULFILLED, FULFILLED, CANCELLED, REFUNDED
  "totalAmount": 95000, // Total order amount in cents/paise
  "paidAmount": 95000, // Amount debited from wallet
  "refundAmount": 0, // Amount refunded due to partial fulfillment
  "items": [
    {
      "variantId": "var_01HXXX...",
      "productId": "prod_01HXXX...",
      "productName": "Zomato",
      "variantName": "Zomato 250",
      "unitPrice": 23750,
      "requestedQuantity": 4,
      "fulfilledQuantity": 3,
      "totalPrice": 95000,
      "fulfilledPrice": 71250,
      "refundedPrice": 23750
    }
  ],
  "fulfillmentDetails": {
    "attemptedAt": "2024-01-15T10:35:00Z",
    "fulfilledAt": "2024-01-15T10:36:00Z",
    "partialFulfillment": true,
    "refundProcessed": true
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:36:00Z"
}
```

**Global Secondary Indexes**:
- GSI1: `userId` + `createdAt` (Sort Key) - for user order history
- GSI2: `status` + `createdAt` (Sort Key) - for order management

### 7. Gift Cards Table

**Table Name**: `giftify-gift-cards`

**Primary Key**:
- Partition Key: `giftCardId` (String)

**Attributes**:
```json
{
  "giftCardId": "gc_01HXXX...", // ULID
  "orderId": "order_01HXXX...",
  "userId": "user_01HXXX...",
  "productId": "prod_01HXXX...",
  "variantId": "var_01HXXX...",
  "productName": "Zomato",
  "variantName": "Zomato 250",
  "denomination": 250,
  "giftCardNumber": "1234-5678-9012-3456", // Encrypted
  "giftCardPin": "1234", // Encrypted
  "expiryDate": "2025-01-15",
  "status": "ACTIVE", // ACTIVE, REDEEMED, EXPIRED, CANCELLED
  "purchasePrice": 23750,
  "issuedAt": "2024-01-15T10:36:00Z",
  "redeemedAt": null,
  "createdAt": "2024-01-15T10:36:00Z",
  "updatedAt": "2024-01-15T10:36:00Z"
}
```

**Global Secondary Indexes**:
- GSI1: `userId` + `issuedAt` (Sort Key) - for user's gift cards
- GSI2: `orderId` + `giftCardId` (Sort Key) - for order-related gift cards
- GSI3: `giftCardNumber` (Partition Key) - for gift card lookup (encrypted)

**Note**: Inventory logs table has been removed as stock quantity is directly managed in the products table. Stock updates will be handled atomically during order processing.

---

## API Design

### Authentication
All APIs (except registration/login) require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Insufficient wallet balance",
    "details": {}
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## API Endpoints

### 1. Authentication & User Management

#### POST /auth/register
Register a new user
```json
// Request
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}

// Response
{
  "success": true,
  "data": {
    "userId": "user_01HXXX...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### POST /auth/login
User login
```json
// Request
{
  "email": "user@example.com",
  "password": "securePassword123"
}

// Response - Same as register
```

#### POST /auth/refresh
Refresh access token
```json
// Request
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

// Response
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### GET /users/profile
Get user profile
```json
// Response
{
  "success": true,
  "data": {
    "userId": "user_01HXXX...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "walletBalance": 150000,
    "isEmailVerified": true,
    "isPhoneVerified": false
  }
}
```

#### PUT /users/profile
Update user profile
```json
// Request
{
  "firstName": "John",
  "lastName": "Smith",
  "phoneNumber": "+1234567890"
}

// Response - Updated profile data
```

### 2. Wallet Management

#### GET /wallet/balance
Get wallet balance
```json
// Response
{
  "success": true,
  "data": {
    "balance": 150000, // In cents/paise
    "balanceFormatted": "₹1,500.00"
  }
}
```

#### POST /wallet/topup
Manual wallet top-up
```json
// Request
{
  "amount": 50000, // In cents/paise
  "description": "Manual wallet top-up"
}

// Response
{
  "success": true,
  "data": {
    "transactionId": "txn_01HXXX...",
    "amount": 50000,
    "newBalance": 200000,
    "status": "COMPLETED"
  }
}
```

#### GET /wallet/transactions
Get wallet transaction history
```json
// Query Parameters: ?page=1&limit=20&type=CREDIT

// Response
{
  "success": true,
  "data": {
    "transactions": [
      {
        "transactionId": "txn_01HXXX...",
        "type": "CREDIT",
        "amount": 50000,
        "balanceAfter": 200000,
        "description": "Manual wallet top-up",
        "status": "COMPLETED",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "hasNext": true
    }
  }
}
```

### 3. Product Management

#### GET /products
Get all products and variants (MVP - No pagination, categories, or search)
```json
// Response
{
  "success": true,
  "data": {
    "products": [
      {
        "productId": "prod_01HXXX...",
        "name": "Zomato",
        "description": "Zomato Gift Card - Food delivery and dining",
        "brand": "Zomato",
        "category": "FOOD_DELIVERY",
        "imageUrl": "https://cdn.giftify.com/products/zomato.jpg",
        "thumbnailUrl": "https://cdn.giftify.com/products/zomato-thumb.jpg",
        "termsAndConditions": "Valid for 1 year from purchase date...",
        "howToRedeem": "Present this gift card at checkout...",
        "variants": [
          {
            "variantId": "var_01HXXX...",
            "name": "Zomato 250",
            "denomination": 250,
            "mrp": 25000,
            "discountPercent": 5,
            "sellingPrice": 23750,
            "stockQuantity": 997,
            "minOrderQuantity": 1,
            "maxOrderQuantity": 10,
            "isActive": true
          }
        ]
      }
    ]
  }
}
```

### 4. Shopping Cart

#### GET /cart
Get user's cart
```json
// Response
{
  "success": true,
  "data": {
    "items": [
      {
        "variantId": "var_01HXXX...",
        "productId": "prod_01HXXX...",
        "productName": "Zomato",
        "variantName": "Zomato 250",
        "quantity": 2,
        "unitPrice": 23750,
        "totalPrice": 47500,
        "stockAvailable": 997
      },
      {
        "variantId": "var_01HYYY...",
        "productId": "prod_01HYYY...",
        "productName": "Amazon",
        "variantName": "Amazon 500",
        "quantity": 1,
        "unitPrice": 47500,
        "totalPrice": 47500,
        "stockAvailable": 500
      }
    ],
    "summary": {
      "totalItems": 3,
      "totalAmount": 95000,
      "totalAmountFormatted": "₹950.00"
    }
  }
}
```

#### PUT /cart/manage
Add, update, or remove items from cart (unified endpoint)
```json
// Request - Add/Update item (quantity > 0)
{
  "variantId": "var_01HXXX...",
  "quantity": 2
}

// Request - Remove item (quantity = 0)
{
  "variantId": "var_01HXXX...",
  "quantity": 0
}

// Response
{
  "success": true,
  "data": {
    "message": "Cart updated successfully",
    "cartSummary": {
      "totalItems": 2,
      "totalAmount": 47500
    }
  }
}
```

#### DELETE /cart/clear
Clear entire cart
```json
// Response
{
  "success": true,
  "data": {
    "message": "Cart cleared"
  }
}
```

### 5. Order Management

#### POST /orders/create
Create order from cart
```json
// Request
{
  "items": [
    {
      "variantId": "var_01HXXX...",
      "quantity": 4
    }
  ]
}

// Response
{
  "success": true,
  "data": {
    "orderId": "order_01HXXX...",
    "status": "PENDING",
    "totalAmount": 95000,
    "items": [
      {
        "variantId": "var_01HXXX...",
        "productName": "Zomato",
        "variantName": "Zomato 250",
        "quantity": 4,
        "unitPrice": 23750,
        "totalPrice": 95000
      }
    ],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### GET /orders
Get user's orders
```json
// Query Parameters: ?page=1&limit=10&status=FULFILLED

// Response
{
  "success": true,
  "data": {
    "orders": [
      {
        "orderId": "order_01HXXX...",
        "status": "PARTIALLY_FULFILLED",
        "totalAmount": 95000,
        "paidAmount": 95000,
        "refundAmount": 23750,
        "itemCount": 1,
        "createdAt": "2024-01-15T10:30:00Z",
        "fulfilledAt": "2024-01-15T10:36:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "hasNext": false
    }
  }
}
```

#### GET /orders/:orderId
Get order details
```json
// Response
{
  "success": true,
  "data": {
    "orderId": "order_01HXXX...",
    "status": "PARTIALLY_FULFILLED",
    "totalAmount": 95000,
    "paidAmount": 95000,
    "refundAmount": 23750,
    "items": [
      {
        "variantId": "var_01HXXX...",
        "productName": "Zomato",
        "variantName": "Zomato 250",
        "unitPrice": 23750,
        "requestedQuantity": 4,
        "fulfilledQuantity": 3,
        "totalPrice": 95000,
        "fulfilledPrice": 71250,
        "refundedPrice": 23750
      }
    ],
    "fulfillmentDetails": {
      "attemptedAt": "2024-01-15T10:35:00Z",
      "fulfilledAt": "2024-01-15T10:36:00Z",
      "partialFulfillment": true,
      "refundProcessed": true
    },
    "giftCards": [
      {
        "giftCardId": "gc_01HXXX...",
        "productName": "Zomato",
        "variantName": "Zomato 250",
        "denomination": 250,
        "giftCardNumber": "****-****-****-3456",
        "status": "ACTIVE",
        "expiryDate": "2025-01-15"
      }
    ],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:36:00Z"
  }
}
```

#### POST /orders/:orderId/cancel
Cancel order (if not processed)
```json
// Response
{
  "success": true,
  "data": {
    "orderId": "order_01HXXX...",
    "status": "CANCELLED",
    "refundAmount": 95000,
    "message": "Order cancelled and refund processed"
  }
}
```

### 6. Gift Cards

**Note**: Gift card endpoints are not exposed in the public API for MVP. Gift card details are included in the order details response when users view their orders.

### 7. Admin APIs (Future Enhancement)

#### GET /admin/inventory
Get inventory status
#### PUT /admin/inventory/:variantId
Update inventory
#### GET /admin/orders
Get all orders for management
#### GET /admin/analytics
Get platform analytics

---

## Data Flow Patterns

### 1. Order Processing Flow
1. User adds items to cart
2. User creates order from cart
3. System validates inventory availability
4. System debits wallet balance
5. System attempts fulfillment:
   - If full stock available: Complete fulfillment
   - If partial stock: Partial fulfillment + automatic refund
6. System generates gift cards for fulfilled items
7. System updates inventory
8. System clears cart
9. System sends confirmation

### 2. Wallet Transaction Flow
1. User initiates wallet top-up
2. System creates pending transaction
3. System updates user balance
4. System marks transaction as completed
5. System logs transaction history

### 3. Inventory Management Flow
1. Order fulfillment triggers inventory check
2. System reserves stock for order
3. System deducts stock atomically on successful fulfillment
4. System releases reserved stock on order cancellation
5. Stock updates are handled directly in the products table without separate logging

---

## Security Considerations

### 1. Data Encryption
- Gift card numbers and PINs stored encrypted
- Sensitive user data encrypted at rest
- JWT tokens for stateless authentication

### 2. Access Control
- Role-based access (User, Admin)
- API rate limiting
- Input validation and sanitization

### 3. Financial Security
- Atomic transactions for wallet operations
- Audit trails for all financial transactions
- Idempotency keys for critical operations

---

## Scalability & Performance

### 1. DynamoDB Optimization
- Efficient partition key distribution
- Strategic use of GSIs
- Batch operations where applicable
- Connection pooling

### 2. Lambda Optimization
- Cold start minimization
- Memory optimization
- Concurrent execution limits
- Dead letter queues for error handling

### 3. Caching Strategy
- API Gateway caching for product catalogs
- Lambda memory caching for frequently accessed data
- CloudFront for static assets

---

## Monitoring & Logging

### 1. Application Metrics
- API response times
- Error rates
- Order fulfillment rates
- Wallet transaction success rates

### 2. Business Metrics
- Daily/Monthly active users
- Revenue tracking
- Popular products
- Cart abandonment rates

### 3. System Health
- Lambda function performance
- DynamoDB throttling
- Error tracking and alerting

---

This technical design provides a comprehensive foundation for building the Giftify platform with scalable architecture, efficient data modeling, and robust API design that supports all the required functionality including wallet management, product variants, cart operations, and intelligent order fulfillment with automatic refund processing.