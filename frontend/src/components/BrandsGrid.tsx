import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { brandsService } from '../services/brandsService'
import { Brand } from '../types/brand'

interface BrandsGridProps {
    selectedCategory?: string | null
}

const BrandsGrid = ({ selectedCategory }: BrandsGridProps) => {
    const [brands, setBrands] = useState<Brand[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBrands = async () => {
            setLoading(true)
            try {
                const data = selectedCategory
                    ? await brandsService.getBrandsByCategory(selectedCategory)
                    : await brandsService.getAllBrands()
                setBrands(data)
            } catch (error) {
                console.error('Error fetching brands:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchBrands()
    }, [selectedCategory])

    if (loading) {
        return (
            <section className="pt-2 pb-6 px-3 sm:px-6 lg:px-8">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                        {[...Array(24)].map((_, i) => (
                            <div key={i} className="arcade-card h-[180px] sm:h-[240px] animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="pt-2 pb-6 px-3 sm:px-6 lg:px-8">
            <div className="max-w-[1400px] mx-auto">
                {brands.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-white/60 text-lg">No brands found in this category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                        {brands.map((brand) => {
                            const maxDiscount = Math.max(...brand.variants.map(v => v.discountPercent))

                            return (
                                <Link
                                    key={brand.id}
                                    to={`/brand/${brand.id}`}
                                    className="arcade-card block group relative overflow-hidden p-2 sm:p-2.5 pb-3 sm:pb-4 min-h-[180px] sm:min-h-[240px] transition-all duration-300 hover:scale-105 hover:border-[3px] hover:border-purple-300 hover:bg-purple-700/40"
                                >
                                    {/* Logo Section */}
                                    <div className="relative flex items-center justify-center h-[105px] sm:h-[120px] overflow-hidden rounded-lg mb-2 bg-white/5">
                                        <img
                                            src={brand.logo}
                                            alt={brand.name}
                                            className="relative w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                        />
                                    </div>

                                    {/* Brand Info */}
                                    <div className="space-y-0.5 sm:space-y-1 relative mb-10 sm:mb-9">
                                        <h3 className="text-sm sm:text-h3 text-white text-center truncate group-hover:text-white/90 transition-colors">
                                            {brand.name}
                                        </h3>
                                        <div className="flex items-center justify-center">
                                            <div className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-pill bg-purple-900/50 border border-purple-700/30">
                                                <span className="text-xs sm:text-caption text-green-400 font-bold">
                                                    ✓ {(brand.vouchersSold / 1000).toFixed(1)}K+ sold
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Discount Badge */}
                                    <div className="absolute bottom-0 right-0 discount-corner-badge">
                                        <span className="text-xs sm:text-sm font-black">{maxDiscount}%</span>
                                        <span className="text-[10px] sm:text-xs font-bold ml-0.5">OFF</span>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}

export default BrandsGrid

