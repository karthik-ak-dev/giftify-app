import { CheckCircle, XCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Refund = () => {
    const refundSteps = [
        {
            number: '1',
            title: 'Check Eligibility',
            description: 'Ensure your gift card is unused and within 7 days of purchase'
        },
        {
            number: '2',
            title: 'Submit Request',
            description: 'Contact support with your order number and reason for refund'
        },
        {
            number: '3',
            title: 'Review Process',
            description: 'Our team will verify your request within 1-2 business days'
        },
        {
            number: '4',
            title: 'Receive Refund',
            description: 'Approved refunds are processed within 5-7 business days'
        }
    ]

    return (
        <div className="min-h-screen">
            <Navbar />
            
            {/* Header Section */}
            <section className="pt-8 pb-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-dark-100/40 via-dark-200/30 to-dark-50/50 border-b border-white/10">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-display font-bold text-white mb-2">
                        Refund Policy
                    </h1>
                    <p className="text-white/60">
                        Last updated: October 19, 2025 • Easy returns and hassle-free refunds
                    </p>
                </div>
            </section>

            <div className="bg-dark-100 py-12 px-4">

                {/* Quick Overview */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="bg-gradient-to-br from-accent-500/10 to-pink-500/10 border border-accent-500/30 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">
                            Quick Overview
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-white font-semibold">Eligible for Refund</p>
                                    <p className="text-gray-400 text-sm">Unused gift cards within 7 days</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-white font-semibold">Not Eligible</p>
                                    <p className="text-gray-400 text-sm">Used, redeemed, or expired cards</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-white font-semibold">Processing Time</p>
                                    <p className="text-gray-400 text-sm">5-7 business days after approval</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <RefreshCw className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-white font-semibold">Refund Method</p>
                                    <p className="text-gray-400 text-sm">Original payment or wallet credit</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Refund Process */}
                <div className="max-w-4xl mx-auto mb-12">
                    <h2 className="text-2xl font-bold text-white mb-8 text-center">
                        How to Request a Refund
                    </h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        {refundSteps.map((step, index) => (
                            <div key={index} className="relative">
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:border-accent-500/50 transition-all h-full">
                                    <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                                        {step.number}
                                    </div>
                                    <h3 className="text-white font-bold mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                        {step.description}
                                    </p>
                                </div>
                                {index < refundSteps.length - 1 && (
                                    <div className="hidden md:block absolute top-1/3 -right-3 w-6 h-0.5 bg-gradient-to-r from-accent-500 to-pink-500" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detailed Policy */}
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">
                            1. Refund Eligibility
                        </h2>
                        <div className="space-y-3 text-gray-300">
                            <p>To be eligible for a refund, the following conditions must be met:</p>
                            <ul className="space-y-2 ml-4">
                                <li className="flex items-start gap-2">
                                    <span className="text-accent-400 mt-1">•</span>
                                    <span>The gift card must be completely unused and unredeemed (even partial use makes it ineligible)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent-400 mt-1">•</span>
                                    <span>The refund request must be made within 7 days of purchase</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent-400 mt-1">•</span>
                                    <span>The gift card code and PIN must not have been shared or exposed to third parties</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent-400 mt-1">•</span>
                                    <span>The gift card must not have expired</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent-400 mt-1">•</span>
                                    <span>You must provide the original order number and purchase details</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">
                            2. Non-Refundable Items
                        </h2>
                        <div className="space-y-3 text-gray-300">
                            <p>The following items are NOT eligible for refunds:</p>
                            <ul className="space-y-2 ml-4">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">✕</span>
                                    <span>Gift cards that have been used, redeemed, or partially redeemed</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">✕</span>
                                    <span>Gift cards purchased more than 7 days ago</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">✕</span>
                                    <span>Gift cards that have been lost, stolen, or compromised</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">✕</span>
                                    <span>Expired gift cards</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">✕</span>
                                    <span>Promotional or bonus gift cards received as part of offers</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">✕</span>
                                    <span>Gift cards purchased with fraudulent payment methods</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">
                            3. Refund Process
                        </h2>
                        <div className="space-y-3 text-gray-300">
                            <p><strong className="text-white">Requesting a Refund:</strong></p>
                            <ul className="space-y-2 ml-4 mb-4">
                                <li className="flex items-start gap-2">
                                    <span className="text-accent-400 mt-1">•</span>
                                    <span>Contact our support team at support@giftify.com or through the Contact Us page</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent-400 mt-1">•</span>
                                    <span>Include your order number, email address, and reason for refund</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent-400 mt-1">•</span>
                                    <span>Provide screenshots or proof if requested by our team</span>
                                </li>
                            </ul>
                            <p><strong className="text-white">Review and Approval:</strong></p>
                            <ul className="space-y-2 ml-4 mb-4">
                                <li className="flex items-start gap-2">
                                    <span className="text-accent-400 mt-1">•</span>
                                    <span>Our team will review your request within 1-2 business days</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent-400 mt-1">•</span>
                                    <span>We will verify that the gift card is unused and meets eligibility criteria</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent-400 mt-1">•</span>
                                    <span>You will receive an email notification of approval or rejection</span>
                                </li>
                            </ul>
                            <p><strong className="text-white">Processing Refund:</strong></p>
                            <ul className="space-y-2 ml-4">
                                <li className="flex items-start gap-2">
                                    <span className="text-accent-400 mt-1">•</span>
                                    <span>Approved refunds are processed within 5-7 business days</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent-400 mt-1">•</span>
                                    <span>Refunds are issued to your original payment method or Giftify wallet</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent-400 mt-1">•</span>
                                    <span>Bank processing times may add 3-5 additional business days</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">
                            4. Refund Methods
                        </h2>
                        <div className="space-y-3 text-gray-300">
                            <p><strong className="text-white">Original Payment Method:</strong></p>
                            <p className="ml-4">Refunds are typically issued to the original payment method used for purchase (credit card, debit card, PayPal, etc.). The amount will appear in your account within 5-7 business days after processing.</p>

                            <p className="pt-3"><strong className="text-white">Giftify Wallet:</strong></p>
                            <p className="ml-4">You may request to receive your refund as Giftify wallet credit, which can be used for future purchases. Wallet credits are applied instantly upon refund approval and never expire.</p>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">
                            5. Exchanges
                        </h2>
                        <div className="space-y-3 text-gray-300">
                            <p>We do not offer direct exchanges for different gift card values or brands. If you wish to purchase a different gift card:</p>
                            <ul className="space-y-2 ml-4">
                                <li className="flex items-start gap-2">
                                    <span className="text-accent-400 mt-1">•</span>
                                    <span>Request a refund for your unused gift card (subject to eligibility)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent-400 mt-1">•</span>
                                    <span>Once refund is approved, place a new order for the desired gift card</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent-400 mt-1">•</span>
                                    <span>Consider using Giftify wallet credit for faster processing</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">
                            6. Special Circumstances
                        </h2>
                        <div className="space-y-3 text-gray-300">
                            <p><strong className="text-white">Technical Issues:</strong></p>
                            <p className="ml-4">If you experience technical issues preventing gift card redemption (invalid code, merchant rejection, etc.), contact support immediately. We will investigate and provide a replacement or refund as appropriate.</p>

                            <p className="pt-3"><strong className="text-white">Fraudulent Transactions:</strong></p>
                            <p className="ml-4">If you suspect fraudulent activity on your account, contact us immediately at support@giftify.com. We will investigate and take appropriate action, including refunds if applicable.</p>

                            <p className="pt-3"><strong className="text-white">Merchant Bankruptcy or Closure:</strong></p>
                            <p className="ml-4">If a brand permanently closes or files for bankruptcy after your purchase, we will work with you to provide a refund or alternative solution on a case-by-case basis.</p>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">
                            7. Dispute Resolution
                        </h2>
                        <div className="space-y-3 text-gray-300">
                            <p>If you disagree with a refund decision:</p>
                            <ul className="space-y-2 ml-4">
                                <li className="flex items-start gap-2">
                                    <span className="text-accent-400 mt-1">•</span>
                                    <span>Reply to the refund decision email with additional information or evidence</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent-400 mt-1">•</span>
                                    <span>Our escalation team will review your case within 3-5 business days</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent-400 mt-1">•</span>
                                    <span>Final decisions are made by our management team and are binding</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">
                            8. Contact Information
                        </h2>
                        <div className="space-y-3 text-gray-300">
                            <p>For refund requests or questions about this policy:</p>
                            <ul className="space-y-2 ml-4">
                                <li className="flex items-start gap-2">
                                    <span className="text-accent-400 mt-1">•</span>
                                    <span>Email: support@giftify.com</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent-400 mt-1">•</span>
                                    <span>Phone: +1 (800) 123-4567</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent-400 mt-1">•</span>
                                    <span>Live Chat: Available 24/7 on our website</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Important Notice */}
                <div className="max-w-4xl mx-auto mt-12">
                    <div className="bg-amber-500/10 border border-amber-400/30 rounded-2xl p-6 flex gap-4">
                        <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-white font-bold mb-2">Important Notice</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                This refund policy is subject to our Terms and Conditions. We reserve the right to modify this policy at any time. Changes will be effective immediately upon posting to our website. Refund eligibility is determined solely by Giftify based on the criteria outlined above.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="max-w-4xl mx-auto mt-8">
                    <div className="bg-gradient-to-br from-accent-500/10 to-pink-500/10 border border-accent-500/30 rounded-2xl p-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-3">
                            Need to request a refund?
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Our support team is ready to assist you
                        </p>
                        <a
                            href="/contact"
                            className="inline-block px-8 py-3 bg-gradient-to-r from-accent-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-accent-500/50 transition-all"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Refund

