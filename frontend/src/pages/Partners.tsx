import { Users, Building2, TrendingUp, Shield } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Partners = () => {
    const benefits = [
        {
            icon: TrendingUp,
            title: 'Increased Reach',
            description: 'Access our growing customer base of 50,000+ active users.',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Shield,
            title: 'Secure Platform',
            description: 'Industry-leading security with guaranteed payment processing.',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: Building2,
            title: 'Brand Visibility',
            description: 'Featured placement and marketing support for all partners.',
            color: 'from-green-500 to-emerald-500'
        }
    ]

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="bg-dark-100 py-12 px-4">
                {/* Header */}
                <div className="max-w-4xl mx-auto mb-12 text-center">
                    <div className="inline-block p-3 bg-gradient-to-br from-accent-500 to-pink-500 rounded-2xl mb-4">
                        <Users className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Partner With Us
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Join our network of 100+ leading brands
                    </p>
                </div>

                {/* Introduction */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Why Partner With Giftify?</h2>
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                Giftify is the leading digital gift card marketplace, connecting thousands of customers with their favorite brands every day. By partnering with us, you gain access to a highly engaged audience actively looking for gift cards and vouchers.
                            </p>
                            <p>
                                We handle all the technical infrastructure, payment processing, customer support, and marketing, allowing you to focus on what you do best – running your business. Our platform ensures instant delivery, secure transactions, and an exceptional customer experience.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Benefits Grid */}
                <div className="max-w-4xl mx-auto mb-12">
                    <h2 className="text-2xl font-bold text-white mb-8 text-center">Partnership Benefits</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {benefits.map((benefit, index) => {
                            const Icon = benefit.icon
                            return (
                                <div
                                    key={index}
                                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:border-accent-500/50 transition-all"
                                >
                                    <div className={`inline-block p-3 bg-gradient-to-br ${benefit.color} rounded-xl mb-4`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {benefit.description}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* How It Works */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-6">How It Works</h2>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center text-white font-bold">
                                    1
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Submit Application</h3>
                                    <p className="text-gray-400 text-sm">Contact us with your brand details and partnership interest.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center text-white font-bold">
                                    2
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Integration Setup</h3>
                                    <p className="text-gray-400 text-sm">Our team will handle the technical integration and onboarding.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center text-white font-bold">
                                    3
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Go Live</h3>
                                    <p className="text-gray-400 text-sm">Launch your gift cards on our platform and start reaching customers.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-br from-accent-500/10 to-pink-500/10 border border-accent-500/30 rounded-2xl p-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-3">
                            Interested in Partnering?
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Get in touch with our partnerships team to learn more
                        </p>
                        <a
                            href="mailto:partnerships@giftify.com"
                            className="inline-block px-8 py-3 bg-gradient-to-r from-accent-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-accent-500/50 transition-all"
                        >
                            Contact Partnerships Team
                        </a>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Partners

