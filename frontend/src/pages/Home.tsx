import { useState } from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import CategorySection from '../components/CategorySection'
import BrandsGrid from '../components/BrandsGrid'
import Footer from '../components/Footer'

const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    return (
        <div className="min-h-screen">
            <Navbar />
            <HeroSection />
            <CategorySection
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
            />
            <BrandsGrid selectedCategory={selectedCategory} />
            <Footer />
        </div>
    )
}

export default Home

