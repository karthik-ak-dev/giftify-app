import { FileText, CheckCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Terms = () => {
    const sections = [
        {
            title: '1. Acceptance of Terms',
            content: `By accessing and using Giftify's website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services. These terms apply to all visitors, users, and others who access or use our service.`
        },
        {
            title: '2. Service Description',
            content: `Giftify provides a digital marketplace for the purchase and delivery of gift cards and vouchers from various brands. We act as an intermediary between you and the brand issuers. All gift cards are subject to the terms and conditions of the respective brand issuers. We reserve the right to modify, suspend, or discontinue any part of our service at any time without prior notice.`
        },
        {
            title: '3. Account Registration',
            content: `To use our services, you must create an account by providing accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account. You must be at least 18 years old to create an account and make purchases.`
        },
        {
            title: '4. Purchases and Payments',
            content: `All prices are displayed in USD and are subject to change without notice. Payment must be made at the time of purchase using accepted payment methods. We reserve the right to refuse or cancel any order for any reason, including suspected fraud, errors in product information, or unavailability. You are responsible for paying all applicable taxes and fees associated with your purchase.`
        },
        {
            title: '5. Gift Card Delivery and Validity',
            content: `Digital gift cards are delivered electronically to your registered email address and account immediately after payment confirmation. Gift cards are valid for the period specified by the issuing brand, typically 12-24 months from purchase date. We are not responsible for any issues arising from the use or non-acceptance of gift cards by merchants. Expiration dates and usage terms are determined by the brand issuers.`
        },
        {
            title: '6. Refund and Cancellation Policy',
            content: `Unused gift cards may be eligible for refund within 7 days of purchase as per our Refund Policy. Once a gift card has been used or redeemed (even partially), it cannot be refunded or exchanged. We do not offer refunds for gift cards that have expired, been lost, or stolen. All refund requests are subject to verification and approval.`
        },
        {
            title: '7. Prohibited Activities',
            content: `You agree not to: (a) use our services for any illegal purpose; (b) attempt to gain unauthorized access to our systems; (c) engage in any activity that could damage, disable, or impair our services; (d) use automated systems to access our services; (e) resell gift cards obtained through fraud; (f) violate any applicable laws or regulations. Violation may result in immediate account termination and legal action.`
        },
        {
            title: '8. Intellectual Property',
            content: `All content, trademarks, logos, and intellectual property on our website are owned by Giftify or our licensors. You may not reproduce, distribute, modify, or create derivative works without our explicit written permission. Brand names and logos belong to their respective owners and are used under license.`
        },
        {
            title: '9. Limitation of Liability',
            content: `Giftify shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services. Our total liability shall not exceed the amount paid by you for the specific gift card in question. We are not responsible for any issues arising from the use of gift cards with third-party merchants.`
        },
        {
            title: '10. Privacy and Data Protection',
            content: `Your use of our services is also governed by our Privacy Policy. We collect, use, and protect your personal information in accordance with applicable data protection laws. By using our services, you consent to our collection and use of personal information as described in our Privacy Policy.`
        },
        {
            title: '11. Dispute Resolution',
            content: `Any disputes arising from these terms shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. You agree to waive your right to participate in class action lawsuits. These terms are governed by the laws of the State of California, USA.`
        },
        {
            title: '12. Changes to Terms',
            content: `We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services after changes are posted constitutes acceptance of the modified terms. We encourage you to review these terms periodically.`
        },
        {
            title: '13. Contact Information',
            content: `If you have any questions about these Terms and Conditions, please contact us at legal@giftify.com or through our Contact Us page. For general support inquiries, please email support@giftify.com or use our Help Center.`
        }
    ]

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="bg-dark-100 py-12 px-4">
                {/* Header */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="inline-block p-3 bg-gradient-to-br from-accent-500 to-pink-500 rounded-2xl mb-4">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Terms & Conditions
                    </h1>
                    <p className="text-gray-400 text-lg mb-2">
                        Last updated: October 19, 2025
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                        Please read these Terms and Conditions carefully before using Giftify's services. By accessing or using our platform, you agree to be bound by these terms.
                    </p>
                </div>

                {/* Quick Summary */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="bg-gradient-to-br from-accent-500/10 to-pink-500/10 border border-accent-500/30 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-accent-400" />
                            Quick Summary
                        </h2>
                        <ul className="space-y-2 text-gray-300">
                            <li className="flex items-start gap-2">
                                <span className="text-accent-400 mt-1">•</span>
                                <span>You must be 18+ to use our services</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent-400 mt-1">•</span>
                                <span>All sales are final once gift cards are used</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent-400 mt-1">•</span>
                                <span>Refunds available within 7 days for unused cards</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent-400 mt-1">•</span>
                                <span>You're responsible for keeping your account secure</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent-400 mt-1">•</span>
                                <span>Gift card terms are set by individual brands</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Terms Sections */}
                <div className="max-w-4xl mx-auto space-y-8">
                    {sections.map((section, index) => (
                        <div
                            key={index}
                            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-accent-500/30 transition-all"
                        >
                            <h2 className="text-xl font-bold text-white mb-4">
                                {section.title}
                            </h2>
                            <p className="text-gray-300 leading-relaxed">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Footer CTA */}
                <div className="max-w-4xl mx-auto mt-12">
                    <div className="bg-gradient-to-br from-accent-500/10 to-pink-500/10 border border-accent-500/30 rounded-2xl p-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-3">
                            Questions about our terms?
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Contact our legal team for clarifications
                        </p>
                        <a
                            href="/contact"
                            className="inline-block px-8 py-3 bg-gradient-to-r from-accent-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-accent-500/50 transition-all"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Terms

