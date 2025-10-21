import { Link } from 'react-router-dom'
import { Mail, Facebook, Twitter, Instagram, Youtube, Heart } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="relative mt-20 bg-gradient-to-br from-neutral-900 to-neutral-950 border-t border-neutral-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2.5">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-elegant-md">
                                <span className="text-white font-bold text-xl">G</span>
                            </div>
                            <span className="text-2xl font-display font-bold gradient-text">
                                Giftify
                            </span>
                        </div>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            Your trusted platform for digital gift cards and vouchers. Shop from top brands and enjoy instant delivery.
                        </p>
                        {/* Social Links */}
                        <div className="flex space-x-3 pt-2">
                            <a href="#" className="w-10 h-10 bg-neutral-800 hover:bg-primary-600 border border-neutral-700 hover:border-primary-500 rounded-xl flex items-center justify-center transition-all duration-300 group">
                                <Facebook className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-neutral-800 hover:bg-primary-600 border border-neutral-700 hover:border-primary-500 rounded-xl flex items-center justify-center transition-all duration-300 group">
                                <Twitter className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-neutral-800 hover:bg-primary-600 border border-neutral-700 hover:border-primary-500 rounded-xl flex items-center justify-center transition-all duration-300 group">
                                <Instagram className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-neutral-800 hover:bg-primary-600 border border-neutral-700 hover:border-primary-500 rounded-xl flex items-center justify-center transition-all duration-300 group">
                                <Youtube className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                            </a>
                        </div>
                    </div>

                    {/* Support Section */}
                    <div className="space-y-4">
                        <h3 className="text-white font-semibold text-lg">Support</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/faq" className="text-neutral-400 hover:text-primary-400 transition-colors text-sm inline-flex items-center group">
                                    <span className="relative">
                                        Giftify FAQ
                                        <span className="absolute bottom-0 left-0 w-0 h-px bg-primary-400 group-hover:w-full transition-all duration-300" />
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-neutral-400 hover:text-primary-400 transition-colors text-sm inline-flex items-center group">
                                    <span className="relative">
                                        Contact Us
                                        <span className="absolute bottom-0 left-0 w-0 h-px bg-primary-400 group-hover:w-full transition-all duration-300" />
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <a href="mailto:support@giftify.com" className="flex items-center space-x-2 text-neutral-400 hover:text-primary-400 transition-colors text-sm group">
                                    <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span>support@giftify.com</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Section */}
                    <div className="space-y-4">
                        <h3 className="text-white font-semibold text-lg">Legal</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/terms" className="text-neutral-400 hover:text-primary-400 transition-colors text-sm inline-flex items-center group">
                                    <span className="relative">
                                        Terms & Conditions
                                        <span className="absolute bottom-0 left-0 w-0 h-px bg-primary-400 group-hover:w-full transition-all duration-300" />
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-neutral-400 hover:text-primary-400 transition-colors text-sm inline-flex items-center group">
                                    <span className="relative">
                                        Privacy Policy
                                        <span className="absolute bottom-0 left-0 w-0 h-px bg-primary-400 group-hover:w-full transition-all duration-300" />
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/refund" className="text-neutral-400 hover:text-primary-400 transition-colors text-sm inline-flex items-center group">
                                    <span className="relative">
                                        Refund Policy
                                        <span className="absolute bottom-0 left-0 w-0 h-px bg-primary-400 group-hover:w-full transition-all duration-300" />
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/cookies" className="text-neutral-400 hover:text-primary-400 transition-colors text-sm inline-flex items-center group">
                                    <span className="relative">
                                        Cookie Policy
                                        <span className="absolute bottom-0 left-0 w-0 h-px bg-primary-400 group-hover:w-full transition-all duration-300" />
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company Section */}
                    <div className="space-y-4">
                        <h3 className="text-white font-semibold text-lg">Company</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/about" className="text-neutral-400 hover:text-primary-400 transition-colors text-sm inline-flex items-center group">
                                    <span className="relative">
                                        About Us
                                        <span className="absolute bottom-0 left-0 w-0 h-px bg-primary-400 group-hover:w-full transition-all duration-300" />
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/partners" className="text-neutral-400 hover:text-primary-400 transition-colors text-sm inline-flex items-center group">
                                    <span className="relative">
                                        Partner With Us
                                        <span className="absolute bottom-0 left-0 w-0 h-px bg-primary-400 group-hover:w-full transition-all duration-300" />
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/brands" className="text-neutral-400 hover:text-primary-400 transition-colors text-sm inline-flex items-center group">
                                    <span className="relative">
                                        All Brands
                                        <span className="absolute bottom-0 left-0 w-0 h-px bg-primary-400 group-hover:w-full transition-all duration-300" />
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 mt-8 border-t border-neutral-800">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-neutral-500 text-sm text-center md:text-left">
                            © {new Date().getFullYear()} Giftify. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-neutral-500">
                            <span>Made with</span>
                            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
                            <span>in India</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
