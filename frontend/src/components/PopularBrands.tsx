import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { brandsService } from '../services/brandsService'
import { Brand } from '../data/brandsData'

const PopularBrands = () => {
    const [brands, setBrands] = useState<Brand[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPopularBrands = async () => {
            try {
                const data = await brandsService.getPopularBrands(10)
                setBrands(data)
            } catch (error) {
                console.error('Error fetching popular brands:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchPopularBrands()
    }, [])
    if (loading) {
        return (
            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-4xl font-display font-bold text-white mb-2">
                            Popular Brands
                        </h2>
                        <p className="text-white/60">
                            Top trending brands with exclusive discounts
                        </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="bg-white/5 rounded-2xl h-[240px] animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="mb-8">
                    <h2 className="text-4xl font-display font-bold text-white mb-2">
                        Popular Brands
                    </h2>
                    <p className="text-white/60">
                        Top trending brands with exclusive discounts
                    </p>
                </div>

                {/* Brands Grid - 5 Cards per Line, 2 Rows (10 brands) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {brands.map((brand) => {
                        // Calculate the highest discount from variants
                        const maxDiscount = Math.max(...brand.variants.map(v => v.discountPercent))

                        return (
                            <Link
                                key={brand.id}
                                to={`/brand/${brand.id}`}
                                className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer border border-white/10 hover:border-accent-400/50 shadow-xl shadow-black/20 hover:shadow-accent-400/30 hover:-translate-y-2 block"
                            >
                                {/* Discount Badge - Floating */}
                                <div className="absolute top-3 right-3 z-20">
                                    <div className="bg-accent-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-lg shadow-accent-500/50 backdrop-blur-sm">
                                        {maxDiscount}% Off
                                    </div>
                                </div>

                                {/* Logo Section - Large and Prominent */}
                                <div className="relative flex items-center justify-center h-[160px] overflow-hidden">
                                    <img
                                        src={brand.logo}
                                        alt={brand.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                {/* Brand Info - Bottom Bar */}
                                <div className="bg-dark-50/40 backdrop-blur-md px-4 py-3 border-t border-white/10">
                                    <h3 className="text-white font-bold text-base text-center truncate group-hover:text-accent-300 transition-colors mb-2">
                                        {brand.name}
                                    </h3>
                                    <div className="flex items-center justify-center gap-1.5 text-sm text-green-400 font-semibold">
                                        <span className="opacity-60">✓</span>
                                        <span>{(brand.vouchersSold / 1000).toFixed(1)}K+ sold</span>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>

                {/* View All Link */}
                <div className="mt-10 text-center">
                    <Link
                        to="/brands"
                        className="inline-block text-white hover:text-accent-300 font-semibold transition-all duration-300 border-2 border-white/30 hover:border-accent-300/70 px-8 py-3.5 rounded-xl hover:bg-accent-500/10 backdrop-blur-xl shadow-lg shadow-black/10 hover:shadow-accent-400/30 text-base"
                    >
                        View All Brands →
                    </Link>
                    <p className="text-white/50 text-xs mt-3">Browse all available brands</p>
                </div>
            </div>
        </section>
    )
}

export default PopularBrands

