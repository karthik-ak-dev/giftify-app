import { Settings, Eye, BarChart3, Target, Shield } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Cookies = () => {
    const cookieTypes = [
        {
            icon: Shield,
            title: 'Essential Cookies',
            color: 'from-blue-500 to-cyan-500',
            status: 'Always Active',
            description: 'These cookies are necessary for the website to function and cannot be disabled. They enable core functionality such as security, network management, and accessibility.',
            examples: [
                'User authentication and session management',
                'Shopping cart functionality',
                'Security and fraud prevention',
                'Load balancing and website performance',
                'Cookie consent preferences'
            ]
        },
        {
            icon: BarChart3,
            title: 'Analytics Cookies',
            color: 'from-green-500 to-emerald-500',
            status: 'Optional',
            description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
            examples: [
                'Number of website visitors',
                'Pages visited and time spent',
                'Traffic sources and referrals',
                'Device and browser information',
                'Error tracking and debugging'
            ]
        },
        {
            icon: Target,
            title: 'Marketing Cookies',
            color: 'from-purple-500 to-pink-500',
            status: 'Optional',
            description: 'These cookies track your browsing habits to deliver advertisements relevant to you and your interests.',
            examples: [
                'Personalized advertisements',
                'Social media integration',
                'Retargeting campaigns',
                'Advertisement effectiveness tracking',
                'Third-party advertising networks'
            ]
        },
        {
            icon: Settings,
            title: 'Functional Cookies',
            color: 'from-orange-500 to-red-500',
            status: 'Optional',
            description: 'These cookies enable enhanced functionality and personalization such as videos, live chat, and remembering your preferences.',
            examples: [
                'Language preferences',
                'Region selection',
                'User interface customization',
                'Video player settings',
                'Live chat functionality'
            ]
        }
    ]

    return (
        <div className="min-h-screen">
            <Navbar />
            
            {/* Header Section */}
            <section className="pt-8 pb-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-dark-100/40 via-dark-200/30 to-dark-50/50 border-b border-white/10">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-display font-bold text-white mb-2">
                        Cookie Policy
                    </h1>
                    <p className="text-white/60">
                        Last updated: October 19, 2025 • Learn about how we use cookies
                    </p>
                </div>
            </section>

            <div className="bg-dark-100 py-12 px-4">
                <div className="max-w-4xl mx-auto mb-12">
                    <p className="text-gray-300 leading-relaxed">
                        This Cookie Policy explains how Giftify uses cookies and similar tracking technologies on our website. By using our website, you consent to the use of cookies as described in this policy.
                    </p>
                </div>

                {/* What Are Cookies */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-2 bg-accent-500/20 rounded-lg">
                                <Eye className="w-5 h-5 text-accent-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-3">
                                    What Are Cookies?
                                </h2>
                                <p className="text-gray-300 leading-relaxed mb-4">
                                    Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and provide information to website owners.
                                </p>
                                <p className="text-gray-300 leading-relaxed">
                                    Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your device after you close your browser, while session cookies are deleted when you close your browser.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Types of Cookies */}
                <div className="max-w-4xl mx-auto mb-12">
                    <h2 className="text-2xl font-bold text-white mb-8 text-center">
                        Types of Cookies We Use
                    </h2>
                    <div className="space-y-6">
                        {cookieTypes.map((type, index) => {
                            const Icon = type.icon
                            return (
                                <div
                                    key={index}
                                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-accent-500/50 transition-all"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={`p-3 bg-gradient-to-br ${type.color} rounded-xl flex-shrink-0`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-xl font-bold text-white">
                                                    {type.title}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${type.status === 'Always Active'
                                                    ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                                                    : 'bg-blue-500/20 text-blue-400 border border-blue-400/30'
                                                    }`}>
                                                    {type.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-300 mb-4">
                                                {type.description}
                                            </p>
                                            <div>
                                                <p className="text-white font-semibold mb-2 text-sm">Examples:</p>
                                                <ul className="space-y-1.5">
                                                    {type.examples.map((example, exampleIndex) => (
                                                        <li key={exampleIndex} className="flex items-start gap-2 text-gray-400 text-sm">
                                                            <span className="text-accent-400 mt-1">•</span>
                                                            <span>{example}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Third-Party Cookies */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">
                            Third-Party Cookies
                        </h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                In addition to our own cookies, we may use various third-party cookies to report usage statistics, deliver advertisements, and provide enhanced functionality.
                            </p>
                            <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                                <p className="font-semibold text-white mb-2">Third-party services we use:</p>
                                <ul className="space-y-2 ml-4">
                                    <li className="flex items-start gap-2">
                                        <span className="text-accent-400 mt-1">•</span>
                                        <span><strong className="text-white">Google Analytics:</strong> Website traffic analysis and user behavior tracking</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-accent-400 mt-1">•</span>
                                        <span><strong className="text-white">Facebook Pixel:</strong> Social media advertising and conversion tracking</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-accent-400 mt-1">•</span>
                                        <span><strong className="text-white">Payment Processors:</strong> Secure payment processing and fraud prevention</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-accent-400 mt-1">•</span>
                                        <span><strong className="text-white">Customer Support Tools:</strong> Live chat and help desk functionality</span>
                                    </li>
                                </ul>
                            </div>
                            <p>
                                These third-party services have their own privacy policies and cookie policies. We encourage you to review their policies to understand how they use cookies.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Managing Cookies */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-2 bg-accent-500/20 rounded-lg">
                                <Settings className="w-5 h-5 text-accent-400" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-white mb-4">
                                    Managing Your Cookie Preferences
                                </h2>
                                <div className="space-y-4 text-gray-300">
                                    <p>
                                        You have several options to manage or disable cookies:
                                    </p>

                                    <div>
                                        <p className="font-semibold text-white mb-2">Browser Settings:</p>
                                        <p className="mb-2">Most web browsers allow you to control cookies through their settings:</p>
                                        <ul className="space-y-2 ml-4">
                                            <li className="flex items-start gap-2">
                                                <span className="text-accent-400 mt-1">•</span>
                                                <span><strong className="text-white">Chrome:</strong> Settings → Privacy and security → Cookies and other site data</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-accent-400 mt-1">•</span>
                                                <span><strong className="text-white">Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-accent-400 mt-1">•</span>
                                                <span><strong className="text-white">Safari:</strong> Preferences → Privacy → Cookies and website data</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-accent-400 mt-1">•</span>
                                                <span><strong className="text-white">Edge:</strong> Settings → Privacy, search, and services → Cookies</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="bg-amber-500/10 border border-amber-400/30 rounded-lg p-4">
                                        <p className="text-amber-300 font-semibold mb-2">⚠️ Important Note:</p>
                                        <p className="text-amber-200/90 text-sm">
                                            Disabling certain cookies may affect website functionality. Essential cookies are required for the website to work properly and cannot be disabled without affecting core features like login, shopping cart, and checkout.
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-semibold text-white mb-2">Third-Party Opt-Out:</p>
                                        <p className="mb-2">You can opt out of third-party advertising cookies through:</p>
                                        <ul className="space-y-2 ml-4">
                                            <li className="flex items-start gap-2">
                                                <span className="text-accent-400 mt-1">•</span>
                                                <span>Digital Advertising Alliance: <a href="http://optout.aboutads.info" className="text-accent-400 hover:text-accent-300">optout.aboutads.info</a></span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-accent-400 mt-1">•</span>
                                                <span>Network Advertising Initiative: <a href="http://optout.networkadvertising.org" className="text-accent-400 hover:text-accent-300">optout.networkadvertising.org</a></span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-accent-400 mt-1">•</span>
                                                <span>Google Ads Settings: <a href="https://adssettings.google.com" className="text-accent-400 hover:text-accent-300">adssettings.google.com</a></span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cookie Duration */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">
                            Cookie Duration
                        </h2>
                        <div className="space-y-3 text-gray-300">
                            <p>Cookies have different lifespans depending on their purpose:</p>
                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                                <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                                    <p className="font-semibold text-white mb-2">Session Cookies</p>
                                    <p className="text-sm">Temporary cookies that expire when you close your browser. Used for shopping cart and login session management.</p>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                                    <p className="font-semibold text-white mb-2">Persistent Cookies</p>
                                    <p className="text-sm">Remain on your device for a set period (typically 30 days to 2 years). Used for preferences and analytics.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Updates to Policy */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">
                            Updates to This Cookie Policy
                        </h2>
                        <div className="space-y-3 text-gray-300">
                            <p>
                                We may update this Cookie Policy from time to time to reflect changes in technology, legislation, our operations, or for other operational, legal, or regulatory reasons.
                            </p>
                            <p>
                                The "Last Updated" date at the top of this page indicates when this policy was last revised. We encourage you to review this Cookie Policy periodically to stay informed about our use of cookies.
                            </p>
                            <p>
                                Continued use of our website after changes to this Cookie Policy constitutes your acceptance of the updated policy.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">
                            Questions About Cookies?
                        </h2>
                        <div className="space-y-3 text-gray-300">
                            <p>
                                If you have questions about our use of cookies or this Cookie Policy, please contact us:
                            </p>
                            <ul className="space-y-2 ml-4">
                                <li className="flex items-start gap-2">
                                    <span className="text-accent-400 mt-1">•</span>
                                    <span>Email: privacy@giftify.com</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent-400 mt-1">•</span>
                                    <span>Support: support@giftify.com</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent-400 mt-1">•</span>
                                    <span>Phone: +1 (800) 123-4567</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Related Policies */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-br from-accent-500/10 to-pink-500/10 border border-accent-500/30 rounded-2xl p-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-3">
                            Related Policies
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Learn more about how we protect your data
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a
                                href="/privacy"
                                className="px-6 py-2.5 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="/terms"
                                className="px-6 py-2.5 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
                            >
                                Terms & Conditions
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Cookies

