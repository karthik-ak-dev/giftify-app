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
        <nav className="sticky top-0 z-50 glass-effect shadow-elegant-lg animate-slide-down">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center space-x-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 shadow-elegant-md hover:shadow-elegant-lg elegant-button group"
                    >
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                            <span className="text-white font-black text-lg">G</span>
                        </div>
                        <span className="text-white font-display font-bold text-xl tracking-tight">iftify</span>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by Brand or Category"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-elegant hover:shadow-elegant-md"
                            />
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={openCart}
                            className="flex relative p-2.5 hover:bg-primary-50 rounded-xl transition-all duration-300 group"
                        >
                            <ShoppingCart className="w-5 h-5 text-neutral-700 group-hover:text-primary-600 transition-colors" />
                            {totalItems > 0 && (
                                <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-elegant-md animate-scale-in">
                                    {totalItems}
                                </div>
                            )}
                        </button>

                        {isInitializing ? (
                            // Loading state
                            <div className="flex items-center space-x-2 p-2.5 rounded-xl">
                                <div className="w-9 h-9 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center border-2 border-primary-200">
                                    <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            </div>
                        ) : isAuthenticated ? (
                            <button
                                onClick={() => navigate('/account')}
                                className="group relative flex items-center space-x-2 p-2 hover:bg-primary-50 rounded-xl transition-all duration-300"
                            >
                                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-elegant hover:shadow-elegant-md group-hover:scale-105 transition-all">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                            </button>
                        ) : (
                            <button
                                onClick={openAuthSidebar}
                                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:from-primary-700 hover:to-primary-600 elegant-button font-semibold shadow-elegant-md hover:shadow-elegant-lg"
                            >
                                <span className="hidden sm:inline">Login</span>
                                <User className="w-5 h-5 sm:ml-1" />
                            </button>
                        )}

                        <button className="hidden md:flex items-center space-x-2 px-3 py-2 hover:bg-primary-50 rounded-xl transition-all duration-300 group">
                            <Globe className="w-5 h-5 text-neutral-700 group-hover:text-primary-600 transition-colors" />
                            <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-5 h-4 rounded shadow-elegant" />
                        </button>
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="md:hidden pb-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search by Brand or Category"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-elegant"
                        />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
