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
        <nav className="sticky top-0 z-50 bg-dark-50/90 backdrop-blur-xl border-b border-white/10 shadow-xl shadow-black/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 bg-gradient-to-r from-accent-500 to-accent-600 px-4 py-2 rounded-xl shadow-lg shadow-accent-500/40 hover:from-accent-600 hover:to-accent-700 transition-all duration-300 cursor-pointer">
                        <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                            <span className="text-white font-black text-base">G</span>
                        </div>
                        <span className="text-white font-display font-bold text-xl tracking-tight">iftify</span>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by Brand or Category"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-2.5 bg-dark-100/40 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition-all"
                            />
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={openCart}
                            className="flex relative p-2.5 hover:bg-white/5 rounded-xl transition-colors"
                        >
                            <ShoppingCart className="w-5 h-5 text-white" />
                            {totalItems > 0 && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-accent-500/50">
                                    {totalItems}
                                </div>
                            )}
                        </button>

                        {isInitializing ? (
                            // Show loading state while checking auth
                            <div className="w-[88px] h-[42px] flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : isAuthenticated ? (
                            <button
                                onClick={() => navigate('/account')}
                                className="group relative flex items-center space-x-2 p-2.5 hover:bg-white/5 rounded-xl transition-all duration-300"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-accent-500 via-accent-600 to-accent-700 rounded-full flex items-center justify-center ring-2 ring-accent-400/30 group-hover:ring-accent-400/50 transition-all">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                            </button>
                        ) : (
                            <button
                                onClick={openAuthSidebar}
                                className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-xl hover:from-accent-600 hover:to-accent-700 transition-all duration-300 font-semibold shadow-lg shadow-accent-500/60 hover:scale-105"
                            >
                                <span className="hidden sm:inline">LOGIN</span>
                                <User className="w-5 h-5 sm:hidden" />
                            </button>
                        )}

                        <button className="hidden md:flex items-center space-x-2 px-3 py-2 hover:bg-white/5 rounded-xl transition-colors">
                            <Globe className="w-5 h-5 text-white" />
                            <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-5 h-4 rounded" />
                        </button>
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="md:hidden pb-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by Brand or Category"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-dark-100/40 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-accent-400"
                        />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar

