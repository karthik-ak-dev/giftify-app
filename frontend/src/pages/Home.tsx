import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import VoucherCard from '../components/VoucherCard';
import { vouchers } from '../data/vouchers';

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', ...new Set(vouchers.map((v) => v.category))];

    const filteredVouchers = vouchers.filter((voucher) => {
        const matchesSearch =
            voucher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            voucher.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === 'All' || voucher.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative mb-16 overflow-hidden"
                >
                    {/* Background Decorative Elements */}
                    <div className="absolute inset-0 -z-10">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 90, 0],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute top-0 right-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"
                        />
                        <motion.div
                            animate={{
                                scale: [1.2, 1, 1.2],
                                rotate: [90, 0, 90],
                            }}
                            transition={{
                                duration: 15,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"
                        />
                    </div>

                    {/* Main Hero Content */}
                    <div className="text-center py-12 sm:py-16">
                        {/* Floating Icons */}
                        <div className="relative mb-6">
                            <motion.div
                                animate={{
                                    y: [0, -10, 0],
                                    rotate: [0, 5, 0],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute left-1/4 -top-4 text-4xl opacity-50"
                            >
                                🎁
                            </motion.div>
                            <motion.div
                                animate={{
                                    y: [0, -15, 0],
                                    rotate: [0, -5, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 0.5
                                }}
                                className="absolute right-1/4 -top-2 text-4xl opacity-50"
                            >
                                ✨
                            </motion.div>
                        </div>

                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
                            </span>
                            <span className="text-sm font-medium text-dark-200">
                                12+ Popular Brands Available
                            </span>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
                        >
                            <span className="block bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent">
                                Gift Smarter,
                            </span>
                            <span className="block text-white mt-2">
                                Not Harder
                            </span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg sm:text-xl text-dark-300 max-w-2xl mx-auto mb-8 leading-relaxed"
                        >
                            Discover the perfect digital voucher for every occasion.
                            <span className="text-primary-400 font-semibold"> Instant delivery</span>,
                            <span className="text-accent-400 font-semibold"> zero hassle</span>.
                        </motion.p>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-wrap items-center justify-center gap-6 sm:gap-8"
                        >
                            <div className="glass px-6 py-3 rounded-2xl">
                                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                                    12+
                                </div>
                                <div className="text-xs sm:text-sm text-dark-400">Brands</div>
                            </div>
                            <div className="glass px-6 py-3 rounded-2xl">
                                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                                    40+
                                </div>
                                <div className="text-xs sm:text-sm text-dark-400">Vouchers</div>
                            </div>
                            <div className="glass px-6 py-3 rounded-2xl">
                                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent mb-1">
                                    ⚡
                                </div>
                                <div className="text-xs sm:text-sm text-dark-400">Instant</div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Search and Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 space-y-4"
                >
                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                        <input
                            type="text"
                            placeholder="Search vouchers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 glass rounded-2xl text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        />
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-2 justify-center">
                        {categories.map((category) => (
                            <motion.button
                                key={category}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-xl font-medium transition-all ${selectedCategory === category
                                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/50'
                                    : 'glass text-dark-300 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {category}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Voucher Grid */}
                {filteredVouchers.length > 0 ? (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filteredVouchers.map((voucher, index) => (
                            <motion.div
                                key={voucher.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <VoucherCard voucher={voucher} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-xl font-medium text-white mb-2">No vouchers found</p>
                        <p className="text-dark-400">Try adjusting your search or filters</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Home;

