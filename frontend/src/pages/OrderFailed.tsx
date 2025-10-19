import { Link, useSearchParams } from 'react-router-dom'
import { XCircle, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const OrderFailed = () => {
    const [searchParams] = useSearchParams()

    // Get error details from URL params
    const errorMessage = searchParams.get('error') || 'Payment processing failed'
    const orderId = searchParams.get('orderId')

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

                    {/* Error Header */}
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500/30 to-red-600/20 rounded-full mb-6 relative">
                            <div className="absolute inset-0 bg-red-500/10 rounded-full animate-ping" />
                            <XCircle className="w-14 h-14 text-red-400 relative z-10" strokeWidth={2} />
                        </div>
                        <h1 className="text-5xl font-display font-black text-white mb-3">
                            Payment Unsuccessful
                        </h1>
                        <p className="text-white/60 text-lg">
                            Don't worry, your money is safe. No amount has been deducted.
                        </p>
                    </div>
                </div>
            </section>

            {/* Error Details Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Error Message Card */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                        <div className="bg-gradient-to-r from-red-500/20 to-red-600/10 p-4 border-b border-red-400/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-500/30 rounded-lg flex items-center justify-center">
                                    <AlertCircle className="w-5 h-5 text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold">Transaction Failed</h3>
                                    <p className="text-white/60 text-sm">Payment could not be processed</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <span className="text-white/40 text-sm mt-0.5">Error:</span>
                                    <p className="text-white/90 flex-1">{errorMessage}</p>
                                </div>
                                {orderId && (
                                    <div className="flex items-start gap-3">
                                        <span className="text-white/40 text-sm mt-0.5">Ref ID:</span>
                                        <code className="text-accent-300 font-mono text-sm">{orderId}</code>
                                    </div>
                                )}
                                <div className="flex items-start gap-3 pt-3 border-t border-white/10">
                                    <span className="text-white/40 text-sm mt-0.5">Status:</span>
                                    <span className="text-red-400 font-semibold">No amount deducted</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Tip */}
                    <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-400/30 rounded-xl p-5">
                        <div className="flex gap-3">
                            <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-blue-400 text-sm">💡</span>
                            </div>
                            <div>
                                <p className="text-white/90 text-sm leading-relaxed">
                                    <strong className="text-white">Quick Tip:</strong> Check your internet connection and ensure you have sufficient balance in your UPI account before retrying.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <Link
                            to="/checkout"
                            className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-accent-500/30 hover:shadow-accent-500/50 hover:scale-[1.02] active:scale-95"
                        >
                            <RefreshCw className="w-5 h-5" />
                            <span>Try Again</span>
                        </Link>
                        <Link
                            to="/"
                            className="flex items-center justify-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold border border-white/10 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                        >
                            <span>Browse More</span>
                        </Link>
                    </div>

                    {/* Support Section */}
                    <div className="text-center pt-4">
                        <p className="text-white/60 text-sm mb-3">
                            Still facing issues?
                        </p>
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 text-accent-400 hover:text-accent-300 font-semibold transition-colors"
                        >
                            Contact Support
                            <ArrowLeft className="w-4 h-4 rotate-180" />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default OrderFailed

