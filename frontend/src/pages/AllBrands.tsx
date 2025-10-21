import { useState, useEffect } from 'react'
import { ArrowLeft, Filter, ChevronDown, Star } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { brandsService } from '../services/brandsService'
import { Brand } from '../types/brand'

const AllBrands = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [brands, setBrands] = useState<Brand[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>('All')
    const [loading, setLoading] = useState(true)

    // Get category from URL params on mount
    useEffect(() => {
        const categoryParam = searchParams.get('category')
        if (categoryParam) {
            setSelectedCategory(categoryParam)
        }
    }, [searchParams])

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await brandsService.getCategories()
                setCategories(data)
            } catch (error) {
                console.error('Error fetching categories:', error)
            }
        }

        fetchCategories()
    }, [])

    // Fetch brands when category changes
    useEffect(() => {
        const fetchBrands = async () => {
            setLoading(true)
            try {
                const data = await brandsService.getBrandsByCategory(selectedCategory)
                setBrands(data)
            } catch (error) {
                console.error('Error fetching brands:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchBrands()
    }, [selectedCategory])

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category)
        // Update URL params
        if (category === 'All') {
            searchParams.delete('category')
        } else {
            searchParams.set('category', category)
        }
        setSearchParams(searchParams)
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Header Section */}
            <section className="pt-8 pb-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-accent-50">
                <div className="max-w-7xl mx-auto">
                    {/* Back Button */}
                    <Link
                        to="/"
                        className="inline-flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors mb-6 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Home</span>
                    </Link>

                    {/* Page Title & Category Filter */}
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-display font-black text-neutral-900 mb-3">
                                All Brands
                            </h1>
                            <p className="text-neutral-600 text-lg">
                                {loading ? 'Loading...' : `Discover ${brands.length} brands • Exclusive discounts on all gift cards`}
                            </p>
                        </div>

                        {/* Clean Dropdown Filter */}
                        <div className="flex items-center gap-3">
                            <Filter className="w-5 h-5 text-neutral-500" />
                            <div className="relative">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    className="appearance-none bg-white border-2 border-neutral-200 text-neutral-900 rounded-xl pl-4 pr-10 py-3 font-medium text-sm cursor-pointer focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 hover:border-neutral-300 transition-all shadow-elegant"
                                >
                                    {categories.map((category) => (
                                        <option
                                            key={category}
                                            value={category}
                                            className="bg-white text-neutral-900"
                                        >
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="w-5 h-5 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Brands Grid */}
            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="bg-neutral-200 rounded-2xl h-[260px] animate-pulse" />
                            ))}
                        </div>
                    ) : brands.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Filter className="w-10 h-10 text-neutral-400" />
                            </div>
                            <p className="text-neutral-600 text-lg font-medium">No brands found in this category.</p>
                            <p className="text-neutral-500 text-sm mt-2">Try selecting a different category</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {brands.map((brand, index) => {
                                // Calculate the highest discount from variants
                                const maxDiscount = Math.max(...brand.variants.map(v => v.discountPercent))

                                return (
                                    <Link
                                        key={brand.id}
                                        to={`/brand/${brand.id}`}
                                        className="group elegant-card gradient-border overflow-hidden animate-fade-in"
                                        style={{ animationDelay: `${index * 0.03}s` }}
                                    >
                                        {/* Discount Badge */}
                                        {maxDiscount > 0 && (
                                            <div className="absolute top-3 right-3 z-20">
                                                <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-elegant-md">
                                                    {maxDiscount}% OFF
                                                </div>
                                            </div>
                                        )}

                                        {/* Logo */}
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
                    )}
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default AllBrands
