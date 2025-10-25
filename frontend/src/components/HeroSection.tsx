const HeroSection = () => {
    return (
        <section className="relative h-[280px] overflow-hidden mx-3 sm:mx-6 lg:mx-8 mt-6 rounded-3xl">
            {/* Hero Banner Background - Left to Right Gradient */}
            <div className="absolute inset-0" style={{
                background: 'linear-gradient(90deg, #B934FE 0%, #C33AFC 20%, #D452FB 40%, #EF73F8 60%, #F997EC 80%, #F99EEA 100%)'
            }}>
            </div>

            {/* Decorative Gradient Orbs */}
            <div className="absolute top-10 left-20 w-32 h-32 bg-yellow-300/30 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 right-20 w-40 h-40 bg-cyan-300/30 rounded-full blur-3xl"></div>

            {/* Content Container */}
            <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center">
                <div className="w-full grid grid-cols-12 gap-4 items-center">
                    {/* Left Side - FASTER Text */}
                    <div className="col-span-3 hidden lg:flex flex-col items-start">
                        <h2 className="text-6xl font-black text-white tracking-wider italic transform -skew-x-6">
                            FASTER
                        </h2>
                    </div>

                    {/* Center - Hero Banner Image */}
                    <div className="col-span-12 lg:col-span-6 flex flex-col items-center justify-end">
                        {/* Hero Banner Image */}
                        <div className="relative flex items-end justify-center w-full">
                            <img
                                src="/images/hero-banner-2.png"
                                alt="Premium Gift Cards"
                                className="w-full max-w-[17.5rem] lg:max-w-[19.5rem] h-auto object-contain"
                            />
                        </div>
                    </div>

                    {/* Right Side - SEAMLESS Text */}
                    <div className="col-span-3 hidden lg:flex flex-col items-end">
                        <h2 className="text-6xl font-black text-white tracking-wider italic transform skew-x-6">
                            SEAMLESS
                        </h2>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection

