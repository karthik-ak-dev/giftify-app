import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Smartphone } from 'lucide-react'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Checkout = () => {
    const { items, totalPrice } = useCart()
    const navigate = useNavigate()
    const [processing, setProcessing] = useState(false)

    if (items.length === 0) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h2>
                        <p className="text-white/60 mb-6">Add some gift cards to checkout</p>
                        <button
                            onClick={() => navigate('/brands')}
                            className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-semibold transition-colors"
                        >
                            Browse Gift Cards
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    const totalSavings = items.reduce((sum, item) => sum + (item.variantValue - item.variantPrice) * item.quantity, 0)

    const handlePayment = async (_paymentMethod: string) => {
        setProcessing(true)

        // Simulate payment processing
        // In a real app, this would integrate with payment gateway
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Mock: 90% success rate
        const isSuccess = Math.random() > 0.1

        if (isSuccess) {
            // Generate order ID
            const orderId = 'ORD-' + Date.now()

            // Navigate to success page with order details
            navigate(`/order/success?orderId=${orderId}&total=${totalPrice.toFixed(2)}`)
        } else {
            // Navigate to failed page with error
            const orderId = 'REF-' + Date.now()
            navigate(`/order/failed?orderId=${orderId}&error=Payment gateway declined the transaction`)
        }
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Checkout Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center space-x-2 text-white/70 hover:text-accent-300 transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back</span>
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Order Summary */}
                        <div className="lg:col-span-2 space-y-6">
                            <div>
                                <h1 className="text-3xl font-display font-bold text-white mb-2">Checkout</h1>
                                <p className="text-white/60">Review your order and complete payment</p>
                            </div>

                            {/* Order Items */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                                <h2 className="text-xl font-bold text-white mb-4">Order Items</h2>
                                <div className="space-y-4">
                                    {items.map((item) => {
                                        const discountPercent = ((item.variantValue - item.variantPrice) / item.variantValue * 100).toFixed(1)

                                        return (
                                            <div key={`${item.brandSlug}-${item.variantValue}`} className="flex gap-4 pb-4 border-b border-white/10 last:border-0">
                                                <div className="w-16 h-16 bg-white/95 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={item.brandLogo}
                                                        alt={item.brandName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-white font-semibold mb-1">{item.brandName}</h3>
                                                    <p className="text-white/60 text-sm mb-2">₹{item.variantValue} Gift Card × {item.quantity}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-accent-400 font-bold">₹{(item.variantPrice * item.quantity).toFixed(2)}</span>
                                                        <span className="text-white/40 text-xs line-through">₹{item.variantValue * item.quantity}</span>
                                                        <span className="text-green-400 text-xs font-semibold">{discountPercent}% OFF</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                                <h2 className="text-xl font-bold text-white mb-4">UPI Payment Method</h2>
                                <div className="space-y-3">
                                    {/* Google Pay */}
                                    <button
                                        onClick={() => handlePayment('gpay')}
                                        disabled={processing}
                                        className="w-full p-4 bg-white/5 border border-accent-400/50 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg p-3">
                                            <img
                                                src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg"
                                                alt="Google Pay"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className="text-white font-semibold">Google Pay</div>
                                            <div className="text-white/60 text-sm">Pay via GPay UPI</div>
                                        </div>
                                    </button>
                                    {/* PhonePe */}
                                    <button
                                        onClick={() => handlePayment('phonepe')}
                                        disabled={processing}
                                        className="w-full p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg p-3">
                                            <img
                                                src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg"
                                                alt="PhonePe"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className="text-white font-semibold">PhonePe</div>
                                            <div className="text-white/60 text-sm">Pay via PhonePe UPI</div>
                                        </div>
                                    </button>
                                    {/* Paytm */}
                                    <button
                                        onClick={() => handlePayment('paytm')}
                                        disabled={processing}
                                        className="w-full p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg p-3">
                                            <img
                                                src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg"
                                                alt="Paytm"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className="text-white font-semibold">Paytm</div>
                                            <div className="text-white/60 text-sm">Pay via Paytm UPI</div>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => handlePayment('other')}
                                        disabled={processing}
                                        className="w-full p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center group-hover:bg-accent-500/30 transition-colors">
                                            <Smartphone className="w-6 h-6 text-accent-400" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className="text-white font-semibold">Other UPI Apps</div>
                                            <div className="text-white/60 text-sm">BHIM, Amazon Pay, WhatsApp Pay & more</div>
                                        </div>
                                    </button>
                                </div>

                                {processing && (
                                    <div className="mt-4 p-4 bg-accent-500/20 border border-accent-400/40 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 border-2 border-accent-400 border-t-transparent rounded-full animate-spin" />
                                            <p className="text-white text-sm font-medium">Processing payment...</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Price Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 sticky top-24">
                                <h2 className="text-xl font-bold text-white mb-4">Price Details</h2>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center justify-between text-white/70">
                                        <span>Total Items</span>
                                        <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-white/70">
                                        <span>Subtotal</span>
                                        <span>₹{(totalPrice + totalSavings).toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-green-400 font-semibold">
                                        <span>Total Savings</span>
                                        <span>-₹{totalSavings.toFixed(2)}</span>
                                    </div>
                                    <div className="pt-3 border-t border-white/10">
                                        <div className="flex items-center justify-between text-white text-xl font-bold">
                                            <span>Total Amount</span>
                                            <span>₹{totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Instruction */}
                                <div className="p-4 bg-accent-500/10 border border-accent-400/30 rounded-lg">
                                    <p className="text-white/80 text-sm text-center">
                                        ⬅️ Select a UPI payment method to complete your order
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Checkout

