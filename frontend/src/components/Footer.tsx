import { Link } from 'react-router-dom'
import { Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="relative mt-20 border-t border-white/10">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">G</span>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                                Giftify
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Your trusted platform for digital gift cards and vouchers. Shop from top brands and enjoy instant delivery.
                        </p>
                        {/* Social Links */}
                        <div className="flex space-x-3 pt-2">
                            <a href="#" className="w-9 h-9 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center transition-all hover:border-white/20">
                                <Facebook className="w-4 h-4 text-gray-400" />
                            </a>
                            <a href="#" className="w-9 h-9 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center transition-all hover:border-white/20">
                                <Twitter className="w-4 h-4 text-gray-400" />
                            </a>
                            <a href="#" className="w-9 h-9 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center transition-all hover:border-white/20">
                                <Instagram className="w-4 h-4 text-gray-400" />
                            </a>
                            <a href="#" className="w-9 h-9 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center transition-all hover:border-white/20">
                                <Youtube className="w-4 h-4 text-gray-400" />
                            </a>
                        </div>
                    </div>

                    {/* Support Section */}
                    <div className="space-y-4">
                        <h3 className="text-white font-semibold text-lg">Support</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Giftify FAQ
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <a href="mailto:support@giftify.com" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm">
                                    <Mail className="w-4 h-4" />
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
                                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/refund" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Refund Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Cookie Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company Section */}
                    <div className="space-y-4">
                        <h3 className="text-white font-semibold text-lg">Company</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/partners" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Partners
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-gray-400 text-sm">
                            © 2024 Giftify. All rights reserved
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="px-3 py-2 bg-white rounded-lg hover:scale-105 transition-transform">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg"
                                    alt="Google Pay"
                                    className="h-5 w-auto"
                                />
                            </div>
                            <div className="px-3 py-2 bg-white rounded-lg hover:scale-105 transition-transform">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg"
                                    alt="PhonePe"
                                    className="h-5 w-auto"
                                />
                            </div>
                            <div className="px-3 py-2 bg-white rounded-lg hover:scale-105 transition-transform">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg"
                                    alt="Paytm"
                                    className="h-5 w-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer

