import { useState } from 'react'
import { Mail, Phone, Clock, Send } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Mock submission
        setSubmitted(true)
        setTimeout(() => {
            setSubmitted(false)
            setFormData({ name: '', email: '', subject: '', message: '' })
        }, 3000)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email Us',
            content: 'support@giftify.com',
            subContent: 'We reply within 24 hours',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Phone,
            title: 'Call Us',
            content: '+1 (800) 123-4567',
            subContent: 'Mon-Fri, 9 AM - 6 PM EST',
            color: 'from-green-500 to-emerald-500'
        }
    ]

    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Header Section */}
            <section className="pt-8 pb-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-dark-100/40 via-dark-200/30 to-dark-50/50 border-b border-white/10">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-display font-bold text-white mb-2">
                        Contact Us
                    </h1>
                    <p className="text-white/60">
                        We're here to help! Reach out to us anytime
                    </p>
                </div>
            </section>

            <div className="bg-dark-100 py-12 px-4">

                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-8 mb-12">
                        {/* Contact Info Cards */}
                        <div className="lg:col-span-1 space-y-4">
                            {contactInfo.map((info, index) => {
                                const Icon = info.icon
                                return (
                                    <div
                                        key={index}
                                        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-accent-500/50 transition-all"
                                    >
                                        <div className={`inline-block p-3 bg-gradient-to-br ${info.color} rounded-xl mb-3`}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-white font-bold text-lg mb-1">
                                            {info.title}
                                        </h3>
                                        <p className="text-accent-300 font-semibold mb-0.5">
                                            {info.content}
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            {info.subContent}
                                        </p>
                                    </div>
                                )
                            })}

                            {/* Business Hours */}
                            <div className="bg-gradient-to-br from-accent-500/10 to-pink-500/10 border border-accent-500/30 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Clock className="w-5 h-5 text-accent-400" />
                                    <h3 className="text-white font-bold text-lg">
                                        Business Hours
                                    </h3>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-300">
                                        <span>Monday - Friday</span>
                                        <span className="text-accent-300 font-semibold">9 AM - 6 PM</span>
                                    </div>
                                    <div className="flex justify-between text-gray-300">
                                        <span>Saturday</span>
                                        <span className="text-accent-300 font-semibold">10 AM - 4 PM</span>
                                    </div>
                                    <div className="flex justify-between text-gray-300">
                                        <span>Sunday</span>
                                        <span className="text-gray-400">Closed</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8">
                                <h2 className="text-2xl font-bold text-white mb-6">
                                    Send us a message
                                </h2>

                                {submitted ? (
                                    <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-6 text-center">
                                        <div className="inline-block p-3 bg-green-500/20 rounded-full mb-4">
                                            <Send className="w-6 h-6 text-green-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">
                                            Message Sent Successfully!
                                        </h3>
                                        <p className="text-gray-300">
                                            We've received your message and will get back to you within 24 hours.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-white font-medium mb-2">
                                                    Your Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-accent-500 focus:outline-none transition-colors"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-white font-medium mb-2">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-accent-500 focus:outline-none transition-colors"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-white font-medium mb-2">
                                                Subject
                                            </label>
                                            <select
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-accent-500 focus:outline-none transition-colors"
                                            >
                                                <option value="" className="bg-dark-100">Select a subject</option>
                                                <option value="general" className="bg-dark-100">General Inquiry</option>
                                                <option value="support" className="bg-dark-100">Technical Support</option>
                                                <option value="billing" className="bg-dark-100">Billing Issue</option>
                                                <option value="refund" className="bg-dark-100">Refund Request</option>
                                                <option value="partnership" className="bg-dark-100">Partnership</option>
                                                <option value="other" className="bg-dark-100">Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-white font-medium mb-2">
                                                Message
                                            </label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows={6}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-accent-500 focus:outline-none transition-colors resize-none"
                                                placeholder="Tell us how we can help you..."
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full px-8 py-4 bg-gradient-to-r from-accent-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-accent-500/50 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Send className="w-5 h-5" />
                                            Send Message
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* FAQ Link */}
                    <div className="bg-gradient-to-br from-accent-500/10 to-pink-500/10 border border-accent-500/30 rounded-2xl p-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-3">
                            Looking for quick answers?
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Check out our FAQ section for instant solutions to common questions
                        </p>
                        <a
                            href="/faq"
                            className="inline-block px-8 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
                        >
                            Visit FAQ
                        </a>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Contact

