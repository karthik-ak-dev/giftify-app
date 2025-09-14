import React from 'react';

const Home: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold neon-text mb-4">
                    Discover Amazing Gift Cards
                </h1>
                <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                    Premium gift cards for every occasion. Shop from your favorite brands and get instant delivery.
                </p>
            </div>

            {/* Product Grid Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div
                        key={index}
                        className="glass-card p-6 glow-on-hover animate-stagger"
                    >
                        <div className="skeleton h-48 rounded-lg mb-4"></div>
                        <div className="skeleton h-6 rounded mb-2"></div>
                        <div className="skeleton h-4 rounded mb-4"></div>
                        <div className="skeleton h-10 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home; 