import { useNavigate } from 'react-router-dom'
import { ShoppingBag, CreditCard, Utensils, Gamepad2, Shirt, Heart, Package } from 'lucide-react'

// Hardcoded categories - independent of API data
const categories = [
    {
        id: 1,
        name: 'Online Payments',
        apiCategory: 'E-commerce',
        icon: CreditCard,
        gradient: 'from-primary-500 to-primary-600',
        bgColor: 'bg-primary-50',
    },
    {
        id: 2,
        name: 'Online Shopping',
        apiCategory: 'E-commerce',
        icon: ShoppingBag,
        gradient: 'from-accent-500 to-accent-600',
        bgColor: 'bg-accent-50',
    },
    {
        id: 3,
        name: 'Food & Dining',
        apiCategory: 'Food & Dining',
        icon: Utensils,
        gradient: 'from-primary-600 to-primary-700',
        bgColor: 'bg-primary-50',
    },
    {
        id: 4,
        name: 'Gaming',
        apiCategory: 'Gaming',
        icon: Gamepad2,
        gradient: 'from-accent-600 to-accent-700',
        bgColor: 'bg-accent-50',
    },
    {
        id: 5,
        name: 'Footwear',
        apiCategory: 'Footwear',
        icon: Package,
        gradient: 'from-primary-500 to-accent-500',
        bgColor: 'bg-primary-50',
    },
    {
        id: 6,
        name: 'Healthcare',
        apiCategory: 'Healthcare',
        icon: Heart,
        gradient: 'from-accent-500 to-primary-500',
        bgColor: 'bg-accent-50',
    },
    {
        id: 7,
        name: 'Fashion',
        apiCategory: 'Fashion',
        icon: Shirt,
        gradient: 'from-primary-600 to-accent-600',
        bgColor: 'bg-primary-50',
    },
]

const CategorySection = () => {
    const navigate = useNavigate()

    const handleCategoryClick = (apiCategory: string) => {
        navigate(`/brands?category=${encodeURIComponent(apiCategory)}`)
    }

    return (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-y border-neutral-200">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="mb-10 text-center">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-2">
                        Browse by Category
                    </h2>
                    <p className="text-neutral-600">Find the perfect gift card for every occasion</p>
                </div>

                {/* Horizontal Scrollable Categories */}
                <div className="relative">
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                        {categories.map((category, index) => {
                            const IconComponent = category.icon
                            return (
                            <div
                                key={category.id}
                                onClick={() => handleCategoryClick(category.apiCategory)}
                                    className="flex-shrink-0 w-40 elegant-card cursor-pointer group animate-scale-in"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    {/* Icon Section */}
                                    <div className={`${category.bgColor} h-32 flex items-center justify-center rounded-t-2xl relative overflow-hidden`}>
                                        {/* Gradient background on hover */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                                        {/* Icon */}
                                        <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-elegant-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                                            <IconComponent className="w-8 h-8 text-white" />
                                </div>
                                    </div>

                                    {/* Category Name */}
                                    <div className="p-4 bg-white rounded-b-2xl border-t border-neutral-100">
                                        <h3 className="text-neutral-900 font-semibold text-sm text-center leading-tight group-hover:text-primary-600 transition-colors">
                                            {category.name}
                                        </h3>
                                    </div>

                                    {/* Bottom accent line */}
                                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${category.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl`} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CategorySection
