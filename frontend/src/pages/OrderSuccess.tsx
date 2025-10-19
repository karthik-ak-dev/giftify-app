import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, ArrowLeft, Package, Copy, Check } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

interface VoucherCode {
    code: string
    pin: string
}

interface VoucherGroup {
    brandName: string
    brandLogo: string
    variantValue: number
    vouchers: VoucherCode[]
}

const OrderSuccess = () => {
    const [searchParams] = useSearchParams()
    const [copiedCode, setCopiedCode] = useState<string | null>(null)

    // Get order details from URL params (in real app, fetch from API using order ID)
    const orderId = searchParams.get('orderId') || 'ORD-' + Date.now()
    const total = searchParams.get('total') || '0'

    // Mock voucher data (in real app, this would come from API)
    const mockVouchers: VoucherGroup[] = [
        {
            brandName: 'Amazon',
            brandLogo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0ZGOTkwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IiMxRjI5MzciIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSJib2xkIj5BPC90ZXh0Pjwvc3ZnPg==',
            variantValue: 1000,
            vouchers: [
                { code: 'AMZN-X9Y2-Z3A4-B5C6', pin: '7890' }
            ]
        }
    ]

    const handleCopyCode = (text: string, type: 'code' | 'pin') => {
        navigator.clipboard.writeText(text)
        setCopiedCode(`${text}-${type}`)
        setTimeout(() => setCopiedCode(null), 2000)
    }

    useEffect(() => {
        // Clear cart after successful order (integrate with CartContext)
        // cartContext.clearCart()
    }, [])

    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Header Section */}
            <section className="pt-8 pb-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-dark-100/40 via-dark-200/30 to-dark-50/50 border-b border-white/10">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <Link
                        to="/"
                        className="inline-flex items-center space-x-2 text-white/70 hover:text-accent-300 transition-colors mb-6 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Home</span>
                    </Link>

                    {/* Success Header */}
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4 animate-bounce">
                            <CheckCircle className="w-12 h-12 text-green-400" strokeWidth={2.5} />
                        </div>
                        <h1 className="text-5xl font-display font-black text-white mb-3">
                            Order Successful! 🎉
                        </h1>
                        <p className="text-white/60 text-lg">
                            Your gift cards are ready to use
                        </p>
                    </div>
                </div>
            </section>

            {/* Order Details & Vouchers Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Order Summary Card */}
                    <div className="bg-gradient-to-br from-accent-500/20 to-accent-600/10 backdrop-blur-sm rounded-xl border border-accent-400/30 p-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <p className="text-white/60 text-sm mb-1">Order ID</p>
                                <p className="text-white font-bold text-xl">{orderId}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-white/60 text-sm mb-1">Total Amount</p>
                                <p className="text-white font-bold text-3xl">₹{parseFloat(total).toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                                <CheckCircle className="w-4 h-4" />
                                <span>Payment completed successfully</span>
                            </div>
                        </div>
                    </div>

                    {/* Voucher Details */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-white">Your Gift Cards</h2>
                        </div>

                        <div className="space-y-6">
                            {mockVouchers.map((group, groupIdx) => (
                                <div key={groupIdx} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                                    {/* Brand Header */}
                                    <div className="flex items-center gap-4 p-4 bg-dark-100/50 border-b border-white/10">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={group.brandLogo}
                                                alt={group.brandName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-lg">{group.brandName}</h3>
                                            <p className="text-white/60 text-sm">₹{group.variantValue} Gift Card</p>
                                        </div>
                                    </div>

                                    {/* Voucher Codes */}
                                    <div className="p-4 space-y-3">
                                        {group.vouchers.map((voucher, vIdx) => (
                                            <div key={vIdx} className="bg-dark-100/30 rounded-lg p-4 border border-white/10">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {/* Code */}
                                                    <div>
                                                        <label className="block text-white/60 text-xs mb-2 font-medium">
                                                            Gift Card Code
                                                        </label>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                                                                <code className="text-accent-300 font-mono text-sm font-semibold">
                                                                    {voucher.code}
                                                                </code>
                                                            </div>
                                                            <button
                                                                onClick={() => handleCopyCode(voucher.code, 'code')}
                                                                className="w-10 h-10 bg-accent-500/20 hover:bg-accent-500/30 border border-accent-400/40 text-accent-400 rounded-lg transition-colors flex items-center justify-center"
                                                                title="Copy code"
                                                            >
                                                                {copiedCode === `${voucher.code}-code` ? (
                                                                    <Check className="w-4 h-4" />
                                                                ) : (
                                                                    <Copy className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* PIN */}
                                                    <div>
                                                        <label className="block text-white/60 text-xs mb-2 font-medium">
                                                            PIN
                                                        </label>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                                                                <code className="text-accent-300 font-mono text-sm font-semibold">
                                                                    {voucher.pin}
                                                                </code>
                                                            </div>
                                                            <button
                                                                onClick={() => handleCopyCode(voucher.pin, 'pin')}
                                                                className="w-10 h-10 bg-accent-500/20 hover:bg-accent-500/30 border border-accent-400/40 text-accent-400 rounded-lg transition-colors flex items-center justify-center"
                                                                title="Copy PIN"
                                                            >
                                                                {copiedCode === `${voucher.pin}-pin` ? (
                                                                    <Check className="w-4 h-4" />
                                                                ) : (
                                                                    <Copy className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link
                            to="/account?tab=orders"
                            className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-accent-500/30 hover:shadow-accent-500/50 hover:scale-[1.02]"
                        >
                            <Package className="w-5 h-5" />
                            <span>View All Orders</span>
                        </Link>
                        <Link
                            to="/"
                            className="flex items-center justify-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold border border-white/10 transition-all duration-300 hover:scale-[1.02]"
                        >
                            <span>Continue Shopping</span>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default OrderSuccess

