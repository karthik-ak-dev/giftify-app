import { Search, Globe, ShoppingCart, User } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const { totalItems, openCart } = useCart()
    const { isAuthenticated, isInitializing, openAuthSidebar } = useAuth()
    const navigate = useNavigate()

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
                        <div className="relative w-full">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search a Brand"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-2.5 bg-white border-2 border-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-md"
                            />
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={openCart}
                            className="flex relative p-2.5 bg-white/95 hover:bg-white transition-all duration-200 border border-white shadow-md"
                        >
                            <ShoppingCart className="w-5 h-5 text-purple-600" />
                            {totalItems > 0 && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-xs font-black shadow-elevated">
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
                                className="group relative flex items-center space-x-2 p-2.5 bg-white/95 hover:bg-white transition-all duration-200 shadow-md"
                            >
                                <div className="w-8 h-8 bg-gradient-cta flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
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
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search a Brand"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-md"
                        />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar

