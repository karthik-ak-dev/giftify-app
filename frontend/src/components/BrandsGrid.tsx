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
            <section className="pt-2 pb-6 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="arcade-card h-[260px] animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="pt-2 pb-6 px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {brands.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-white/60 text-lg">No brands found in this category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                        {brands.map((brand) => {
                            const maxDiscount = Math.max(...brand.variants.map(v => v.discountPercent))

                            return (
                                <Link
                                    key={brand.id}
                                    to={`/brand/${brand.id}`}
                                    className="arcade-card block group relative overflow-hidden p-3 min-h-[260px]"
                                >
                                    {/* Logo Section */}
                                    <div className="relative flex items-center justify-center h-[120px] overflow-hidden rounded-lg mb-3 bg-glass-panel">
                                        <div className="absolute inset-0 bg-gradient-to-br from-panel to-bg-elevated opacity-40"></div>
                                        <img
                                            src={brand.logo}
                                            alt={brand.name}
                                            className="relative w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                        />
                                    </div>

                                    {/* Brand Info */}
                                    <div className="space-y-2.5 relative">
                                        <h3 className="text-h3 text-text-high text-center truncate group-hover:text-primary-300 transition-colors">
                                            {brand.name}
                                        </h3>
                                        <div className="flex items-center justify-center">
                                            <div className="px-2.5 py-1 rounded-pill bg-purple-900/50 border border-purple-700/30">
                                                <span className="text-caption text-green-400 font-bold">
                                                    ✓ {(brand.vouchersSold / 1000).toFixed(1)}K+ sold
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Discount Badge */}
                                    <div className="absolute bottom-0 right-0 discount-corner-badge">
                                        <span className="text-sm font-black">{maxDiscount}%</span>
                                        <span className="text-xs font-bold ml-0.5">OFF</span>
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

