import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import BrandDetail from './pages/BrandDetail'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import OrderFailed from './pages/OrderFailed'
import Account from './pages/Account'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Refund from './pages/Refund'
import Cookies from './pages/Cookies'
import About from './pages/About'
import Partners from './pages/Partners'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import CartSidebar from './components/CartSidebar'
import AuthSidebar from './components/AuthSidebar'

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/brands" element={<Navigate to="/" replace />} />
                        <Route path="/brand/:brandSlug" element={<BrandDetail />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/order/success" element={<OrderSuccess />} />
                        <Route path="/order/failed" element={<OrderFailed />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/refund" element={<Refund />} />
                        <Route path="/cookies" element={<Cookies />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/partners" element={<Partners />} />
                    </Routes>
                    <CartSidebar />
                    <AuthSidebar />
                </Router>
            </CartProvider>
        </AuthProvider>
    )
}

export default App

