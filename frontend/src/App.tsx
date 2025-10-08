import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import VariantModal from './components/VariantModal';
import Toast from './components/Toast';
import Home from './pages/Home';
import OrderHistory from './pages/OrderHistory';

function App() {
    return (
        <Router>
            <div className="min-h-screen">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/orders" element={<OrderHistory />} />
                </Routes>
                <CartSidebar />
                <VariantModal />
                <Toast />
            </div>
        </Router>
    );
}

export default App;

