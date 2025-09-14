# 🎁 Giftify Frontend

Modern, Gen Z-focused React application for the Giftify gift card marketplace.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

## 🎨 Design System

### Color Palette - "Electric Sunset"
- **Primary**: Purple gradient (#667eea to #764ba2)
- **Accents**: Pink (#ff6b9d), Orange (#ff8a56), Yellow (#ffd93d)
- **Background**: Dark theme with glassmorphism effects
- **Text**: White primary, gray secondary

### Key Features
- ✨ Glassmorphism design with neon accents
- 🎭 Smooth animations with Framer Motion
- 📱 Fully responsive design
- 🎯 Modern React 18 + TypeScript
- ⚡ Vite for fast development
- 🎨 Tailwind CSS for styling
- 🗄️ Zustand for state management
- 🔌 Axios for API calls

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base components (Button, Input, Card)
│   ├── layout/         # Layout components (Header, Footer)
│   └── features/       # Feature-specific components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── store/              # Zustand stores
├── services/           # API services
├── utils/              # Utility functions
├── types/              # TypeScript definitions
└── styles/             # Global styles
```

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Lint code

### Environment Variables
Create a `.env.local` file:
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_ENV=development
VITE_ENABLE_ANALYTICS=false
```

## 🎯 Key Components

### Authentication
- Login/Register forms with validation
- JWT token management
- Protected routes

### Product Catalog
- Grid layout with glassmorphism cards
- Category filtering
- Search functionality

### Shopping Cart
- Slide-in sidebar
- Real-time updates
- Quantity management

### Wallet Management
- Balance display
- Transaction history
- Top-up functionality

## 🧪 Testing

Tests are written using Vitest and React Testing Library:

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to AWS S3 + CloudFront
```bash
# Build and sync to S3
npm run build
aws s3 sync dist/ s3://your-bucket-name

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 📱 Responsive Design

- **Mobile**: Single column layout
- **Tablet**: 2-column product grid
- **Desktop**: 4-column product grid
- **Large**: Optimized spacing and typography

## 🎨 Animation System

### Framer Motion Animations
- Page transitions
- Component hover effects
- Loading states
- Micro-interactions

### CSS Animations
- Glassmorphism effects
- Gradient animations
- Skeleton loading
- Smooth transitions

## 🔧 Performance Optimizations

- Code splitting with React.lazy
- Image lazy loading
- Memoization with useMemo/useCallback
- Bundle optimization with Vite
- Tree shaking for smaller bundles

## 🛡️ Security

- Input validation and sanitization
- XSS prevention
- Secure token storage
- HTTPS-only deployment
- Environment variable protection

## 📊 Monitoring

- Error boundary implementation
- Performance monitoring ready
- Analytics integration ready
- Core Web Vitals tracking

## 🤝 Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation
4. Use conventional commits
5. Ensure all tests pass

## 📄 License

MIT License - see LICENSE file for details 