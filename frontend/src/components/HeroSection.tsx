import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
    const navigate = useNavigate()
    return (
        <section className="relative h-[500px] bg-gradient-to-br from-dark-100/40 via-dark-200/30 to-dark-50/50 overflow-hidden backdrop-blur-sm">
            {/* Geometric Pattern Background */}
            <div className="absolute inset-0 opacity-5">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <circle cx="20" cy="20" r="1" fill="currentColor" className="text-white" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* Decorative blobs in background */}
            <div className="absolute top-20 right-40 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-accent-400/15 rounded-full blur-3xl" />
            <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

            {/* Decorative shapes */}
            <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/20 rounded-lg rotate-12" />
            <div className="absolute bottom-20 right-20 w-16 h-16 border-2 border-accent-400/30 rounded-full" />

            {/* Content Container */}
            <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center">
                <div className="w-full grid grid-cols-12 gap-8 items-center">
                    {/* Left Shelf Illustration */}
                    <div className="col-span-3 hidden lg:block">
                        <div className="relative bg-dark-100/30 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-5 h-80 overflow-hidden shadow-xl shadow-black/10">
                            {/* Store Shelf with Items */}
                            <div className="absolute inset-0 p-6">
                                <div className="h-full flex flex-col justify-between">
                                    {/* Shelf 1 - Top */}
                                    <div className="flex items-end justify-around">
                                        <div className="w-14 h-20 bg-gradient-to-br from-accent-400/40 to-accent-500/30 rounded-lg border border-white/20 shadow-lg transform -rotate-3" />
                                        <div className="w-12 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded border border-white/30 shadow-lg" />
                                        <div className="w-10 h-12 bg-gradient-to-br from-accent-300/40 to-accent-400/30 rounded-lg border border-white/20 shadow-lg transform rotate-6" />
                                    </div>

                                    {/* Shelf 2 */}
                                    <div className="flex items-end justify-around">
                                        <div className="w-16 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-lg border border-white/30 shadow-lg" />
                                        <div className="w-10 h-20 bg-gradient-to-br from-accent-500/40 to-accent-600/30 rounded border border-white/20 shadow-lg transform -rotate-2" />
                                        <div className="w-12 h-14 bg-gradient-to-br from-accent-400/40 to-accent-500/30 rounded-lg border border-white/20 shadow-lg" />
                                    </div>

                                    {/* Shelf 3 */}
                                    <div className="flex items-end justify-around">
                                        <div className="w-12 h-16 bg-gradient-to-br from-accent-400/40 to-accent-500/30 rounded-lg border border-white/20 shadow-lg transform rotate-3" />
                                        <div className="w-14 h-14 bg-gradient-to-br from-white/20 to-white/10 rounded border border-white/30 shadow-lg" />
                                        <div className="w-10 h-18 bg-gradient-to-br from-accent-300/40 to-accent-400/30 rounded-lg border border-white/20 shadow-lg transform -rotate-6" />
                                    </div>

                                    {/* Shelf 4 - Bottom */}
                                    <div className="flex items-end justify-around">
                                        <div className="w-16 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-lg border border-white/30 shadow-lg" />
                                        <div className="w-10 h-16 bg-gradient-to-br from-accent-500/40 to-accent-600/30 rounded border border-white/20 shadow-lg transform rotate-2" />
                                        <div className="w-12 h-12 bg-gradient-to-br from-accent-400/40 to-accent-500/30 rounded-lg border border-white/20 shadow-lg" />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-3 left-0 right-0 text-center">
                                <div className="text-white/70 text-xs font-medium">Store Display</div>
                            </div>
                        </div>
                    </div>

                    {/* Center Content */}
                    <div className="col-span-12 lg:col-span-6 text-center space-y-6">
                        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-accent-300 to-white leading-none tracking-tight drop-shadow-2xl">
                            Giftify
                        </h1>
                        <p className="text-xl text-white/90 font-medium">
                            Your Premium Gift Card Marketplace
                        </p>
                        <div className="pt-2">
                            <button
                                onClick={() => navigate('/brands')}
                                className="px-12 py-4 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white rounded-xl font-bold text-base tracking-wide transition-all duration-300 shadow-xl shadow-accent-500/60 hover:scale-105"
                            >
                                Explore Giftify
                            </button>
                        </div>
                    </div>

                    {/* Right Shelf Illustration */}
                    <div className="col-span-3 hidden lg:block">
                        <div className="relative bg-dark-100/30 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-5 h-80 overflow-hidden shadow-xl shadow-black/10">
                            {/* Shopping Shelf with Items */}
                            <div className="absolute inset-0 p-6">
                                <div className="h-full flex flex-col justify-between">
                                    {/* Shelf 1 - Top */}
                                    <div className="flex items-end justify-around">
                                        <div className="w-10 h-18 bg-gradient-to-br from-accent-300/40 to-accent-400/30 rounded-lg border border-white/20 shadow-lg transform rotate-6" />
                                        <div className="w-14 h-14 bg-gradient-to-br from-white/20 to-white/10 rounded border border-white/30 shadow-lg" />
                                        <div className="w-12 h-20 bg-gradient-to-br from-accent-400/40 to-accent-500/30 rounded-lg border border-white/20 shadow-lg transform -rotate-3" />
                                    </div>

                                    {/* Shelf 2 */}
                                    <div className="flex items-end justify-around">
                                        <div className="w-12 h-14 bg-gradient-to-br from-accent-500/40 to-accent-600/30 rounded-lg border border-white/20 shadow-lg transform -rotate-2" />
                                        <div className="w-16 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded border border-white/30 shadow-lg" />
                                        <div className="w-10 h-16 bg-gradient-to-br from-accent-400/40 to-accent-500/30 rounded-lg border border-white/20 shadow-lg" />
                                    </div>

                                    {/* Shelf 3 */}
                                    <div className="flex items-end justify-around">
                                        <div className="w-14 h-16 bg-gradient-to-br from-accent-400/40 to-accent-500/30 rounded-lg border border-white/20 shadow-lg transform rotate-3" />
                                        <div className="w-10 h-14 bg-gradient-to-br from-white/20 to-white/10 rounded border border-white/30 shadow-lg transform -rotate-6" />
                                        <div className="w-12 h-18 bg-gradient-to-br from-accent-500/40 to-accent-600/30 rounded-lg border border-white/20 shadow-lg" />
                                    </div>

                                    {/* Shelf 4 - Bottom */}
                                    <div className="flex items-end justify-around">
                                        <div className="w-10 h-12 bg-gradient-to-br from-accent-300/40 to-accent-400/30 rounded-lg border border-white/20 shadow-lg" />
                                        <div className="w-12 h-16 bg-gradient-to-br from-accent-500/40 to-accent-600/30 rounded border border-white/20 shadow-lg transform rotate-2" />
                                        <div className="w-16 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-lg border border-white/30 shadow-lg" />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-3 left-0 right-0 text-center">
                                <div className="text-white/70 text-xs font-medium">Shopping</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection

