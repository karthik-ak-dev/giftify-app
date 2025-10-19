import { Target, Award, Heart } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const About = () => {
    const values = [
        {
            icon: Target,
            title: 'Our Mission',
            description: 'To make gifting simple, instant, and accessible for everyone through digital solutions.',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Award,
            title: 'Quality Assured',
            description: 'Every gift card is 100% authentic and backed by our satisfaction guarantee.',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: Heart,
            title: 'Customer First',
            description: 'Your trust drives us. We provide 24/7 support and instant delivery on all orders.',
            color: 'from-green-500 to-emerald-500'
        }
    ]

    return (
        <div className="min-h-screen">
            <Navbar />
            
            {/* Header Section */}
            <section className="pt-8 pb-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-dark-100/40 via-dark-200/30 to-dark-50/50 border-b border-white/10">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-display font-bold text-white mb-2">
                        About Giftify
                    </h1>
                    <p className="text-white/60">
                        Your trusted digital gift card marketplace
                    </p>
                </div>
            </section>

            <div className="bg-dark-100 py-12 px-4">

                {/* Story Section */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Who We Are</h2>
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                Giftify is a leading digital marketplace for gift cards and vouchers, connecting customers with their favorite brands through instant, secure transactions. Founded with a vision to revolutionize the gifting experience, we've grown to serve thousands of satisfied customers across the globe.
                            </p>
                            <p>
                                We partner with hundreds of top brands to bring you exclusive discounts and instant delivery on digital gift cards. Whether you're treating yourself or surprising someone special, Giftify makes it easy, fast, and secure.
                            </p>
                            <p>
                                Our platform combines cutting-edge technology with exceptional customer service to ensure every transaction is smooth and every customer is satisfied. From the moment you browse to the instant you receive your voucher, we're committed to providing an outstanding experience.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Values Grid */}
                <div className="max-w-4xl mx-auto mb-12">
                    <h2 className="text-2xl font-bold text-white mb-8 text-center">What Drives Us</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {values.map((value, index) => {
                            const Icon = value.icon
                            return (
                                <div
                                    key={index}
                                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:border-accent-500/50 transition-all"
                                >
                                    <div className={`inline-block p-3 bg-gradient-to-br ${value.color} rounded-xl mb-4`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {value.description}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Stats Section */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="bg-gradient-to-br from-accent-500/10 to-pink-500/10 border border-accent-500/30 rounded-2xl p-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                            <div>
                                <div className="text-3xl font-bold text-white mb-1">100+</div>
                                <div className="text-gray-400 text-sm">Brands</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white mb-1">50K+</div>
                                <div className="text-gray-400 text-sm">Happy Customers</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white mb-1">200K+</div>
                                <div className="text-gray-400 text-sm">Vouchers Sold</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white mb-1">99.9%</div>
                                <div className="text-gray-400 text-sm">Satisfaction</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-3">
                            Ready to Get Started?
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Explore our collection of gift cards from top brands
                        </p>
                        <a
                            href="/brands"
                            className="inline-block px-8 py-3 bg-gradient-to-r from-accent-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-accent-500/50 transition-all"
                        >
                            Browse All Brands
                        </a>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default About

