import { Link } from 'react-router-dom'
import { Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="relative mt-20 border-t border-white/30">
            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-cta rounded-lg flex items-center justify-center shadow-glow-brand">
                                <span className="text-text-high font-bold text-xl">G</span>
                            </div>
                            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-pink via-primary-300 to-accent-blue">
                                Giftify
                            </span>
                        </div>
                        <p className="text-text-low text-body">
                            Your trusted platform for digital gift cards and vouchers. Shop from top brands and enjoy instant delivery.
                        </p>
                        {/* Social Links */}
                        <div className="flex space-x-3 pt-2">
                            <a href="#" className="w-9 h-9 bg-surface-hover hover:bg-panel border border-border rounded-lg flex items-center justify-center transition-all duration-200 hover:shadow-glow-brand">
                                <Facebook className="w-4 h-4 text-text-med" />
                            </a>
                            <a href="#" className="w-9 h-9 bg-surface-hover hover:bg-panel border border-border rounded-lg flex items-center justify-center transition-all duration-200 hover:shadow-glow-brand">
                                <Twitter className="w-4 h-4 text-text-med" />
                            </a>
                            <a href="#" className="w-9 h-9 bg-surface-hover hover:bg-panel border border-border rounded-lg flex items-center justify-center transition-all duration-200 hover:shadow-glow-brand">
                                <Instagram className="w-4 h-4 text-text-med" />
                            </a>
                            <a href="#" className="w-9 h-9 bg-surface-hover hover:bg-panel border border-border rounded-lg flex items-center justify-center transition-all duration-200 hover:shadow-glow-brand">
                                <Youtube className="w-4 h-4 text-text-med" />
                            </a>
                        </div>
                    </div>

                    {/* Support Section */}
                    <div className="space-y-4">
                        <h3 className="text-h3 text-text-high">Support</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/faq" className="text-body text-text-low hover:text-primary-300 transition-colors duration-200">
                                    Giftify FAQ
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-body text-text-low hover:text-primary-300 transition-colors duration-200">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <a href="mailto:support@giftify.com" className="flex items-center space-x-2 text-body text-text-low hover:text-primary-300 transition-colors duration-200">
                                    <Mail className="w-4 h-4" />
                                    <span>support@giftify.com</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Section */}
                    <div className="space-y-4">
                        <h3 className="text-h3 text-text-high">Legal</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/terms" className="text-body text-text-low hover:text-primary-300 transition-colors duration-200">
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-body text-text-low hover:text-primary-300 transition-colors duration-200">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/refund" className="text-body text-text-low hover:text-primary-300 transition-colors duration-200">
                                    Refund Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/cookies" className="text-body text-text-low hover:text-primary-300 transition-colors duration-200">
                                    Cookie Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company Section */}
                    <div className="space-y-4">
                        <h3 className="text-h3 text-text-high">Company</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/about" className="text-body text-text-low hover:text-primary-300 transition-colors duration-200">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/partners" className="text-body text-text-low hover:text-primary-300 transition-colors duration-200">
                                    Partners
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/30">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-caption text-text-low">
                            © 2024 Giftify. All rights reserved
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="px-3 py-2 bg-text-high rounded-lg hover:scale-105 transition-transform duration-200">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg"
                                    alt="Google Pay"
                                    className="h-5 w-auto"
                                />
                            </div>
                            <div className="px-3 py-2 bg-text-high rounded-lg hover:scale-105 transition-transform duration-200">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg"
                                    alt="PhonePe"
                                    className="h-5 w-auto"
                                />
                            </div>
                            <div className="px-3 py-2 bg-text-high rounded-lg hover:scale-105 transition-transform duration-200">
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

