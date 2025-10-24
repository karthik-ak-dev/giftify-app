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
        <section className="py-8 px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-6">
                    {/* Category Title */}
                    <h2 className="text-base lg:text-lg font-semibold text-white/80 flex-shrink-0 tracking-wide">
                        Categories
                    </h2>

                    {/* Scrollable Category Chips */}
                    <div className="relative flex-1">
                        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category.apiCategory)}
                                    className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 whitespace-nowrap flex-shrink-0 ${selectedCategory === category.apiCategory
                                        ? 'bg-white text-purple-600 shadow-xl shadow-white/20 transform -translate-y-0.5'
                                        : 'bg-white/15 text-white hover:bg-white/25 border border-white/20 hover:border-white/40 hover:shadow-lg hover:shadow-white/10 hover:-translate-y-0.5'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>

                        {/* Gradient Fade on Right Edge */}
                        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-purple-600 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CategorySection

