import { Shield, Eye, Lock, Database, UserCheck, Globe } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Privacy = () => {
    const highlights = [
        {
            icon: Lock,
            title: 'Secure Storage',
            description: 'Your data is encrypted and stored securely',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Eye,
            title: 'No Selling',
            description: 'We never sell your personal information',
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: UserCheck,
            title: 'Your Control',
            description: 'You control your data and privacy settings',
            color: 'from-purple-500 to-pink-500'
        }
    ]

    const sections = [
        {
            icon: Database,
            title: '1. Information We Collect',
            content: [
                'Personal Information: Name, email address, phone number, and billing address provided during account registration and checkout.',
                'Payment Information: Credit card details and payment information processed through secure third-party payment processors.',
                'Usage Data: Information about how you use our website, including IP address, browser type, device information, and pages visited.',
                'Communication Data: Records of your interactions with our customer support team and any feedback you provide.',
                'Transaction History: Details of gift cards purchased, redemption status, and order history.'
            ]
        },
        {
            icon: Shield,
            title: '2. How We Use Your Information',
            content: [
                'To process your transactions and deliver digital gift cards to you.',
                'To manage your account and provide customer support.',
                'To send order confirmations, receipts, and important service updates.',
                'To improve our services, website functionality, and user experience.',
                'To detect and prevent fraud, security breaches, and illegal activities.',
                'To comply with legal obligations and enforce our Terms and Conditions.',
                'To send promotional emails (only with your consent, which you can withdraw anytime).'
            ]
        },
        {
            icon: Globe,
            title: '3. Information Sharing and Disclosure',
            content: [
                'Service Providers: We share information with trusted third-party service providers who assist us in operating our website, processing payments, and delivering services.',
                'Brand Partners: Necessary information is shared with gift card issuers to fulfill your orders.',
                'Legal Requirements: We may disclose information when required by law, court order, or government request.',
                'Business Transfers: In the event of a merger, acquisition, or sale, your information may be transferred to the new owner.',
                'Consent: We may share information with your explicit consent for specific purposes.',
                'We do not sell, rent, or trade your personal information to third parties for marketing purposes.'
            ]
        },
        {
            icon: Lock,
            title: '4. Data Security',
            content: [
                'We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.',
                'All payment transactions are processed through PCI-DSS compliant payment gateways with SSL encryption.',
                'We use secure servers, firewalls, and encryption protocols to safeguard your data.',
                'Regular security audits and vulnerability assessments are conducted to maintain high security standards.',
                'Despite our efforts, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.',
                'You are responsible for maintaining the confidentiality of your account credentials.'
            ]
        },
        {
            icon: UserCheck,
            title: '5. Your Privacy Rights',
            content: [
                'Access: You can request access to the personal information we hold about you.',
                'Correction: You can update or correct your personal information through your account settings.',
                'Deletion: You can request deletion of your account and personal data, subject to legal retention requirements.',
                'Opt-Out: You can unsubscribe from marketing emails at any time using the link in the email.',
                'Data Portability: You can request a copy of your data in a structured, machine-readable format.',
                'Objection: You can object to certain data processing activities.',
                'To exercise these rights, contact us at privacy@giftify.com.'
            ]
        },
        {
            icon: Database,
            title: '6. Cookies and Tracking Technologies',
            content: [
                'We use cookies and similar technologies to enhance your browsing experience, remember your preferences, and analyze website traffic.',
                'Essential Cookies: Required for website functionality and security.',
                'Analytics Cookies: Help us understand how visitors interact with our website.',
                'Marketing Cookies: Used to deliver relevant advertisements (with your consent).',
                'You can control cookie preferences through your browser settings, but disabling certain cookies may affect website functionality.',
                'For more details, please refer to our Cookie Policy.'
            ]
        },
        {
            icon: Globe,
            title: '7. Third-Party Links',
            content: [
                'Our website may contain links to third-party websites and services, including brand websites where you redeem gift cards.',
                'We are not responsible for the privacy practices of these third-party sites.',
                'We encourage you to read the privacy policies of any third-party sites you visit.',
                'This Privacy Policy applies only to information collected by Giftify.'
            ]
        },
        {
            icon: Shield,
            title: '8. Children\'s Privacy',
            content: [
                'Our services are not intended for individuals under the age of 18.',
                'We do not knowingly collect personal information from children under 18.',
                'If we discover that we have collected information from a child under 18, we will promptly delete it.',
                'If you believe we have collected information from a child, please contact us immediately.'
            ]
        },
        {
            icon: Database,
            title: '9. Data Retention',
            content: [
                'We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy.',
                'Transaction records are retained for accounting, tax, and legal compliance purposes.',
                'If you request account deletion, we will delete or anonymize your information, except where retention is required by law.',
                'Backup copies may persist in our systems for a limited time after deletion.'
            ]
        },
        {
            icon: Globe,
            title: '10. International Data Transfers',
            content: [
                'Your information may be transferred to and processed in countries other than your country of residence.',
                'We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.',
                'By using our services, you consent to the transfer of your information to the United States and other countries.'
            ]
        },
        {
            icon: Shield,
            title: '11. Changes to This Privacy Policy',
            content: [
                'We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.',
                'The "Last Updated" date at the top of this page indicates when the policy was last revised.',
                'We will notify you of significant changes via email or through a prominent notice on our website.',
                'Your continued use of our services after changes are posted constitutes acceptance of the updated Privacy Policy.'
            ]
        },
        {
            icon: UserCheck,
            title: '12. Contact Us',
            content: [
                'If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:',
                'Email: privacy@giftify.com',
                'Support: support@giftify.com',
                'Address: 123 Gift Street, Suite 456, San Francisco, CA 94102',
                'We will respond to your inquiry within 30 days.'
            ]
        }
    ]

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="bg-dark-100 py-12 px-4">
                {/* Header */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="inline-block p-3 bg-gradient-to-br from-accent-500 to-pink-500 rounded-2xl mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-400 text-lg mb-2">
                        Last updated: October 19, 2025
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                        At Giftify, we take your privacy seriously. This Privacy Policy explains how we collect, use, protect, and share your personal information when you use our services.
                    </p>
                </div>

                {/* Privacy Highlights */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="grid md:grid-cols-3 gap-4">
                        {highlights.map((highlight, index) => {
                            const Icon = highlight.icon
                            return (
                                <div
                                    key={index}
                                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 text-center"
                                >
                                    <div className={`inline-block p-3 bg-gradient-to-br ${highlight.color} rounded-xl mb-3`}>
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-white font-bold mb-1">
                                        {highlight.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                        {highlight.description}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Privacy Sections */}
                <div className="max-w-4xl mx-auto space-y-8">
                    {sections.map((section, index) => {
                        const Icon = section.icon
                        return (
                            <div
                                key={index}
                                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-accent-500/30 transition-all"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="p-2 bg-accent-500/20 rounded-lg flex-shrink-0">
                                        <Icon className="w-5 h-5 text-accent-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">
                                        {section.title}
                                    </h2>
                                </div>
                                <ul className="space-y-3">
                                    {section.content.map((item, itemIndex) => (
                                        <li key={itemIndex} className="flex items-start gap-3 text-gray-300">
                                            <span className="text-accent-400 mt-1.5 flex-shrink-0">•</span>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    })}
                </div>

                {/* Footer CTA */}
                <div className="max-w-4xl mx-auto mt-12">
                    <div className="bg-gradient-to-br from-accent-500/10 to-pink-500/10 border border-accent-500/30 rounded-2xl p-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-3">
                            Questions about your privacy?
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Contact our privacy team for any concerns
                        </p>
                        <a
                            href="mailto:privacy@giftify.com"
                            className="inline-block px-8 py-3 bg-gradient-to-r from-accent-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-accent-500/50 transition-all"
                        >
                            Email Privacy Team
                        </a>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Privacy

