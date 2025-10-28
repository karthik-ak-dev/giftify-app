import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Minus } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { brandsService } from '../services/brandsService'
import { Brand } from '../types/brand'

const BrandDetail = () => {
    const { brandSlug } = useParams<{ brandSlug: string }>()
    const { addToCart, updateQuantity, items } = useCart()
    const [brand, setBrand] = useState<Brand | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBrand = async () => {
            if (!brandSlug) return

            setLoading(true)
            try {
                const data = await brandsService.getBrandById(brandSlug)
                setBrand(data)
            } catch (error) {
                console.error('Error fetching brand:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchBrand()
    }, [brandSlug])

    // Get quantity from global cart
    const getCartQuantity = (variantId: string) => {
        const cartItem = items.find(item => item.variantId === variantId)
        return cartItem ? cartItem.quantity : 0
    }

    const handleQuantityChange = async (variant: { id: string; name: string; salePrice: number; originalPrice: number }, change: number) => {
        if (!brand) return

        const currentQty = getCartQuantity(variant.id)
        const newQty = currentQty + change

        try {
            if (newQty <= 0) {
                await updateQuantity(variant.id, 0)
            } else if (currentQty === 0 && change > 0) {
                // Adding to cart for the first time
                await addToCart(variant.id, change)
            } else {
                // Update existing cart item
                await updateQuantity(variant.id, newQty)
            }
        } catch (error) {
            console.error('Failed to update cart:', error)
            // You might want to show an error message to the user
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-white text-xl">Loading...</div>
                </div>
                <Footer />
            </div>
        )
    }

    if (!brand) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">Brand Not Found</h2>
                        <p className="text-white/60">The brand you're looking for doesn't exist.</p>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Modern Brand Header - Open Layout */}
            <section className="pt-8 pb-6 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                        {/* Left: Brand Logo */}
                        <div className="flex-shrink-0">
                            <div className="relative flex items-center justify-center w-72 h-44 lg:w-[380px] lg:h-56 overflow-hidden rounded-lg bg-glass-panel shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-panel to-bg-elevated opacity-40"></div>
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    className="relative w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Right: Brand Information */}
                        <div className="flex-1 space-y-4 text-center lg:text-left flex flex-col justify-center">
                            {/* Category Badge */}
                            <div>
                                <span className="inline-block px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl shadow-lg shadow-pink-500/30 text-white text-sm font-bold">
                                    {brand.category}
                                </span>
                            </div>

                            {/* Brand Name */}
                            <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight">
                                {brand.name}
                            </h1>

                            {/* Description */}
                            <p className="text-white/80 text-base lg:text-lg max-w-3xl mx-auto lg:mx-0">
                                {brand.description}
                            </p>

                            {/* Stats Row */}
                            <div className="flex items-center justify-center lg:justify-start gap-3 flex-wrap pt-2">
                                <div className="px-3 py-2 rounded-pill bg-purple-900/50 border border-purple-700/30">
                                    <span className="text-cyan-400 font-bold text-sm">
                                        {brand.variants.length} Variants Available
                                    </span>
                                </div>
                                <div className="px-3 py-2 rounded-pill bg-purple-900/50 border border-purple-700/30">
                                    <span className="text-green-400 font-bold text-sm">
                                        ✓ {(brand.vouchersSold / 1000).toFixed(1)}K+ sold
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Variants Section */}
            <section className="pb-12 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="mb-6">
                        <h2 className="text-2xl lg:text-3xl font-black text-white mb-1">
                            Choose Variant
                        </h2>
                        <p className="text-white/70">
                            Select your preferred gift card variant
                        </p>
                    </div>

                    {/* Variants Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
                        {brand.variants.map((variant) => {
                            const quantity = getCartQuantity(variant.id)

                            return (
                                <div
                                    key={variant.id}
                                    className="arcade-card group relative overflow-hidden p-3 sm:p-4 min-h-[180px] sm:min-h-[220px] transition-all duration-300 hover:scale-105 hover:border-[3px] hover:border-purple-300 hover:bg-purple-700/40"
                                >
                                    {/* Card Content */}
                                    <div className="flex flex-col h-full">
                                        {/* Variant Title */}
                                        <h3 className="text-sm sm:text-base font-bold text-white text-center mb-2 sm:mb-3">
                                            {variant.name}
                                        </h3>

                                        {/* Price Info - Enhanced */}
                                        <div className="flex flex-col items-center mb-3 sm:mb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xl sm:text-2xl text-white font-black tracking-tight">₹{variant.salePrice}</span>
                                                <span className="px-2 py-0.5 bg-green-500/20 border border-green-500/40 rounded-full text-[10px] sm:text-xs text-green-400 font-bold">
                                                    {variant.discountPercent}% OFF
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs sm:text-sm text-white/40 line-through">₹{variant.originalPrice}</span>
                                                <span className="text-[10px] sm:text-xs text-green-400 font-semibold">Save ₹{variant.originalPrice - variant.salePrice}</span>
                                            </div>
                                        </div>

                                        {/* Spacer */}
                                        <div className="flex-1"></div>

                                        {/* Add to Cart Button */}
                                        <div>
                                            {quantity === 0 ? (
                                                <button
                                                    onClick={() => handleQuantityChange(variant, 1)}
                                                    className="w-full py-2 sm:py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-lg font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1.5 shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95"
                                                >
                                                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
                                                    <span>Add to Cart</span>
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleQuantityChange(variant, -1)}
                                                        className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white rounded-lg transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
                                                    >
                                                        <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
                                                    </button>
                                                    <div className="flex-1 h-9 sm:h-10 bg-purple-900/50 border-2 border-purple-700/30 text-white rounded-lg font-bold text-sm sm:text-base flex items-center justify-center">
                                                        {quantity}
                                                    </div>
                                                    <button
                                                        onClick={() => handleQuantityChange(variant, 1)}
                                                        className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-lg transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95 shadow-lg shadow-pink-500/30"
                                                    >
                                                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default BrandDetail

