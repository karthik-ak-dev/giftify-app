import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Minus, Star, TrendingUp } from 'lucide-react'
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
                    <div className="text-slate-600 text-xl">Loading...</div>
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
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Brand Not Found</h2>
                        <Link to="/brands" className="text-primary-600 hover:text-primary-700">
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
            <section className="relative pt-8 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-accent-50">
                <div className="relative max-w-7xl mx-auto">
                    {/* Back Button */}
                    <Link
                        to="/brands"
                        className="inline-flex items-center space-x-2 text-slate-600 hover:text-primary-600 transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to All Brands</span>
                    </Link>

                    {/* Brand Info */}
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                        {/* Brand Logo */}
                        <div className="relative">
                            <div className="w-48 h-36 rounded-2xl flex items-center justify-center overflow-hidden shadow-elegant-xl border-2 border-slate-200">
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Discount Badge */}
                            <div className="absolute -top-3 -right-3">
                                <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold text-sm px-4 py-2 rounded-xl shadow-elegant-lg">
                                    {maxDiscount}% Off
                                </div>
                            </div>
                        </div>

                        {/* Brand Details */}
                        <div className="flex-1">
                            <div className="inline-block px-4 py-1.5 bg-accent-50 border border-accent-200 rounded-lg mb-3">
                                <span className="text-accent-700 text-sm font-semibold">{brand.category}</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 mb-4">
                                {brand.name} Gift Cards
                            </h1>
                            <p className="text-slate-600 text-lg max-w-2xl mb-6">
                                {brand.description}
                            </p>
                            <div className="flex items-center gap-3 flex-wrap">
                                <div className="flex items-center gap-2 px-4 py-2 bg-success-50 border border-success-200 rounded-xl">
                                    <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
                                    <span className="text-success-700 text-sm font-medium">In Stock</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                                    <span className="text-slate-700 text-sm font-medium">
                                        {brand.variants.length} Variants Available
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-success-50 border border-success-200 rounded-xl">
                                    <Star className="w-4 h-4 text-success-500 fill-success-500" />
                                    <span className="text-success-700 text-sm font-semibold">
                                        {(brand.vouchersSold / 1000).toFixed(1)}K+ Sold
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Variants Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="mb-8">
                        <div className="inline-flex items-center space-x-2 bg-primary-50 px-4 py-2 rounded-full mb-4 border border-primary-100">
                            <TrendingUp className="w-4 h-4 text-primary-600" />
                            <span className="text-sm font-semibold text-primary-700">Available Variants</span>
                        </div>
                        <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">
                            Select Variant
                        </h2>
                        <p className="text-slate-600">
                            Choose your preferred gift card value
                        </p>
                    </div>

                    {/* Variants Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {brand.variants.map((variant, index) => {
                            const quantity = getCartQuantity(variant.id)

                            return (
                                <div
                                    key={variant.id}
                                    className="group relative elegant-card overflow-hidden animate-fade-in"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    {/* Discount Badge */}
                                    <div className="absolute top-3 right-3 z-20">
                                        <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-elegant-md">
                                            {variant.discountPercent}% OFF
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-4">
                                        {/* Value & Price */}
                                        <div className="mb-4">
                                            <div className="text-lg font-bold text-slate-900 mb-2">
                                                {variant.name}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-primary-600 font-bold text-xl">₹{variant.salePrice}</span>
                                                <span className="text-slate-400 text-sm line-through">₹{variant.originalPrice}</span>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">
                                                Save ₹{variant.originalPrice - variant.salePrice}
                                            </div>
                                        </div>

                                        {/* Add to Cart Button */}
                                        {quantity === 0 ? (
                                            <button
                                                onClick={() => handleQuantityChange(variant, 1)}
                                                className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-xl font-semibold text-sm elegant-button flex items-center justify-center gap-2 shadow-elegant-md"
                                            >
                                                <Plus className="w-4 h-4" strokeWidth={2.5} />
                                                <span>Add to Cart</span>
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleQuantityChange(variant, -1)}
                                                    className="w-10 h-10 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 rounded-xl transition-all duration-300 flex items-center justify-center elegant-button"
                                                >
                                                    <Minus className="w-4 h-4" strokeWidth={2.5} />
                                                </button>
                                                <div className="flex-1 h-10 bg-primary-50 border-2 border-primary-200 text-primary-700 rounded-xl font-bold text-base flex items-center justify-center">
                                                    {quantity}
                                                </div>
                                                <button
                                                    onClick={() => handleQuantityChange(variant, 1)}
                                                    className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl transition-all duration-300 flex items-center justify-center elegant-button"
                                                >
                                                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Hover Effect - Bottom Border */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
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