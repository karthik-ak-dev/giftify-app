import { useState, useEffect } from 'react'
import { ArrowLeft, Filter, ChevronDown } from 'lucide-react'
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
            <section className="pt-8 pb-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-dark-100/40 via-dark-200/30 to-dark-50/50 border-b border-white/10">
                <div className="max-w-7xl mx-auto">
                    {/* Back Button */}
                    <Link
                        to="/"
                        className="inline-flex items-center space-x-2 text-white/70 hover:text-accent-300 transition-colors mb-6 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Home</span>
                    </Link>

                    {/* Page Title & Category Filter */}
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <h1 className="text-5xl font-display font-black text-white mb-3">
                                All Brands
                            </h1>
                            <p className="text-white/60 text-lg">
                                {loading ? 'Loading...' : `Discover ${brands.length} brands • Exclusive discounts on all gift cards`}
                            </p>
                        </div>

                        {/* Clean Dropdown Filter */}
                        <div className="flex items-center gap-3">
                            <Filter className="w-4 h-4 text-white/50" />
                            <div className="relative">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    className="appearance-none bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-xl pl-4 pr-10 py-2.5 font-medium text-sm cursor-pointer focus:outline-none focus:border-accent-400/50 hover:bg-white/15 transition-all duration-200"
                                >
                                    {categories.map((category) => (
                                        <option
                                            key={category}
                                            value={category}
                                            className="bg-dark-100 text-white"
                                        >
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="w-4 h-4 text-white/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                                <div key={i} className="bg-white/5 rounded-2xl h-[240px] animate-pulse" />
                            ))}
                        </div>
                    ) : brands.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-white/60 text-lg">No brands found in this category.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {brands.map((brand) => {
                                // Calculate the highest discount from variants
                                const maxDiscount = Math.max(...brand.variants.map(v => v.discountPercent))

                                return (
                                    <Link
                                        key={brand.id}
                                        to={`/brand/${brand.id}`}
                                        className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer border border-white/10 hover:border-accent-400/50 shadow-xl shadow-black/20 hover:shadow-accent-400/30 hover:-translate-y-2 block"
                                    >
                                        {/* Discount Badge */}
                                        <div className="absolute top-3 right-3 z-20">
                                            <div className="bg-accent-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-lg shadow-accent-500/50 backdrop-blur-sm">
                                                {maxDiscount}% Off
                                            </div>
                                        </div>

                                        {/* Logo */}
                                        <div className="relative flex items-center justify-center h-[160px] overflow-hidden">
                                            <img
                                                src={brand.logo}
                                                alt={brand.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Brand Info */}
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
                    )}
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default AllBrands
