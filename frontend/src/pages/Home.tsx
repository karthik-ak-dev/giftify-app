import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Star } from 'lucide-react';

// UI Components
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

// Store hooks
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';



interface HomeProps {
    onAuthRequired?: (mode?: 'login' | 'register') => void;
}

/**
 * Home Page Component
 * 
 * Features:
 * - Public product catalog (no auth required)
 * - Search functionality
 * - Category filtering
 * - Add to cart functionality (triggers auth if needed)
 * - Responsive design with cool animations
 */
const Home: React.FC<HomeProps> = ({ onAuthRequired }) => {
    const {
        products,
        isLoading,
        error,
        searchQuery,
        fetchProducts,
        setSearchQuery,
        clearError,
        getFilteredProducts
    } = useProductStore();

    const { addToCart, isLoading: cartLoading } = useCartStore();
    const { isAuthenticated } = useAuthStore();

    // Get filtered products
    const filteredProducts = getFilteredProducts();

    // Fetch products on component mount (public access)
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Debug log
    useEffect(() => {
        console.log('Home component state:', {
            productsLength: products.length,
            filteredProductsLength: filteredProducts.length,
            isLoading,
            error,
            searchQuery
        });
    }, [products, filteredProducts, isLoading, error, searchQuery]);

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Handle add to cart - trigger auth if needed
    const handleAddToCart = async (variantId: string) => {
        if (!isAuthenticated) {
            // Trigger auth sidebar instead of adding to cart
            onAuthRequired?.('login');
            return;
        }

        try {
            await addToCart(variantId, 1);
        } catch (error) {
            console.error('Failed to add to cart:', error);
        }
    };

    // Loading state
    if (isLoading && products.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading awesome gift cards..." />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="p-8 text-center max-w-md">
                    <h2 className="text-xl font-bold text-text-primary mb-4">
                        Oops! Something went wrong
                    </h2>
                    <p className="text-text-secondary mb-6">{error}</p>
                    <Button onClick={clearError}>
                        Try Again
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-primary">
            {/* Hero Section */}
            <section className="relative py-20 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-6"
                    >
                        <span className="bg-gradient-to-r from-accent-pink to-accent-orange bg-clip-text text-transparent">
                            Premium Gift Cards
                        </span>
                        <br />
                        <span className="text-text-primary">Instant Delivery</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto"
                    >
                        Get the best deals on gift cards from your favorite brands.
                        Instant delivery, secure payments, and amazing discounts!
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="max-w-md mx-auto relative"
                    >
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
                        <Input
                            type="text"
                            placeholder="Search for gift cards..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="pl-10"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Results Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-text-primary">
                            {searchQuery ? `Search Results (${filteredProducts.length})` : 'All Gift Cards'}
                        </h2>
                        <p className="text-text-secondary">
                            {filteredProducts.length} cards available
                        </p>
                    </div>

                    {/* Products Grid */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product, index) => (
                                <motion.div
                                    key={product.productId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="group hover:scale-105 transition-all duration-300 overflow-hidden">
                                        {/* Product Image */}
                                        <div className="aspect-video bg-gradient-to-br from-accent-pink/20 to-accent-orange/20 relative overflow-hidden">
                                            {product.imageUrl ? (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full">
                                                    <Star className="text-accent-pink" size={48} />
                                                </div>
                                            )}

                                            {/* Category Badge */}
                                            <div className="absolute top-3 left-3">
                                                <span className="glass-button px-2 py-1 text-xs font-medium">
                                                    {product.categoryDisplayName}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-4">
                                            <h3 className="font-bold text-text-primary mb-2 line-clamp-2">
                                                {product.name}
                                            </h3>

                                            <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                                                {product.description}
                                            </p>

                                            {/* Price Range */}
                                            {product.priceRange && (
                                                <div className="mb-4">
                                                    <p className="text-lg font-bold text-accent-pink">
                                                        {product.priceRange.minFormatted} - {product.priceRange.maxFormatted}
                                                    </p>
                                                    <p className="text-xs text-text-secondary">
                                                        {product.activeVariantCount} variants available
                                                    </p>
                                                </div>
                                            )}

                                            {/* Add to Cart Button */}
                                            {product.variants.length > 0 && (
                                                <Button
                                                    onClick={() => handleAddToCart(product.variants[0].variantId)}
                                                    disabled={cartLoading || !product.hasStock}
                                                    className="w-full"
                                                    variant="glass"
                                                >
                                                    <Plus size={16} className="mr-2" />
                                                    {product.hasStock ? 'Add to Cart' : 'Out of Stock'}
                                                </Button>
                                            )}
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="max-w-md mx-auto">
                                <div className="text-6xl mb-4">🎁</div>
                                <h3 className="text-xl font-bold text-text-primary mb-2">
                                    No gift cards found
                                </h3>
                                <p className="text-text-secondary mb-6">
                                    {searchQuery
                                        ? `No results for "${searchQuery}". Try a different search term.`
                                        : 'No gift cards available at the moment.'
                                    }
                                </p>
                                {searchQuery && (
                                    <Button onClick={() => setSearchQuery('')}>
                                        Clear Search
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home; 