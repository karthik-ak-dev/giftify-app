import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
// import CategorySection from '../components/CategorySection'
import PopularBrands from '../components/PopularBrands'
import Footer from '../components/Footer'

const Home = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <HeroSection />
            {/* <CategorySection /> */}
            <PopularBrands />
            <Footer />
        </div>
    )
}

export default Home

