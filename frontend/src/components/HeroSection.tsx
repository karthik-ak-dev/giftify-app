const HeroSection = () => {
    return (
        <section className="relative h-[280px] overflow-hidden mx-6 lg:mx-8 mt-6 rounded-3xl">
            {/* Vibrant Purple-to-Pink Gradient Background */}
            <div className="absolute inset-0" style={{
                background: 'linear-gradient(90deg, #8B5CF6 0%, #A855F7 30%, #D946EF 65%, #EC4899 100%)'
            }}>
                <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-400/20 to-transparent"></div>
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
                        <div className="flex items-center gap-3 mt-4">
                            {/* Xbox Logo */}
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl p-2 hover:scale-110 transition-transform">
                                <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
                                    <path d="M4.102 21.033A11.947 11.947 0 0012 24a11.96 11.96 0 007.902-2.967c1.877-1.912-4.316-8.709-7.902-11.417-3.582 2.708-9.779 9.505-7.898 11.417zm11.16-14.406c2.5 2.961 7.484 10.313 6.076 12.912A11.942 11.942 0 0024 12.004a11.95 11.95 0 00-3.57-8.536 2.12 2.12 0 00-.789-.477c-2.254-.766-5.332 2.104-4.38 3.636zm-7.523-.004c.95-1.53-2.128-4.402-4.38-3.636a2.12 2.12 0 00-.789.477A11.95 11.95 0 000 12.004a11.943 11.943 0 002.66 7.535c-1.408-2.598 3.578-9.951 6.078-12.912zM11.998 8.316C13.893 6.477 15.5 4.395 15.5 2.5 15.5 1.119 14.381 0 13 0a1.5 1.5 0 00-1 .382A1.5 1.5 0 0011 0C9.619 0 8.5 1.119 8.5 2.5c0 1.895 1.607 3.977 3.498 5.816z" />
                                </svg>
                            </div>
                            {/* PlayStation Logo */}
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl p-2 hover:scale-110 transition-transform">
                                <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
                                    <path d="M8.985 2.596v17.548l3.915 1.261V6.688c0-.69.304-1.151.794-.991.636.18.76.814.76 1.505v5.876c2.441 1.193 4.362-.002 4.362-3.152 0-3.237-1.126-4.675-4.438-4.675-1.039 0-2.178.192-3.535.594-1.365.401-1.858.902-1.858 1.751zM20.848 19.05l3.152-.99V16.28l-3.152.991v1.779zm-10.538 2.139l10.538-3.304v-1.779l-10.538 3.304v1.779z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Center - Hero Banner Image */}
                    <div className="col-span-12 lg:col-span-6 flex flex-col items-center justify-end">
                        {/* Mobile Title */}
                        <div className="lg:hidden mb-4">
                            <h2 className="text-4xl font-black text-white text-center tracking-wide">
                                FASTER & SEAMLESS
                            </h2>
                        </div>

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
                        <div className="flex items-center gap-3 mt-4">
                            {/* Steam Logo */}
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl p-2 hover:scale-110 transition-transform">
                                <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
                                    <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z" />
                                </svg>
                            </div>
                            {/* Question Mark Icon */}
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl p-2 hover:scale-110 transition-transform flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">?</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection

