import { useNavigate } from 'react-router-dom'

// Custom SVG Illustrations - GenZ Style
const CategoryIllustrations = {
    payments: (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Large central wallet */}
            <rect x="25" y="35" width="50" height="40" rx="10" fill="#84CC16" />
            <rect x="27" y="37" width="46" height="36" rx="8" fill="#A3E635" />
            <rect x="25" y="35" width="50" height="12" rx="8" fill="#65A30D" />
            {/* Dollar sign on wallet */}
            <path d="M 50 52 L 50 48 M 50 68 L 50 64 M 46 50 Q 46 48 48 48 L 52 48 Q 54 48 54 50 Q 54 52 52 52 L 48 52 M 48 52 L 52 52 Q 54 52 54 54 Q 54 56 52 56 L 48 56 Q 46 56 46 58" stroke="#FEF3C7" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Floating coins around */}
            <circle cx="15" cy="25" r="8" fill="#FCD34D" />
            <circle cx="15" cy="25" r="6" fill="#FBBF24" />
            <circle cx="85" cy="30" r="10" fill="#FCD34D" />
            <circle cx="85" cy="30" r="7" fill="#FBBF24" />
            <circle cx="20" cy="70" r="7" fill="#FCA5A5" />
            <circle cx="80" cy="75" r="9" fill="#93C5FD" />
            {/* Sparkles */}
            <circle cx="10" cy="50" r="3" fill="#FEF3C7" />
            <circle cx="90" cy="55" r="2.5" fill="#FEF3C7" />
        </svg>
    ),
    shopping: (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Large central shopping cart */}
            <circle cx="50" cy="48" r="28" fill="#84CC16" />
            <circle cx="50" cy="48" r="25" fill="#A3E635" />
            {/* Cart icon on circle */}
            <path d="M 38 40 L 40 40 L 44 56 L 58 56 M 44 56 L 46 60 L 56 60 L 58 56 L 60 48 L 42 48 Z" stroke="#FEF3C7" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="48" cy="64" r="2" fill="#FEF3C7" />
            <circle cx="54" cy="64" r="2" fill="#FEF3C7" />
            {/* Floating shopping items */}
            <rect x="15" y="15" width="12" height="12" rx="3" fill="#FCA5A5" />
            <rect x="75" y="18" width="14" height="14" rx="4" fill="#FCD34D" />
            <rect x="20" y="72" width="10" height="10" rx="2" fill="#93C5FD" />
            <rect x="72" y="70" width="13" height="13" rx="3" fill="#FBBF24" />
            {/* Sparkles */}
            <circle cx="10" cy="44" r="3" fill="#FEF3C7" />
            <circle cx="88" cy="49" r="2.5" fill="#FEF3C7" />
        </svg>
    ),
    food: (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Large central pizza */}
            <circle cx="50" cy="50" r="28" fill="#F59E0B" />
            <circle cx="50" cy="50" r="25" fill="#FBBF24" />
            {/* Pizza slices */}
            <line x1="50" y1="25" x2="50" y2="75" stroke="#F59E0B" strokeWidth="2" />
            <line x1="25" y1="50" x2="75" y2="50" stroke="#F59E0B" strokeWidth="2" />
            <line x1="30" y1="30" x2="70" y2="70" stroke="#F59E0B" strokeWidth="2" />
            <line x1="30" y1="70" x2="70" y2="30" stroke="#F59E0B" strokeWidth="2" />
            {/* Toppings */}
            <circle cx="42" cy="42" r="4" fill="#EF4444" />
            <circle cx="58" cy="45" r="4" fill="#EF4444" />
            <circle cx="45" cy="58" r="4" fill="#EF4444" />
            <circle cx="56" cy="60" r="3.5" fill="#EF4444" />
            {/* Floating food items */}
            <path d="M 12 25 L 8 35 L 18 35 Z" fill="#FCD34D" />
            <circle cx="85" cy="28" r="8" fill="#10B981" />
            <rect x="15" y="70" width="12" height="8" rx="4" fill="#FCA5A5" />
            <circle cx="80" cy="75" r="7" fill="#93C5FD" />
            {/* Sparkles */}
            <circle cx="10" cy="50" r="3" fill="#FEF3C7" />
            <circle cx="90" cy="52" r="2.5" fill="#FEF3C7" />
        </svg>
    ),
    gaming: (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* PS5 Controller Body - White/Cream */}
            <path d="M 25 42 Q 20 47 20 52 L 20 62 Q 20 65 23 65 L 30 65 Q 32 65 32 62 L 32 52 Q 32 45 38 42 L 62 42 Q 68 45 68 52 L 68 62 Q 68 65 70 65 L 77 65 Q 80 65 80 62 L 80 52 Q 80 47 75 42 Z" fill="#F5F5F5" />
            <path d="M 27 44 Q 24 47 24 52 L 24 61 Q 24 63 26 63 L 30 63 Q 31 63 31 61 L 31 52 Q 31 47 36 44 L 64 44 Q 69 47 69 52 L 69 61 Q 69 63 70 63 L 74 63 Q 76 63 76 61 L 76 52 Q 76 47 73 44 Z" fill="#FEFEFE" />

            {/* Center touchpad */}
            <rect x="42" y="47" width="16" height="10" rx="2" fill="#E5E7EB" />
            <rect x="43" y="48" width="14" height="8" rx="1.5" fill="#D1D5DB" />

            {/* Left D-pad */}
            <rect x="28" y="49" width="8" height="2.5" rx="1" fill="#1F2937" />
            <rect x="30.75" y="46.25" width="2.5" height="8" rx="1" fill="#1F2937" />

            {/* Right Action Buttons - PS5 symbols */}
            <circle cx="65" cy="45" r="2.5" fill="#84CC16" stroke="#65A30D" strokeWidth="0.5" />
            <circle cx="71" cy="50" r="2.5" fill="#84CC16" stroke="#65A30D" strokeWidth="0.5" />
            <circle cx="65" cy="55" r="2.5" fill="#84CC16" stroke="#65A30D" strokeWidth="0.5" />
            <circle cx="59" cy="50" r="2.5" fill="#84CC16" stroke="#65A30D" strokeWidth="0.5" />

            {/* L1/R1 Triggers */}
            <rect x="23" y="39" width="10" height="3" rx="1.5" fill="#CBD5E0" />
            <rect x="67" y="39" width="10" height="3" rx="1.5" fill="#CBD5E0" />

            {/* Floating game icons */}
            <circle cx="15" cy="20" r="7" fill="#FCA5A5" />
            <path d="M 15 17 L 12 23 L 18 23 Z" fill="#FEF3C7" />
            <circle cx="85" cy="23" r="8" fill="#FCD34D" />
            <circle cx="85" cy="23" r="5" fill="#FBBF24" />
            <rect x="12" y="72" width="10" height="10" rx="2" fill="#93C5FD" />
            <circle cx="82" cy="75" r="7" fill="#A3E635" />

            {/* Sparkles */}
            <circle cx="10" cy="47" r="3" fill="#FEF3C7" />
            <circle cx="90" cy="49" r="2.5" fill="#FEF3C7" />
        </svg>
    ),
    footwear: (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Simple Boot Icon - Clean and Modern */}

            {/* Large Central Boot */}
            <path d="M 35 35 L 35 55 L 30 55 L 30 70 Q 30 73 33 73 L 58 73 Q 61 73 61 70 L 61 40 Q 61 37 58 37 L 50 37 L 48 35 Z" fill="#84CC16" />
            <path d="M 37 37 L 37 55 L 33 55 L 33 69 Q 33 71 35 71 L 57 71 Q 59 71 59 69 L 59 41 Q 59 39 57 39 L 50 39 L 48 37 Z" fill="#A3E635" />

            {/* Sole */}
            <ellipse cx="45" cy="73" rx="17" ry="5" fill="#65A30D" />
            <rect x="28" y="70" width="34" height="3" rx="1.5" fill="#65A30D" />

            {/* Boot Details */}
            <line x1="40" y1="42" x2="55" y2="42" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round" />
            <line x1="40" y1="48" x2="55" y2="48" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round" />
            <line x1="40" y1="54" x2="55" y2="54" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round" />

            {/* Heel */}
            <path d="M 33 55 L 33 69 Q 33 70 34 70 L 37 70 Q 38 70 38 69 L 38 55" fill="#65A30D" opacity="0.5" />

            {/* Floating accessories */}
            <circle cx="15" cy="25" r="8" fill="#FCA5A5" />
            <circle cx="15" cy="25" r="5" fill="#F87171" />
            <rect x="75" y="20" width="14" height="14" rx="3" fill="#FCD34D" />
            <rect x="78" y="23" width="8" height="8" rx="2" fill="#FBBF24" />
            <circle cx="18" cy="75" r="7" fill="#93C5FD" />
            <rect x="78" y="72" width="10" height="10" rx="2" fill="#FBBF24" />

            {/* Sparkles */}
            <circle cx="10" cy="50" r="3" fill="#FEF3C7" />
            <circle cx="88" cy="52" r="2.5" fill="#FEF3C7" />
        </svg>
    ),
    healthcare: (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Heart - chunky and cute */}
            <path d="M 50 75 Q 20 55 20 35 Q 20 20 32 20 Q 43 20 50 30 Q 57 20 68 20 Q 80 20 80 35 Q 80 55 50 75 Z" fill="#FCA5A5" />
            <path d="M 50 72 Q 24 54 24 36 Q 24 23 34 23 Q 43 23 50 32 Q 57 23 66 23 Q 76 23 76 36 Q 76 54 50 72 Z" fill="#F87171" />
            {/* Pulse line - playful */}
            <path d="M 10 50 L 30 50 L 35 40 L 40 60 L 45 50 L 90 50" stroke="#84CC16" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {/* Pills - bubbly */}
            <ellipse cx="15" cy="25" rx="8" ry="6" fill="#84CC16" transform="rotate(-30 15 25)" />
            <ellipse cx="85" cy="30" rx="7" ry="5" fill="#A3E635" transform="rotate(20 85 30)" />
            <ellipse cx="20" cy="75" rx="6" ry="4" fill="#FCD34D" transform="rotate(-15 20 75)" />
            <ellipse cx="80" cy="75" rx="7" ry="5" fill="#93C5FD" transform="rotate(25 80 75)" />
            {/* Plus signs */}
            <circle cx="85" cy="20" r="3" fill="#FEF3C7" />
            <circle cx="15" cy="65" r="2.5" fill="#FEF3C7" />
        </svg>
    ),
    fashion: (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Large central shopping bag */}
            <path d="M 30 40 L 25 75 Q 25 80 30 80 L 70 80 Q 75 80 75 75 L 70 40 Z" fill="#84CC16" />
            <path d="M 32 42 L 28 75 Q 28 78 32 78 L 68 78 Q 72 78 72 75 L 68 42 Z" fill="#A3E635" />
            {/* Handle */}
            <path d="M 38 40 Q 38 30 50 30 Q 62 30 62 40" stroke="#65A30D" strokeWidth="5" fill="none" strokeLinecap="round" />
            {/* Tag/label */}
            <rect x="45" y="55" width="10" height="8" rx="2" fill="#FEF3C7" />
            {/* Floating fashion items */}
            <circle cx="15" cy="25" r="8" fill="#FCA5A5" />
            <rect x="78" y="20" width="12" height="12" rx="3" fill="#FCD34D" />
            <path d="M 18 70 L 12 78 L 24 78 Z" fill="#93C5FD" />
            <circle cx="80" cy="72" r="7" fill="#FBBF24" />
            {/* Sparkles */}
            <circle cx="10" cy="48" r="3" fill="#FEF3C7" />
            <circle cx="88" cy="50" r="2.5" fill="#FEF3C7" />
        </svg>
    ),
}

// Hardcoded categories - independent of API data
const categories = [
    {
        id: 1,
        name: 'Online Payments',
        apiCategory: 'E-commerce', // This maps to the category filter
        illustration: CategoryIllustrations.payments,
        gradient: 'from-primary-400 to-primary-500',
    },
    {
        id: 2,
        name: 'Online Shopping & Retail',
        apiCategory: 'E-commerce',
        illustration: CategoryIllustrations.shopping,
        gradient: 'from-accent-400 to-accent-500',
    },
    {
        id: 3,
        name: 'Food & Beverages',
        apiCategory: 'Food & Dining',
        illustration: CategoryIllustrations.food,
        gradient: 'from-primary-500 to-primary-600',
    },
    {
        id: 4,
        name: 'Gaming & Entertainment',
        apiCategory: 'Gaming',
        illustration: CategoryIllustrations.gaming,
        gradient: 'from-accent-500 to-accent-600',
    },
    {
        id: 5,
        name: 'Footwear & Accessories',
        apiCategory: 'Footwear',
        illustration: CategoryIllustrations.footwear,
        gradient: 'from-primary-400 to-accent-500',
    },
    {
        id: 6,
        name: 'Healthcare & Wellness',
        apiCategory: 'Healthcare',
        illustration: CategoryIllustrations.healthcare,
        gradient: 'from-primary-500 to-accent-400',
    },
    {
        id: 7,
        name: 'Fashion & Lifestyle',
        apiCategory: 'Fashion',
        illustration: CategoryIllustrations.fashion,
        gradient: 'from-accent-400 to-primary-500',
    },
]

const CategorySection = () => {
    const navigate = useNavigate()

    const handleCategoryClick = (apiCategory: string) => {
        navigate(`/brands?category=${encodeURIComponent(apiCategory)}`)
    }

    return (
        <section className="pt-8 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="mb-6">
                    <h2 className="text-4xl font-display font-bold text-white mb-1">
                        Categories
                    </h2>
                    <p className="text-white/60 text-sm">Explore gift cards by category</p>
                </div>

                {/* Horizontal Scrollable Categories */}
                <div className="relative">
                    <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                onClick={() => handleCategoryClick(category.apiCategory)}
                                className="flex-shrink-0 w-44 bg-dark-50/30 backdrop-blur-xl rounded-2xl overflow-hidden cursor-pointer hover:bg-dark-50/50 transition-all shadow-2xl shadow-black/10 hover:shadow-accent-400/20 group border-2 border-white/20 hover:border-white/40"
                            >
                                {/* Top Section - Category Name - Fixed Height */}
                                <div className="bg-dark-100/60 px-3 py-2.5 border-b border-dark-200/40 h-14 flex items-center justify-center">
                                    <h3 className="text-white font-semibold text-xs leading-tight line-clamp-2 text-center">
                                        {category.name}
                                    </h3>
                                </div>

                                {/* Bottom Section - Custom Illustration */}
                                <div className="relative h-36 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
                                    {/* Subtle Pattern */}
                                    <div className="absolute inset-0 opacity-5">
                                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <pattern id={`grid-${category.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                                    <circle cx="2" cy="2" r="1" fill="currentColor" className="text-primary-600" />
                                                </pattern>
                                            </defs>
                                            <rect width="100%" height="100%" fill={`url(#grid-${category.id})`} />
                                        </svg>
                                    </div>

                                    {/* Glow effect */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className={`w-32 h-32 bg-gradient-to-br ${category.gradient} rounded-full opacity-15 blur-3xl group-hover:opacity-25 transition-opacity`} />
                                    </div>

                                    {/* Illustration */}
                                    <div className="absolute inset-0 flex items-center justify-center p-3 pb-4 transform group-hover:scale-110 transition-transform duration-500">
                                        <div className="w-full h-full max-w-[110px] max-h-[110px]">
                                            {category.illustration}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CategorySection

