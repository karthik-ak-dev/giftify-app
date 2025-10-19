import { useState } from 'react'
import { ChevronDown, HelpCircle, Gift, CreditCard, Shield, Clock } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

interface FAQItem {
    question: string
    answer: string
    category: string
}

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const faqs: FAQItem[] = [
        {
            category: 'General',
            question: 'What is Giftify?',
            answer: 'Giftify is a digital marketplace for gift cards and vouchers from top brands. We offer instant delivery, secure transactions, and competitive prices on hundreds of popular brands across various categories.'
        },
        {
            category: 'General',
            question: 'How does Giftify work?',
            answer: 'Simply browse our collection of brands, select the gift card value you want, add it to your cart, and checkout. Once payment is confirmed, your digital voucher codes will be instantly available in your account and sent to your email.'
        },
        {
            category: 'Orders',
            question: 'How quickly will I receive my gift card?',
            answer: 'All gift cards are delivered instantly! Once your payment is confirmed, voucher codes and PINs are immediately available in your order history and sent to your registered email address. The entire process typically takes less than 2 minutes.'
        },
        {
            category: 'Orders',
            question: 'Can I track my order?',
            answer: 'Yes! You can view all your orders in the Order History section of your account. Each order shows the purchase date, total amount, status, and all voucher details including codes and PINs.'
        },
        {
            category: 'Payment',
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit and debit cards (Visa, Mastercard, American Express), PayPal, and digital wallets. All transactions are secured with industry-standard encryption.'
        },
        {
            category: 'Payment',
            question: 'Is my payment information secure?',
            answer: 'Absolutely! We use bank-level SSL encryption and comply with PCI-DSS standards. Your payment information is never stored on our servers and is processed through certified payment gateways.'
        },
        {
            category: 'Vouchers',
            question: 'How do I use my voucher?',
            answer: 'Each voucher comes with a unique code and PIN. Simply visit the brand\'s website or store, select your items, and enter the voucher code and PIN at checkout. Detailed redemption instructions are provided with each voucher.'
        },
        {
            category: 'Vouchers',
            question: 'Do gift cards expire?',
            answer: 'Expiry dates vary by brand. Most gift cards are valid for 12-24 months from the date of purchase. The exact expiry date is clearly mentioned on each voucher. We recommend using them within the validity period.'
        },
        {
            category: 'Refunds',
            question: 'What is your refund policy?',
            answer: 'Unused gift cards can be refunded within 7 days of purchase. Once a voucher code has been used or redeemed (even partially), it cannot be refunded. Please refer to our Refund Policy for complete details.'
        },
        {
            category: 'Refunds',
            question: 'How long does a refund take?',
            answer: 'Approved refunds are processed within 5-7 business days. The amount will be credited back to your original payment method or Giftify wallet based on your preference.'
        },
        {
            category: 'Account',
            question: 'Do I need an account to purchase?',
            answer: 'Yes, you need to create a free Giftify account to make purchases. This helps us secure your orders, maintain your purchase history, and provide better customer support.'
        },
        {
            category: 'Account',
            question: 'How do I reset my password?',
            answer: 'Click on the "Forgot Password?" link on the login page. Enter your registered email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.'
        }
    ]

    const categories = [
        { name: 'General', icon: HelpCircle, color: 'from-blue-500 to-cyan-500' },
        { name: 'Orders', icon: Gift, color: 'from-purple-500 to-pink-500' },
        { name: 'Payment', icon: CreditCard, color: 'from-green-500 to-emerald-500' },
        { name: 'Vouchers', icon: Shield, color: 'from-orange-500 to-red-500' },
        { name: 'Refunds', icon: Clock, color: 'from-indigo-500 to-purple-500' },
        { name: 'Account', icon: Shield, color: 'from-pink-500 to-rose-500' }
    ]

    const [activeCategory, setActiveCategory] = useState<string>('General')

    const filteredFAQs = faqs.filter(faq => faq.category === activeCategory)

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="bg-dark-100 py-12 px-4">
                {/* Header */}
                <div className="max-w-4xl mx-auto mb-12 text-center">
                    <div className="inline-block p-3 bg-gradient-to-br from-accent-500 to-pink-500 rounded-2xl mb-4">
                        <HelpCircle className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Find answers to common questions about Giftify
                    </p>
                </div>

                {/* Category Pills */}
                <div className="max-w-4xl mx-auto mb-8">
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((category) => {
                            const Icon = category.icon
                            return (
                                <button
                                    key={category.name}
                                    onClick={() => {
                                        setActiveCategory(category.name)
                                        setOpenIndex(0)
                                    }}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${activeCategory === category.name
                                        ? 'bg-gradient-to-r ' + category.color + ' text-white shadow-lg scale-105'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {category.name}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* FAQ Accordion */}
                <div className="max-w-4xl mx-auto space-y-4">
                    {filteredFAQs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-accent-500/50 transition-all"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-white/5 transition-colors"
                            >
                                <h3 className="text-white font-semibold text-lg pr-4">
                                    {faq.question}
                                </h3>
                                <ChevronDown
                                    className={`w-5 h-5 text-accent-400 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'
                                    }`}
                            >
                                <div className="px-6 pb-5 text-gray-300 leading-relaxed border-t border-white/10 pt-4">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="max-w-4xl mx-auto mt-16 text-center">
                    <div className="bg-gradient-to-br from-accent-500/10 to-pink-500/10 border border-accent-500/30 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-3">
                            Still have questions?
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Our support team is here to help you 24/7
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

export default FAQ

