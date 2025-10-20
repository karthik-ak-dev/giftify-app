# 🚀 Giftify Backend Deployment Guide

## 📋 Overview

This project uses separate serverless configurations for **Stage** and **Production** environments to maintain clean separation and different settings for each environment.

**Architecture Highlights**:
- Unified Brand model (simplified from separate Product/Variant models)
- Single brands API endpoint with frontend-based filtering
- Wallet balance included in user profile (no separate endpoint)
- 14 total API endpoints for efficient operations

## 🏗️ Infrastructure Overview

### **Stage Environment (`serverless-stage.yml`)**
- **Purpose**: Development and testing
- **Memory**: 256MB
- **Logging**: Detailed (debug level)
- **Security**: Development keys (can be defaults)
- **Features**: Request logging enabled, detailed errors

### **Production Environment (`serverless-prod.yml`)**
- **Purpose**: Live production system
- **Memory**: 512MB
- **Logging**: Minimal (info level)
- **Security**: Must use secure environment variables
- **Features**: Point-in-time recovery, reserved concurrency, production tags

## 📊 Resources Created

### **Stage Deployment** (`npm run deploy:stage`)
```
CloudFormation Stack: giftify-backend-stage
Lambda Function: giftify-backend-stage-api
API Gateway: giftify-backend-stage

DynamoDB Tables:
├── giftify-backend-stage-users
├── giftify-backend-stage-wallet-transactions
├── giftify-backend-stage-brands
├── giftify-backend-stage-cart
├── giftify-backend-stage-orders
└── giftify-backend-stage-gift-cards

IAM Role: giftify-backend-stage-{region}-lambdaRole
```

### **Production Deployment** (`npm run deploy:prod`)
```
CloudFormation Stack: giftify-backend-prod
Lambda Function: giftify-backend-prod-api
API Gateway: giftify-backend-prod

DynamoDB Tables:
├── giftify-backend-prod-users
├── giftify-backend-prod-wallet-transactions
├── giftify-backend-prod-brands
├── giftify-backend-prod-cart
├── giftify-backend-prod-orders
└── giftify-backend-prod-gift-cards

IAM Role: giftify-backend-prod-{region}-lambdaRole
```

## 🛠️ Local Development

### **1. Install Dependencies**
```bash
npm install
```

### **2. Set Up Environment**
```bash
# Copy example environment files
cp env.stage.example .env.stage
cp env.prod.example .env.prod

# Edit with your values
nano .env.stage
```

### **3. Run Locally**
```bash
# Run with stage configuration
npm run offline:stage

# Run with production configuration (for testing)
npm run offline:prod
```

**Local Server**: `http://localhost:3000`

## 🚀 Deployment Commands

### **Stage Environment**
```bash
# Deploy to stage
npm run deploy:stage

# Get stage info
npm run info:stage

# View stage logs
npm run logs:stage

# Remove stage environment
npm run remove:stage
```

### **Production Environment**
```bash
# Deploy to production
npm run deploy:prod

# Get production info
npm run info:prod

# View production logs
npm run logs:prod

# Remove production environment
npm run remove:prod
```

## 🔐 Environment Variables

### **Stage Environment** (`.env.stage`)
```env
NODE_ENV=development
AWS_REGION=ap-southeast-1
JWT_ACCESS_SECRET=stage-jwt-access-secret-key-change-in-production-12345
JWT_REFRESH_SECRET=stage-jwt-refresh-secret-key-change-in-production-67890
ENCRYPTION_KEY=stage-encryption-key-32-chars-long
ENABLE_REQUEST_LOGGING=true
ENABLE_DETAILED_ERRORS=true
LOG_LEVEL=debug
CORS_ORIGIN=*
```

### **Production Environment** (`.env.prod`)
```env
NODE_ENV=production
AWS_REGION=us-east-1
JWT_ACCESS_SECRET=your-super-secure-jwt-access-secret-key-here
JWT_REFRESH_SECRET=your-super-secure-jwt-refresh-secret-key-here
ENCRYPTION_KEY=your-super-secure-32-char-encryption-key
ENABLE_REQUEST_LOGGING=false
ENABLE_DETAILED_ERRORS=false
LOG_LEVEL=info
CORS_ORIGIN=https://your-frontend-domain.com
```

## 🎯 Deployment Workflow

### **1. Stage Deployment**
```bash
# 1. Set up stage environment
cp env.stage.example .env.stage
# Edit .env.stage with your values

# 2. Deploy to stage
npm run deploy:stage

# 3. Test stage deployment
curl https://your-stage-api-url/brands

# 4. Get stage endpoint
npm run info:stage
```

### **2. Production Deployment**
```bash
# 1. Set up production environment
cp env.prod.example .env.prod
# Edit .env.prod with SECURE values

# 2. Deploy to production
npm run deploy:prod

# 3. Test production deployment
curl https://your-prod-api-url/brands

# 4. Get production endpoint
npm run info:prod
```

## 📋 API Endpoints

After deployment, your API will be available at:

**Stage**: `https://your-stage-id.execute-api.us-east-1.amazonaws.com/stage`
**Production**: `https://your-prod-id.execute-api.us-east-1.amazonaws.com/prod`

### **Available Endpoints** (14 total):
```
🔐 Authentication (3 endpoints)
POST   /auth/register
POST   /auth/login
POST   /auth/refresh

👤 User Profile (2 endpoints)
GET    /users/profile
PUT    /users/profile

💰 Wallet (1 endpoint)
GET    /wallet/transactions

🎁 Brands (1 endpoint)
GET    /brands

🛒 Cart (3 endpoints)
GET    /cart
PUT    /cart/manage
DELETE /cart/clear

📦 Orders (4 endpoints)
POST   /orders/create
GET    /orders
GET    /orders/:orderId
```

**Note**: Wallet balance is included in `GET /users/profile` response.

## 🧪 Testing

### **Import Postman Collection**
1. Import `giftify-api.postman_collection.json` into Postman
2. Set environment variables:
   - `baseUrl`: Your deployed API URL
   - `accessToken`: Will be set automatically after login

### **Test Flow**
1. **Register**: `POST /auth/register`
2. **Login**: `POST /auth/login` (saves tokens automatically)
3. **Get Profile**: `GET /users/profile` (includes wallet balance)
4. **Get Brands**: `GET /brands` (all brands with variants)
5. **Add to Cart**: `PUT /cart/manage`
6. **View Cart**: `GET /cart`
7. **Create Order**: `POST /orders/create`
8. **View Orders**: `GET /orders`

## 🔍 Monitoring

### **View Logs**
```bash
# Stage logs
npm run logs:stage

# Production logs
npm run logs:prod

# Real-time logs
serverless logs -f api --tail --config serverless-stage.yml
```

### **AWS Console**
- **CloudFormation**: View stack resources
- **Lambda**: Monitor function metrics
- **DynamoDB**: View table data and metrics
- **API Gateway**: View API metrics and logs

## 🚨 Security Considerations

### **Stage Environment**
- ✅ Can use default/simple secrets
- ✅ Detailed logging enabled
- ✅ CORS set to `*` for development

### **Production Environment**
- ⚠️ **MUST** use secure JWT secrets (32+ characters)
- ⚠️ **MUST** use secure encryption key (32 characters)
- ⚠️ **MUST** set proper CORS origin
- ✅ Point-in-time recovery enabled
- ✅ Minimal logging for performance
- ✅ Reserved concurrency limits

## 🔄 CI/CD Integration

### **GitHub Actions Example**
```yaml
name: Deploy to Stage
on:
  push:
    branches: [develop]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run deploy:stage
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## 🗑️ Cleanup

### **Remove Environments**
```bash
# Remove stage (deletes all resources)
npm run remove:stage

# Remove production (deletes all resources)
npm run remove:prod
```

⚠️ **Warning**: This will delete all data in DynamoDB tables!

## 📞 Support

For deployment issues:
1. Check AWS CloudFormation console for stack events
2. Review Lambda function logs
3. Verify environment variables are set correctly
4. Ensure AWS credentials have proper permissions 