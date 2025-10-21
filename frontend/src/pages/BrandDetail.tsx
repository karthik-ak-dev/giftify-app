import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Minus } from 'lucide-react'
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
        // Extract numeric value from variant ID (e.g., "amazon-500" -> 500)
        const variantValue = parseInt(variantId.split('-')[1] || '0')
        const cartItem = items.find(
            item => item.brandSlug === brandSlug && item.variantValue === variantValue
        )
        return cartItem ? cartItem.quantity : 0
    }

    const handleQuantityChange = (variant: { id: string; name: string; salePrice: number; originalPrice: number }, change: number) => {
        if (!brand) return

        const currentQty = getCartQuantity(variant.id)
        const newQty = currentQty + change

        if (newQty <= 0) {
            updateQuantity(brandSlug || '', parseInt(variant.id.split('-')[1] || '0'), 0)
        } else if (currentQty === 0 && change > 0) {
            // Adding to cart for the first time
            addToCart({
                brandSlug: brandSlug || '',
                brandName: brand.name,
                brandLogo: brand.logo,
                variantValue: parseInt(variant.id.split('-')[1] || '0'),
                variantPrice: variant.salePrice
            }, change)
        } else {
            // Update existing cart item
            updateQuantity(brandSlug || '', parseInt(variant.id.split('-')[1] || '0'), newQty)
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
                        <Link to="/brands" className="text-accent-400 hover:text-accent-300">
                            ← Back to All Brands
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    // Calculate max discount
    const maxDiscount = Math.max(...brand.variants.map(v => v.discountPercent))

    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Brand Hero Section */}
            <section className="relative pt-8 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-dark-100/40 via-dark-200/30 to-dark-50/50 border-b border-white/10">
                {/* Decorative Background */}
                <div className="absolute inset-0 opacity-5">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="brand-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <circle cx="20" cy="20" r="1" fill="currentColor" className="text-white" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#brand-grid)" />
                    </svg>
                </div>

                <div className="relative max-w-7xl mx-auto">
                    {/* Back Button */}
                    <Link
                        to="/brands"
                        className="inline-flex items-center space-x-2 text-white/70 hover:text-accent-300 transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to All Brands</span>
                    </Link>

                    {/* Brand Info */}
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                        {/* Brand Logo */}
                        <div className="relative">
                            <div className="w-48 h-36 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl shadow-black/20 border-2 border-white/20">
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Discount Badge */}
                            <div className="absolute -top-3 -right-3">
                                <div className="bg-accent-500 text-white font-bold text-sm px-4 py-2 rounded-xl shadow-xl shadow-accent-500/50 backdrop-blur-sm">
                                    {maxDiscount}% Off
                                </div>
                            </div>
                        </div>

                        {/* Brand Details */}
                        <div className="flex-1">
                            <div className="inline-block px-4 py-1.5 bg-accent-500/20 border border-accent-400/40 rounded-lg mb-3">
                                <span className="text-accent-300 text-sm font-semibold">{brand.category}</span>
                            </div>
                            <h1 className="text-5xl font-display font-black text-white mb-4">
                                {brand.name} Gift Cards
                            </h1>
                            <p className="text-white/70 text-lg max-w-2xl">
                                {brand.description}
                            </p>
                            <div className="mt-6 flex items-center gap-3 flex-wrap">
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    <span className="text-white/80 text-sm font-medium">In Stock</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                                    <span className="text-white/80 text-sm font-medium">
                                        {brand.variants.length} Variants Available
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-400/30 rounded-xl">
                                    <span className="text-green-400 text-sm font-semibold">✓</span>
                                    <span className="text-green-400 text-sm font-semibold">
                                        {(brand.vouchersSold / 1000).toFixed(1)}K+ Sold
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Variants Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-display font-bold text-white mb-2">
                            Select Variant
                        </h2>
                        <p className="text-white/60">
                            Choose your preferred gift card value
                        </p>
                    </div>

                    {/* Variants Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {brand.variants.map((variant) => {
                            const quantity = getCartQuantity(variant.id)

                            return (
                                <div
                                    key={variant.id}
                                    className="group relative bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-accent-400/50 transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-accent-400/20"
                                >
                                    {/* Discount Badge */}
                                    <div className="absolute top-2 right-2 bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
                                        {variant.discountPercent}% OFF
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-4">
                                        {/* Value & Price */}
                                        <div className="mb-3">
                                            <div className="text-lg font-bold text-white mb-1">
                                                {variant.name}
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-accent-400 font-semibold">₹{variant.salePrice}</span>
                                                <span className="text-white/40 text-xs line-through">₹{variant.originalPrice}</span>
                                            </div>
                                        </div>

                                        {/* Add to Cart Button */}
                                        {quantity === 0 ? (
                                            <button
                                                onClick={() => handleQuantityChange(variant, 1)}
                                                className="w-full py-2.5 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-lg hover:shadow-accent-500/30 active:scale-95"
                                            >
                                                <Plus className="w-4 h-4" strokeWidth={2.5} />
                                                <span>Add to Cart</span>
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleQuantityChange(variant, -1)}
                                                    className="w-10 h-10 bg-gradient-to-br from-white/10 to-white/5 hover:from-red-500/20 hover:to-red-600/10 border border-white/20 hover:border-red-400/50 text-white hover:text-red-300 rounded-xl transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95 shadow-lg shadow-black/10 hover:shadow-red-500/20"
                                                >
                                                    <Minus className="w-4 h-4" strokeWidth={2.5} />
                                                </button>
                                                <div className="flex-1 h-10 bg-gradient-to-br from-accent-500/30 to-accent-600/20 border-2 border-accent-400/50 text-white rounded-xl font-bold text-base flex items-center justify-center shadow-inner backdrop-blur-sm">
                                                    {quantity}
                                                </div>
                                                <button
                                                    onClick={() => handleQuantityChange(variant, 1)}
                                                    className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white rounded-xl transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95 shadow-lg shadow-accent-500/30 hover:shadow-accent-500/50"
                                                >
                                                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        )}
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

