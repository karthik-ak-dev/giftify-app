const categories = [
    { id: 1, name: 'Online Payments', apiCategory: 'E-commerce' },
    { id: 2, name: 'Food & Beverages', apiCategory: 'Food & Dining' },
    { id: 3, name: 'Gaming', apiCategory: 'Gaming' },
    { id: 4, name: 'Footwear', apiCategory: 'Footwear' },
    { id: 5, name: 'Healthcare', apiCategory: 'Healthcare' },
    { id: 6, name: 'Fashion', apiCategory: 'Fashion' },
]

interface CategorySectionProps {
    selectedCategory: string | null
    onCategoryChange: (category: string | null) => void
}

const CategorySection = ({ selectedCategory, onCategoryChange }: CategorySectionProps) => {
    const handleCategoryClick = (apiCategory: string) => {
        if (selectedCategory === apiCategory) {
            onCategoryChange(null)
        } else {
            onCategoryChange(apiCategory)
        }
    }

    return (
        <section className="pt-8 pb-2 px-3 sm:px-6 lg:px-8">
            <div className="max-w-[1360px] mx-auto">
                <div className="flex justify-start lg:justify-center gap-4 overflow-x-auto scrollbar-hide py-1">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category.apiCategory)}
                            className={`px-6 py-2 rounded-2xl font-semibold text-sm leading-tight transition-all duration-300 whitespace-nowrap flex-shrink-0 ${selectedCategory === category.apiCategory
                                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white transform scale-105'
                                : 'bg-white/15 text-white/90 hover:bg-white/20 border-2 border-white/30 hover:border-b-4 hover:border-b-white/60'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default CategorySection

