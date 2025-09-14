# 🎁 Giftify Frontend

A modern, responsive gift card marketplace built with React, TypeScript, and cutting-edge web technologies.

## ✨ Features

### 🎨 **Modern UI/UX**
- **Gen Z Aesthetic**: Neo-minimalist design with glassmorphism and neon accents
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Theme**: Eye-friendly dark mode with vibrant accent colors
- **Smooth Animations**: Powered by Framer Motion for delightful interactions

### 🔐 **Authentication & Security**
- JWT-based authentication with automatic token refresh
- Protected routes with seamless redirects
- Secure API communication with interceptors
- Input validation and sanitization

### 🛒 **Shopping Experience**
- Real-time product catalog with search and filtering
- Interactive shopping cart with quantity controls
- Wallet integration for seamless payments
- Order history and transaction tracking

### 🏗️ **Architecture**
- **React 18**: Latest React features with concurrent rendering
- **TypeScript**: Full type safety and better developer experience
- **Zustand**: Lightweight state management
- **Vite**: Lightning-fast build tool and dev server
- **Tailwind CSS**: Utility-first styling with custom design system

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 8+
- Backend API running (see `/backend` directory)

### Installation

1. **Clone and navigate**:
   ```bash
   git clone <repository-url>
   cd giftify-app/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   ```bash
   cp env.example .env.local
   # Edit .env.local with your API URL and other settings
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**: http://localhost:3000

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Base UI components (Button, Input, etc.)
│   │   ├── layout/       # Layout components (Header, Footer)
│   │   └── features/     # Feature-specific components
│   ├── pages/            # Page components
│   ├── store/            # Zustand stores for state management
│   ├── services/         # API services and HTTP client
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions and helpers
│   ├── styles/           # Global styles and Tailwind config
│   └── assets/           # Images, fonts, and other assets
├── dist/                 # Production build output
└── docs/                 # Documentation
```

## 🎨 Design System

### Color Palette: "Electric Sunset"
```css
/* Primary Colors */
--primary-blue: #0066FF      /* Electric Blue */
--accent-pink: #FF0080       /* Neon Pink */
--accent-orange: #FF6B35     /* Sunset Orange */
--cyber-yellow: #FFFF00      /* Cyber Yellow */

/* Background Colors */
--bg-primary: #0A0A0F        /* Deep Space */
--bg-secondary: #1A1A2E      /* Dark Navy */
--glass-bg: rgba(255, 255, 255, 0.05)  /* Glassmorphism */
```

### Typography
- **Headings**: Inter (Bold, 600-900 weight)
- **Body**: Inter (Regular, 400-500 weight)
- **Code**: JetBrains Mono

### Components
- **Glassmorphism Cards**: Semi-transparent backgrounds with blur effects
- **Neon Accents**: Glowing borders and text effects
- **Smooth Transitions**: 300ms ease-in-out animations
- **Micro-interactions**: Hover states and loading animations

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run type-check       # Run TypeScript type checking

# Building
npm run build           # Production build
npm run build:staging   # Staging build
npm run preview         # Preview production build locally

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues automatically

# Maintenance
npm run clean           # Clean build artifacts
npm run deps:check      # Check for outdated dependencies
npm run security:audit  # Security audit
```

### Development Guidelines

1. **Component Structure**:
   ```tsx
   /**
    * Component description and features
    */
   interface ComponentProps {
     // Props with JSDoc comments
   }

   export const Component: React.FC<ComponentProps> = ({ props }) => {
     // Hooks at the top
     // Event handlers
     // Render logic with comments
   };
   ```

2. **State Management**:
   - Use Zustand for global state
   - Keep local state in components when possible
   - Follow the store pattern for complex state

3. **Styling**:
   - Use Tailwind utility classes
   - Create custom components for repeated patterns
   - Follow the design system colors and spacing

4. **Type Safety**:
   - Define interfaces for all props and data
   - Use strict TypeScript configuration
   - Avoid `any` types

## 🔌 API Integration

### Configuration

The frontend communicates with the backend API using Axios with the following features:

- **Base URL**: Configured via `VITE_API_URL` environment variable
- **Authentication**: Automatic JWT token handling
- **Token Refresh**: Seamless token renewal on expiration
- **Error Handling**: Centralized error processing
- **Request/Response Interceptors**: Logging and transformation

### API Services

```typescript
// Example service usage
import { authService } from '@/services/authService';

const handleLogin = async (credentials) => {
  try {
    const response = await authService.login(credentials);
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

## 🎯 State Management

### Zustand Stores

The application uses Zustand for state management with the following stores:

1. **Auth Store** (`authStore.ts`):
   - User authentication state
   - Login/logout functionality
   - Token management

2. **Cart Store** (`cartStore.ts`):
   - Shopping cart items
   - Add/remove/update operations
   - Cart sidebar state

3. **Product Store** (`productStore.ts`):
   - Product catalog
   - Search and filtering
   - Categories

4. **Wallet Store** (`walletStore.ts`):
   - Wallet balance
   - Transaction history
   - Top-up functionality

### Usage Example

```typescript
import { useAuthStore } from '@/store/authStore';

const Component = () => {
  const { user, login, logout, isAuthenticated } = useAuthStore();
  
  // Component logic
};
```

## 🧪 Testing

### Testing Strategy

- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API service and store testing
- **E2E Tests**: Critical user flows
- **Visual Tests**: Component visual regression

### Running Tests

```bash
npm run test              # Run all tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Generate coverage report
npm run test:e2e          # Run end-to-end tests
```

## 📱 Progressive Web App

The application includes PWA features:

- **Service Worker**: Offline functionality and caching
- **Web App Manifest**: Install prompt and app-like experience
- **Responsive Design**: Mobile-first approach
- **Touch Interactions**: Optimized for touch devices

## 🚀 Deployment

### Build Process

1. **Type Checking**: Ensures TypeScript compliance
2. **Linting**: Code quality checks
3. **Building**: Optimized production bundle
4. **Asset Optimization**: Image compression and minification

### Deployment Platforms

- **Vercel** (Recommended): Zero-config deployment
- **Netlify**: JAMstack deployment
- **AWS S3 + CloudFront**: Scalable hosting
- **Docker**: Containerized deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🔧 Configuration

### Environment Variables

```env
# API Configuration
VITE_API_URL=https://api.giftify.app
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG_MODE=false

# External Services
VITE_SENTRY_DSN=your-sentry-dsn
VITE_GA_ID=your-google-analytics-id
```

### Vite Configuration

The Vite configuration includes:

- **Path Aliases**: Clean import paths
- **Build Optimization**: Code splitting and minification
- **Development Server**: Hot reload and proxy configuration
- **Asset Handling**: Image optimization and inlining

## 📊 Performance

### Optimization Techniques

1. **Code Splitting**: Route-based and vendor chunks
2. **Lazy Loading**: Components and images
3. **Caching**: Aggressive caching strategies
4. **Bundle Analysis**: Regular size monitoring
5. **Tree Shaking**: Unused code elimination

### Performance Metrics

Target Web Vitals:
- **FCP**: < 1.5s
- **LCP**: < 2.5s
- **CLS**: < 0.1
- **FID**: < 100ms

## 🔒 Security

### Security Measures

- **Content Security Policy**: XSS protection
- **HTTPS Only**: Secure communication
- **Input Validation**: Client and server-side validation
- **Token Security**: Secure JWT handling
- **Dependency Scanning**: Regular security audits

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**:
   ```bash
   npm run clean
   npm install
   npm run build
   ```

2. **Type Errors**:
   ```bash
   npm run type-check
   ```

3. **Linting Issues**:
   ```bash
   npm run lint:fix
   ```

### Debug Mode

Enable debug mode for development:

```env
VITE_ENABLE_DEBUG_MODE=true
```

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### Code Standards

- Follow TypeScript strict mode
- Use ESLint and Prettier
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 📚 Resources

### Documentation
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vite Guide](https://vitejs.dev/guide)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion)

### Tools
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)
- [Vite DevTools](https://github.com/webfansplz/vite-plugin-vue-devtools)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 👥 Team

- **Frontend Team**: React/TypeScript specialists
- **Design Team**: UI/UX designers
- **Backend Team**: API and infrastructure

---

## 🎯 Quick Commands

```bash
# Setup
npm install && cp env.example .env.local

# Development
npm run dev

# Production
npm run build && npm run preview

# Quality
npm run lint && npm run type-check

# Deployment
npm run deploy:production
```

Happy coding! 🚀
