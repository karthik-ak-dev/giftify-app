import { Search, Globe, ShoppingCart, User, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { brandsService } from '../services/brandsService'
import { Brand } from '../types/brand'

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<Brand[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const { totalItems, openCart } = useCart()
    const { isAuthenticated, isInitializing, openAuthSidebar } = useAuth()
    const navigate = useNavigate()

    // Search brands as user types
    useEffect(() => {
        const searchBrands = async () => {
            if (searchQuery.trim().length < 2) {
                setSearchResults([])
                setShowResults(false)
                return
            }

            setIsSearching(true)
            try {
                const allBrands = await brandsService.getAllBrands()
                const filtered = allBrands.filter(brand =>
                    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                setSearchResults(filtered.slice(0, 6)) // Limit to 6 results
                setShowResults(true)
            } catch (error) {
                console.error('Error searching brands:', error)
            } finally {
                setIsSearching(false)
            }
        }

        const debounceTimer = setTimeout(searchBrands, 300)
        return () => clearTimeout(debounceTimer)
    }, [searchQuery])

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleBrandClick = (brandId: string) => {
        setSearchQuery('')
        setShowResults(false)
        navigate(`/brand/${brandId}`)
    }

    const clearSearch = () => {
        setSearchQuery('')
        setSearchResults([])
        setShowResults(false)
    }

    return (
        <nav className="sticky top-0 z-50 glass-panel shadow-soft">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 px-4 py-2 cursor-pointer bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-400 shadow-elevated hover:shadow-glow-brand transition-all duration-200">
                        <div className="w-7 h-7 bg-white/30 flex items-center justify-center backdrop-blur-sm">
                            <span className="text-text-high font-black text-base">G</span>
                        </div>
                        <span className="text-text-high font-display font-bold text-xl tracking-tight">iftify</span>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-8">
                        <div ref={searchRef} className="relative w-full">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                            <input
                                type="text"
                                placeholder="Search a Brand"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                                className="w-full pl-12 pr-12 py-2.5 bg-white border-2 border-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-md rounded-lg"
                            />
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}

                            {/* Search Results Dropdown */}
                            {showResults && (
                                <div className="absolute top-full mt-2 w-full bg-gradient-to-b from-[#2A1260] to-[#1D0F45] border-2 border-purple-500/50 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {isSearching ? (
                                        <div className="p-6 text-center">
                                            <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                            <p className="text-white/60 text-sm mt-2">Searching...</p>
                                        </div>
                                    ) : searchResults.length > 0 ? (
                                        <div className="max-h-[400px] overflow-y-auto">
                                            {searchResults.map((brand) => {
                                                const maxDiscount = Math.max(...brand.variants.map(v => v.discountPercent))
                                                return (
                                                    <button
                                                        key={brand.id}
                                                        onClick={() => handleBrandClick(brand.id)}
                                                        className="w-full flex items-center gap-4 p-4 hover:bg-white/10 transition-all duration-200 border-b border-white/5 last:border-0 group"
                                                    >
                                                        <div className="w-16 h-16 flex-shrink-0">
                                                            <img
                                                                src={brand.logo}
                                                                alt={brand.name}
                                                                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
                                                            />
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="text-white font-bold group-hover:text-purple-300 transition-colors">
                                                                    {brand.name}
                                                                </h4>
                                                                <span className="px-1.5 py-0.5 bg-gradient-to-r from-orange-500 to-pink-500 rounded text-white text-xs font-black">
                                                                    {maxDiscount}% OFF
                                                                </span>
                                                            </div>
                                                            <p className="text-white/60 text-sm">{brand.category}</p>
                                                        </div>
                                                        <div className="px-2 py-1 bg-green-500/20 border border-green-400/30 rounded-full">
                                                            <span className="text-green-300 text-xs font-bold">
                                                                {brand.variants.length} Variants
                                                            </span>
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <div className="p-6 text-center">
                                            <p className="text-white/60">No brands found for "{searchQuery}"</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={openCart}
                            className="flex relative p-2.5 hover:scale-110 transition-all duration-200"
                        >
                            <ShoppingCart className="w-6 h-6 text-white" />
                            {totalItems > 0 && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-xs font-black shadow-elevated rounded-full">
                                    {totalItems}
                                </div>
                            )}
                        </button>

                        {isInitializing ? (
                            <div className="flex items-center space-x-2 p-2.5">
                                <div className="w-8 h-8 bg-white/90 flex items-center justify-center opacity-50">
                                    <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            </div>
                        ) : isAuthenticated ? (
                            <button
                                onClick={() => navigate('/account')}
                                className="group relative flex items-center p-2.5 hover:scale-110 transition-all duration-200"
                            >
                                <User className="w-6 h-6 text-white" />
                            </button>
                        ) : (
                            <button
                                onClick={openAuthSidebar}
                                className="btn-login flex items-center space-x-2 px-4 sm:px-6 py-2.5 font-semibold"
                            >
                                <span className="hidden sm:inline">LOGIN</span>
                                <User className="w-5 h-5 sm:hidden" />
                            </button>
                        )}

                        <button className="hidden md:flex items-center space-x-2 px-3 py-2 bg-white/95 hover:bg-white transition-all duration-200 border border-white shadow-md rounded-full">
                            <Globe className="w-5 h-5 text-purple-600" />
                            <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-5 h-4 rounded-md" />
                        </button>
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="md:hidden pb-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                        <input
                            type="text"
                            placeholder="Search a Brand"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                            className="w-full pl-12 pr-12 py-3 bg-white border-2 border-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-md rounded-lg"
                        />
                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}

                        {/* Mobile Search Results Dropdown */}
                        {showResults && (
                            <div className="absolute top-full mt-2 left-0 right-0 bg-gradient-to-b from-[#2A1260] to-[#1D0F45] border-2 border-purple-500/50 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                {isSearching ? (
                                    <div className="p-6 text-center">
                                        <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                        <p className="text-white/60 text-sm mt-2">Searching...</p>
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <div className="max-h-[300px] overflow-y-auto">
                                        {searchResults.map((brand) => {
                                            const maxDiscount = Math.max(...brand.variants.map(v => v.discountPercent))
                                            return (
                                                <button
                                                    key={brand.id}
                                                    onClick={() => handleBrandClick(brand.id)}
                                                    className="w-full flex items-center gap-3 p-3 hover:bg-white/10 transition-all duration-200 border-b border-white/5 last:border-0 group"
                                                >
                                                    <div className="w-14 h-14 flex-shrink-0">
                                                        <img
                                                            src={brand.logo}
                                                            alt={brand.name}
                                                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
                                                        />
                                                    </div>
                                                    <div className="flex-1 text-left min-w-0">
                                                        <div className="flex items-center gap-1.5 mb-0.5">
                                                            <h4 className="text-white font-bold text-sm group-hover:text-purple-300 transition-colors truncate">
                                                                {brand.name}
                                                            </h4>
                                                            <span className="px-1.5 py-0.5 bg-gradient-to-r from-orange-500 to-pink-500 rounded text-white text-[10px] font-black flex-shrink-0">
                                                                {maxDiscount}% OFF
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-white/60 text-xs truncate">{brand.category}</p>
                                                            <span className="text-white/40">•</span>
                                                            <p className="text-green-300 text-xs font-bold flex-shrink-0">{brand.variants.length} Variants</p>
                                                        </div>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-4 text-center">
                                        <p className="text-white/60 text-sm">No brands found for "{searchQuery}"</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar

