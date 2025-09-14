# Giftify Frontend Deployment Guide

## 🚀 Production Deployment

This guide covers deploying the Giftify frontend to various platforms.

## 📋 Prerequisites

- Node.js 18+ and npm
- Environment variables configured
- Backend API deployed and accessible
- Domain name (optional but recommended)

## 🔧 Environment Setup

### 1. Environment Variables

Copy the environment template and configure for your environment:

```bash
cp env.example .env.local
```

Update the following variables in `.env.local`:

```env
# Required - Your backend API URL
VITE_API_URL=https://your-api-gateway-url.execute-api.ap-southeast-1.amazonaws.com/stage

# Optional - Application configuration
VITE_APP_NAME=Giftify
VITE_APP_VERSION=1.0.0

# Optional - External services
VITE_SENTRY_DSN=your-sentry-dsn
VITE_GOOGLE_ANALYTICS_ID=your-ga-id
```

### 2. Build Configuration

The application is configured for optimal production builds with:

- **Code Splitting**: Automatic vendor and route-based splitting
- **Asset Optimization**: Image compression and inlining
- **Tree Shaking**: Unused code elimination
- **Minification**: JavaScript and CSS minification
- **Source Maps**: Optional for debugging

## 🏗️ Build Process

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Build Analysis
```bash
npm run build -- --analyze
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables** in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add all `VITE_*` variables

### Option 2: Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`
3. **Environment Variables**: Add in Netlify dashboard

### Option 3: AWS S3 + CloudFront

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Upload to S3**:
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Configure CloudFront** for SPA routing:
   - Error Pages: 404 → /index.html (200)
   - Cache Behaviors: Configure for static assets

### Option 4: Docker

1. **Create Dockerfile**:
   ```dockerfile
   # Build stage
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build

   # Production stage
   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Build and run**:
   ```bash
   docker build -t giftify-frontend .
   docker run -p 80:80 giftify-frontend
   ```

## 🔒 Security Configuration

### Content Security Policy (CSP)

Add to your hosting platform:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://your-api-domain.com;
```

### Security Headers

Recommended headers:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## 🚦 Health Checks

### Application Health

The application includes built-in health checks:

- **Route Health**: All routes render without errors
- **API Health**: Backend connectivity verification
- **Store Health**: State management functionality

### Monitoring

Recommended monitoring setup:

1. **Error Tracking**: Sentry integration
2. **Performance**: Web Vitals monitoring
3. **Analytics**: Google Analytics integration
4. **Uptime**: External uptime monitoring

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths: ['frontend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Run tests
        run: |
          cd frontend
          npm run test:ci
      
      - name: Build application
        run: |
          cd frontend
          npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_SENTRY_DSN: ${{ secrets.VITE_SENTRY_DSN }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: frontend
```

## 📊 Performance Optimization

### Bundle Analysis

Check bundle size and optimization:

```bash
npm run build -- --analyze
```

### Performance Metrics

Target metrics:
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Optimization Techniques

1. **Code Splitting**: Implemented via React.lazy()
2. **Image Optimization**: WebP format with fallbacks
3. **Caching**: Aggressive caching for static assets
4. **Compression**: Gzip/Brotli compression enabled
5. **CDN**: Static assets served via CDN

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Verify environment variables

2. **Runtime Errors**:
   - Check browser console for errors
   - Verify API connectivity
   - Check environment variable values

3. **Performance Issues**:
   - Analyze bundle size
   - Check network requests
   - Verify CDN configuration

### Debug Mode

Enable debug mode in development:

```env
VITE_ENABLE_DEBUG_MODE=true
```

## 📱 Mobile Considerations

The application is fully responsive and includes:

- **Progressive Web App** features
- **Touch-friendly** interactions
- **Mobile-optimized** animations
- **Offline** capabilities (service worker)

## 🔄 Updates and Maintenance

### Rolling Updates

For zero-downtime deployments:

1. Deploy to staging environment
2. Run automated tests
3. Deploy to production with blue-green strategy
4. Monitor error rates and performance

### Rollback Strategy

Quick rollback process:

1. **Vercel**: Use deployment history
2. **S3/CloudFront**: Restore previous version
3. **Docker**: Deploy previous image tag

## 📞 Support

For deployment issues:

1. Check the troubleshooting section
2. Review application logs
3. Contact the development team
4. Create an issue in the repository

---

## 🎯 Quick Start Checklist

- [ ] Environment variables configured
- [ ] Backend API accessible
- [ ] Build process successful
- [ ] Deployment platform chosen
- [ ] Security headers configured
- [ ] Monitoring setup
- [ ] Performance metrics verified
- [ ] Mobile testing completed

Happy deploying! 🚀 