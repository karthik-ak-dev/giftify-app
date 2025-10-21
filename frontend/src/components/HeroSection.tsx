import { useNavigate } from 'react-router-dom'
import { Sparkles, Gift, TrendingUp } from 'lucide-react'

const HeroSection = () => {
    const navigate = useNavigate()
    return (
        <section className="relative min-h-[600px] bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 opacity-30">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="elegant-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                            <circle cx="30" cy="30" r="1.5" fill="#0ea5e9" opacity="0.3" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#elegant-grid)" />
                </svg>
            </div>

            {/* Decorative gradient blobs */}
            <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full blur-3xl opacity-20 animate-pulse" />
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-accent-200 to-accent-300 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Floating decorative shapes */}
            <div className="absolute top-24 left-12 w-16 h-16 border-4 border-primary-300/40 rounded-2xl rotate-12 animate-pulse" />
            <div className="absolute bottom-32 right-24 w-12 h-12 border-4 border-accent-300/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />

            {/* Content Container */}
            <div className="relative max-w-7xl mx-auto px-6 py-20 h-full flex items-center">
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left Feature Card */}
                    <div className="lg:col-span-3 hidden lg:block animate-slide-up">
                        <div className="elegant-card p-6 gradient-border">
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-elegant-md">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-neutral-900">Premium Selection</h3>
                                <p className="text-sm text-neutral-600">Curated gift cards from top brands worldwide</p>
                                <div className="flex items-center space-x-2">
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full border-2 border-white" />
                                        <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-500 rounded-full border-2 border-white" />
                                        <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full border-2 border-white" />
                                    </div>
                                    <span className="text-xs text-neutral-500 font-medium">500+ Brands</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center Content */}
                    <div className="lg:col-span-6 text-center space-y-8 animate-fade-in">
                        <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-200 shadow-elegant">
                            <TrendingUp className="w-4 h-4 text-primary-600" />
                            <span className="text-sm font-semibold text-primary-700">Trending Gift Cards</span>
                        </div>

                        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-display font-black">
                            <span className="gradient-text">Giftify</span>
                        </h1>

                        <p className="text-xl sm:text-2xl text-neutral-600 font-medium max-w-2xl mx-auto">
                            Your Premium Gift Card Marketplace
                        </p>

                        <p className="text-base text-neutral-500 max-w-xl mx-auto">
                            Discover, purchase, and send digital gift cards instantly. The perfect gift for every occasion.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <button
                                onClick={() => navigate('/brands')}
                                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-xl font-bold text-lg tracking-wide elegant-button shadow-elegant-lg group"
                            >
                                <span className="flex items-center space-x-2">
                                    <span>Explore Brands</span>
                                    <Gift className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                </span>
                            </button>
                            <button
                                onClick={() => navigate('/brands')}
                                className="px-8 py-4 bg-white hover:bg-neutral-50 text-primary-600 rounded-xl font-bold text-lg tracking-wide elegant-button border-2 border-primary-200 shadow-elegant"
                            >
                                Learn More
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-center gap-8 pt-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold gradient-text">500+</div>
                                <div className="text-sm text-neutral-500">Brands</div>
                            </div>
                            <div className="w-px h-12 bg-neutral-200" />
                            <div className="text-center">
                                <div className="text-3xl font-bold gradient-text">50K+</div>
                                <div className="text-sm text-neutral-500">Happy Customers</div>
                            </div>
                            <div className="w-px h-12 bg-neutral-200" />
                            <div className="text-center">
                                <div className="text-3xl font-bold gradient-text">4.9</div>
                                <div className="text-sm text-neutral-500">Rating</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Feature Card */}
                    <div className="lg:col-span-3 hidden lg:block animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="elegant-card p-6 gradient-border">
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-elegant-md">
                                    <Gift className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-neutral-900">Instant Delivery</h3>
                                <p className="text-sm text-neutral-600">Get your gift cards delivered within seconds</p>
                                <div className="bg-gradient-to-r from-success-50 to-success-100 rounded-lg p-3 border border-success-200">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
                                        <span className="text-xs font-semibold text-success-700">Secure & Fast</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom wave decoration */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-24">
                    <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.5" />
                </svg>
            </div>
        </section>
    )
}

export default HeroSection
