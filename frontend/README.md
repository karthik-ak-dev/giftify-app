# Giftify Frontend - React Voucher Store

A modern, Gen-Z inspired React web application for browsing and purchasing digital vouchers.

## Features

- 🎨 **Modern Design**: Dark theme with glassmorphism effects inspired by kgen.io
- 🛍️ **Voucher Browsing**: View various vouchers with different denominations
- 🛒 **Shopping Cart**: Add items to cart with quantity management
- 📦 **Order History**: Track all your past orders
- 🔍 **Search & Filter**: Find vouchers by name or category
- 💾 **Persistent Storage**: Cart and orders saved in localStorage
- ✨ **Smooth Animations**: Using Framer Motion for fluid transitions
- 📱 **Responsive Design**: Works perfectly on all devices

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Zustand** - State management
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # React components
│   ├── Navbar.tsx      # Navigation bar with cart
│   ├── VoucherCard.tsx # Voucher display card
│   ├── VariantModal.tsx # Denomination selection modal
│   ├── CartSidebar.tsx # Sliding cart panel
│   └── Toast.tsx       # Notification toasts
├── pages/              # Page components
│   ├── Home.tsx        # Voucher listing page
│   └── OrderHistory.tsx # Past orders page
├── store/              # State management
│   └── useStore.ts     # Zustand store
├── data/               # Mock data
│   └── vouchers.ts     # Voucher catalog
├── types/              # TypeScript types
│   └── index.ts        # Type definitions
├── utils/              # Utility functions
│   ├── storage.ts      # localStorage helpers
│   └── formatters.ts   # Format currency/dates
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Design Philosophy

The app uses a dark theme with:
- **Primary Color**: Purple gradient (#7c6cf5 - #6c4be8)
- **Accent Color**: Teal/Cyan (#14b8a6 - #0d9488)
- **Glassmorphism**: Translucent panels with backdrop blur
- **Smooth Transitions**: All interactions are animated
- **Modern Typography**: Inter font family

## Features Walkthrough

### Browse Vouchers
- View all available vouchers on the home page
- Search by name or filter by category
- Click on any voucher to view available denominations

### Add to Cart
- Select a denomination in the modal
- Click the + button to add to cart
- Cart badge updates automatically

### Manage Cart
- Click cart icon to open sidebar
- Adjust quantities with +/- buttons
- Remove items with trash icon
- View total in real-time

### Place Order
- Click "Place Order" in cart
- Order is saved to history
- Cart is cleared automatically
- Success notification appears

### View Orders
- Navigate to "Orders" page
- See all past orders with details
- Click any order to expand and view items

## Customization

### Add New Vouchers
Edit `src/data/vouchers.ts`:
```typescript
{
  id: 'unique-id',
  name: 'Brand Name',
  brand: 'Brand Name',
  description: 'Description',
  icon: '🎁',
  category: 'Category',
  color: 'from-color to-color',
  variants: [
    { id: 'var-1', denomination: 500, price: 500 }
  ]
}
```

### Modify Colors
Edit `tailwind.config.js` to change the color scheme.

### Update Styles
Modify `src/index.css` for global styles or component files for specific changes.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is part of the Giftify application.

