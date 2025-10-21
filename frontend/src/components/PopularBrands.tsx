import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { brandsService } from '../services/brandsService'
import { Brand } from '../types/brand'
import { TrendingUp, Star } from 'lucide-react'

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
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-indigo-50">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <div className="h-10 w-64 bg-neutral-200 rounded-lg animate-pulse mb-3" />
                        <div className="h-5 w-96 bg-neutral-100 rounded animate-pulse" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="bg-neutral-100 rounded-2xl h-[260px] animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center space-x-2 bg-primary-50 px-4 py-2 rounded-full mb-4 border border-primary-100">
                        <TrendingUp className="w-4 h-4 text-primary-600" />
                        <span className="text-sm font-semibold text-primary-700">Trending Now</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-3">
                        Popular Brands
                    </h2>
                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                        Top trending brands with exclusive discounts and instant delivery
                    </p>
                </div>

                {/* Brands Grid - 5 Cards per Line, 2 Rows (10 brands) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {brands.map((brand, index) => {
                        // Calculate the highest discount from variants
                        const maxDiscount = Math.max(...brand.variants.map(v => v.discountPercent))

                        return (
                            <Link
                                key={brand.id}
                                to={`/brand/${brand.id}`}
                                className="group elegant-card gradient-border overflow-hidden animate-fade-in"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                {/* Discount Badge */}
                                {maxDiscount > 0 && (
                                    <div className="absolute top-3 right-3 z-20">
                                        <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-elegant-md">
                                            {maxDiscount}% OFF
                                        </div>
                                    </div>
                                )}

                                {/* Logo Section */}
                                <div className="relative flex items-center justify-center h-[160px] bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                                    <img
                                        src={brand.logo}
                                        alt={brand.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                {/* Brand Info */}
                                <div className="p-4 bg-gradient-to-b from-slate-50 to-white border-t border-slate-200">
                                    <h3 className="text-slate-900 font-bold text-base text-center truncate group-hover:text-primary-600 transition-colors mb-2">
                                        {brand.name}
                                    </h3>
                                    <div className="flex items-center justify-center gap-1.5 text-sm">
                                        <Star className="w-4 h-4 text-success-500 fill-success-500" />
                                        <span className="text-slate-700 font-medium">
                                            {(brand.vouchersSold / 1000).toFixed(1)}K+ sold
                                        </span>
                                    </div>
                                </div>

                                {/* Hover Effect - Bottom Border */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                            </Link>
                        )
                    })}
                </div>

                {/* View All Link */}
                <div className="mt-12 text-center">
                    <Link
                        to="/brands"
                        className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-bold rounded-xl elegant-button shadow-elegant-lg"
                    >
                        <span>View All Brands</span>
                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                    <p className="text-neutral-500 text-sm mt-4">Explore our complete collection of brands</p>
                </div>
            </div>
        </section>
    )
}

export default PopularBrands
