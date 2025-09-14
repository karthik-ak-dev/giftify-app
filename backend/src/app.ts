import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import serverless from 'serverless-http';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import walletRoutes from './routes/wallet';
import productRoutes from './routes/products';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

// Import config
import { ENV_CONFIG, validateEnvironment } from './config/env';

// Validate environment variables
validateEnvironment();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
// app.use(cors({
//   origin: ENV_CONFIG.CORS_ORIGIN,
//   credentials: true
// }));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (only in development or when enabled)
if (ENV_CONFIG.FEATURES.ENABLE_REQUEST_LOGGING) {
  app.use(requestLogger);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: ENV_CONFIG.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/wallet', walletRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use(errorHandler);

// Export for serverless (properly typed)
export const handler = serverless(app);

// Export for local development
export default app; 