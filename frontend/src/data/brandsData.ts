// This file will be replaced with actual API calls later
// For now, it contains mock data that matches the expected API structure

export interface BrandVariant {
    id: string
    name: string
    originalPrice: number
    salePrice: number
    discountPercent: number
    description: string
    vouchersSold: number
}

export interface Brand {
    id: string
    name: string
    logo: string // Will be populated with actual images from API
    category: string
    description: string
    vouchersSold: number
    popularity: number // Used for sorting popular brands
    variants: BrandVariant[]
}

// Mock data - This will be replaced with API response
export const brandsData: Brand[] = [
    {
        id: 'amazon',
        name: 'Amazon',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0ZGOTkwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IiMxRjI5MzciIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSJib2xkIj5BPC90ZXh0Pjwvc3ZnPg==', // Will be replaced with actual logo from API
        category: 'E-commerce',
        description: 'Shop for everything from electronics to groceries with Amazon gift cards.',
        vouchersSold: 125430,
        popularity: 15,
        variants: [
            {
                id: 'amazon-500',
                name: '₹500 Gift Card',
                originalPrice: 500,
                salePrice: 490,
                discountPercent: 2,
                description: 'Perfect for small purchases and trying out new products',
                vouchersSold: 45230
            },
            {
                id: 'amazon-1000',
                name: '₹1000 Gift Card',
                originalPrice: 1000,
                salePrice: 980,
                discountPercent: 2,
                description: 'Great value for medium-sized shopping',
                vouchersSold: 52100
            },
            {
                id: 'amazon-2000',
                name: '₹2000 Gift Card',
                originalPrice: 2000,
                salePrice: 1960,
                discountPercent: 2,
                description: 'Best for big shopping sprees and electronics',
                vouchersSold: 28100
            }
        ]
    },
    {
        id: 'flipkart',
        name: 'Flipkart',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzI4NzRGMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+RjwvdGV4dD48L3N2Zz4=',
        category: 'E-commerce',
        description: "India's leading online shopping destination for fashion, electronics, and more.",
        vouchersSold: 98750,
        popularity: 14,
        variants: [
            {
                id: 'flipkart-500',
                name: '₹500 Gift Card',
                originalPrice: 500,
                salePrice: 482,
                discountPercent: 3.5,
                description: 'Perfect starter gift card',
                vouchersSold: 35400
            },
            {
                id: 'flipkart-1000',
                name: '₹1000 Gift Card',
                originalPrice: 1000,
                salePrice: 965,
                discountPercent: 3.5,
                description: 'Popular choice for online shopping',
                vouchersSold: 42150
            },
            {
                id: 'flipkart-1500',
                name: '₹1500 Gift Card',
                originalPrice: 1500,
                salePrice: 1447,
                discountPercent: 3.5,
                description: 'Great for fashion and gadgets',
                vouchersSold: 21200
            }
        ]
    },
    {
        id: 'swiggy',
        name: 'Swiggy',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0ZDOEMwQyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+UzwvdGV4dD48L3N2Zz4=',
        category: 'Food & Dining',
        description: 'Order your favorite food from thousands of restaurants.',
        vouchersSold: 156890,
        popularity: 13,
        variants: [
            {
                id: 'swiggy-200',
                name: '₹200 Gift Card',
                originalPrice: 200,
                salePrice: 190,
                discountPercent: 5,
                description: 'Quick meal for one',
                vouchersSold: 62340
            },
            {
                id: 'swiggy-500',
                name: '₹500 Gift Card',
                originalPrice: 500,
                salePrice: 475,
                discountPercent: 5,
                description: 'Feast for family',
                vouchersSold: 58230
            },
            {
                id: 'swiggy-1000',
                name: '₹1000 Gift Card',
                originalPrice: 1000,
                salePrice: 950,
                discountPercent: 5,
                description: 'Party pack',
                vouchersSold: 36320
            }
        ]
    },
    {
        id: 'zomato',
        name: 'Zomato',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0UyMzc0NCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+WjwvdGV4dD48L3N2Zz4=',
        category: 'Food & Dining',
        description: 'Discover and order from the best restaurants near you.',
        vouchersSold: 143250,
        popularity: 12,
        variants: [
            {
                id: 'zomato-300',
                name: '₹300 Gift Card',
                originalPrice: 300,
                salePrice: 285,
                discountPercent: 5,
                description: 'Single meal treat',
                vouchersSold: 54120
            },
            {
                id: 'zomato-500',
                name: '₹500 Gift Card',
                originalPrice: 500,
                salePrice: 475,
                discountPercent: 5,
                description: 'Dining out for two',
                vouchersSold: 61430
            },
            {
                id: 'zomato-1000',
                name: '₹1000 Gift Card',
                originalPrice: 1000,
                salePrice: 950,
                discountPercent: 5,
                description: 'Premium dining experience',
                vouchersSold: 27700
            }
        ]
    },
    {
        id: 'dominos',
        name: 'Dominos',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzAwNjZBMSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+RDwvdGV4dD48L3N2Zz4=',
        category: 'Food & Dining',
        description: 'Enjoy delicious pizzas and sides with Dominos gift vouchers',
        vouchersSold: 136000,
        popularity: 11,
        variants: [
            {
                id: 'dominos-250',
                name: '₹250 Gift Card',
                originalPrice: 250,
                salePrice: 240,
                discountPercent: 4,
                description: 'Perfect for a personal pizza',
                vouchersSold: 52100
            },
            {
                id: 'dominos-500',
                name: '₹500 Gift Card',
                originalPrice: 500,
                salePrice: 480,
                discountPercent: 4,
                description: 'Great for family meals',
                vouchersSold: 56200
            },
            {
                id: 'dominos-1000',
                name: '₹1000 Gift Card',
                originalPrice: 1000,
                salePrice: 960,
                discountPercent: 4,
                description: 'Party with friends',
                vouchersSold: 27700
            }
        ]
    },
    {
        id: 'kfc',
        name: 'KFC',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0U0MDAyQiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+SzwvdGV4dD48L3N2Zz4=',
        category: 'Food & Dining',
        description: "Enjoy finger lickin' good chicken with KFC gift vouchers",
        vouchersSold: 89000,
        popularity: 10,
        variants: [
            {
                id: 'kfc-100',
                name: '₹100 Gift Card',
                originalPrice: 100,
                salePrice: 96,
                discountPercent: 4,
                description: 'Quick snack',
                vouchersSold: 28100
            },
            {
                id: 'kfc-250',
                name: '₹250 Gift Card',
                originalPrice: 250,
                salePrice: 240,
                discountPercent: 4,
                description: 'Single meal combo',
                vouchersSold: 35400
            },
            {
                id: 'kfc-500',
                name: '₹500 Gift Card',
                originalPrice: 500,
                salePrice: 480,
                discountPercent: 4,
                description: 'Family bucket',
                vouchersSold: 25500
            }
        ]
    },
    {
        id: 'mcdonalds',
        name: 'McDonalds',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0ZGQzcyQyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IiNFNDAwMkIiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSJib2xkIj5NPC90ZXh0Pjwvc3ZnPg==',
        category: 'Food & Dining',
        description: "I'm lovin' it! Enjoy McDonald's favorites with gift cards",
        vouchersSold: 104000,
        popularity: 9,
        variants: [
            {
                id: 'mcdonalds-200',
                name: '₹200 Gift Card',
                originalPrice: 200,
                salePrice: 190,
                discountPercent: 5,
                description: 'Quick bite',
                vouchersSold: 42300
            },
            {
                id: 'mcdonalds-500',
                name: '₹500 Gift Card',
                originalPrice: 500,
                salePrice: 475,
                discountPercent: 5,
                description: 'Happy meal for family',
                vouchersSold: 45100
            },
            {
                id: 'mcdonalds-1000',
                name: '₹1000 Gift Card',
                originalPrice: 1000,
                salePrice: 950,
                discountPercent: 5,
                description: 'Party pack',
                vouchersSold: 16600
            }
        ]
    },
    {
        id: 'barbeque-nation',
        name: 'Barbeque Nation',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0U5NEIzQyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+Qk48L3RleHQ+PC9zdmc+',
        category: 'Food & Dining',
        description: 'Unlimited grills and buffet experience',
        vouchersSold: 43000,
        popularity: 8,
        variants: [
            {
                id: 'bn-500',
                name: '₹500 Gift Card',
                originalPrice: 500,
                salePrice: 485,
                discountPercent: 3,
                description: 'Dining experience',
                vouchersSold: 18200
            },
            {
                id: 'bn-1000',
                name: '₹1000 Gift Card',
                originalPrice: 1000,
                salePrice: 970,
                discountPercent: 3,
                description: 'Premium buffet',
                vouchersSold: 16300
            },
            {
                id: 'bn-2000',
                name: '₹2000 Gift Card',
                originalPrice: 2000,
                salePrice: 1940,
                discountPercent: 3,
                description: 'Group dining',
                vouchersSold: 8500
            }
        ]
    },
    {
        id: 'myntra',
        name: 'Myntra',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0Y4M0Y1QSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+TTwvdGV4dD48L3N2Zz4=',
        category: 'Fashion',
        description: 'Latest fashion trends for men, women, and kids.',
        vouchersSold: 87630,
        popularity: 7,
        variants: [
            {
                id: 'myntra-500',
                name: '₹500 Gift Card',
                originalPrice: 500,
                salePrice: 475,
                discountPercent: 5,
                description: 'Fashion essentials',
                vouchersSold: 32100
            },
            {
                id: 'myntra-1000',
                name: '₹1000 Gift Card',
                originalPrice: 1000,
                salePrice: 950,
                discountPercent: 5,
                description: 'Wardrobe upgrade',
                vouchersSold: 38240
            },
            {
                id: 'myntra-2000',
                name: '₹2000 Gift Card',
                originalPrice: 2000,
                salePrice: 1900,
                discountPercent: 5,
                description: 'Complete makeover',
                vouchersSold: 17290
            }
        ]
    },
    {
        id: 'jack-jones',
        name: 'Jack & Jones',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzAwMzk2QiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+Sio8L3RleHQ+PC9zdmc+',
        category: 'Fashion',
        description: 'Premium mens fashion and accessories',
        vouchersSold: 51000,
        popularity: 6,
        variants: [
            {
                id: 'jj-500',
                name: '₹500 Gift Card',
                originalPrice: 500,
                salePrice: 470,
                discountPercent: 6,
                description: 'Casual wear',
                vouchersSold: 19200
            },
            {
                id: 'jj-1000',
                name: '₹1000 Gift Card',
                originalPrice: 1000,
                salePrice: 940,
                discountPercent: 6,
                description: 'Premium collection',
                vouchersSold: 21300
            },
            {
                id: 'jj-2000',
                name: '₹2000 Gift Card',
                originalPrice: 2000,
                salePrice: 1880,
                discountPercent: 6,
                description: 'Complete outfit',
                vouchersSold: 10500
            }
        ]
    },
    {
        id: 'chumbak',
        name: 'Chumbak',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzAwMDAwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+QzwvdGV4dD48L3N2Zz4=',
        category: 'Fashion',
        description: 'Quirky Indian fashion and lifestyle products',
        vouchersSold: 28000,
        popularity: 5,
        variants: [
            {
                id: 'chumbak-500',
                name: '₹500 Gift Card',
                originalPrice: 500,
                salePrice: 475,
                discountPercent: 5,
                description: 'Accessories and more',
                vouchersSold: 12100
            },
            {
                id: 'chumbak-1000',
                name: '₹1000 Gift Card',
                originalPrice: 1000,
                salePrice: 950,
                discountPercent: 5,
                description: 'Fashion items',
                vouchersSold: 11200
            },
            {
                id: 'chumbak-1500',
                name: '₹1500 Gift Card',
                originalPrice: 1500,
                salePrice: 1425,
                discountPercent: 5,
                description: 'Premium shopping',
                vouchersSold: 4700
            }
        ]
    },
    {
        id: 'bata',
        name: 'Bata',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0UzMDYxMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+QjwvdGV4dD48L3N2Zz4=',
        category: 'Footwear',
        description: 'Quality footwear for all occasions',
        vouchersSold: 32000,
        popularity: 4,
        variants: [
            {
                id: 'bata-500',
                name: '₹500 Gift Card',
                originalPrice: 500,
                salePrice: 460,
                discountPercent: 8,
                description: 'Casual footwear',
                vouchersSold: 14200
            },
            {
                id: 'bata-1000',
                name: '₹1000 Gift Card',
                originalPrice: 1000,
                salePrice: 920,
                discountPercent: 8,
                description: 'Premium shoes',
                vouchersSold: 13100
            },
            {
                id: 'bata-1500',
                name: '₹1500 Gift Card',
                originalPrice: 1500,
                salePrice: 1380,
                discountPercent: 8,
                description: 'Designer collection',
                vouchersSold: 4700
            }
        ]
    },
    {
        id: 'spotify',
        name: 'Spotify',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzFEQjk1NCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+UzwvdGV4dD48L3N2Zz4=',
        category: 'Entertainment',
        description: 'Stream millions of songs and podcasts ad-free.',
        vouchersSold: 76540,
        popularity: 3,
        variants: [
            {
                id: 'spotify-399',
                name: '1 Month Premium',
                originalPrice: 399,
                salePrice: 379,
                discountPercent: 5,
                description: 'One month of ad-free music',
                vouchersSold: 28450
            },
            {
                id: 'spotify-1196',
                name: '3 Months Premium',
                originalPrice: 1196,
                salePrice: 1136,
                discountPercent: 5,
                description: 'Three months of unlimited streaming',
                vouchersSold: 32140
            },
            {
                id: 'spotify-1788',
                name: '6 Months Premium',
                originalPrice: 1788,
                salePrice: 1698,
                discountPercent: 5,
                description: 'Half year of premium experience',
                vouchersSold: 15950
            }
        ]
    },
    {
        id: 'netflix',
        name: 'Netflix',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0UyMEEyMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+TjwvdGV4dD48L3N2Zz4=',
        category: 'Entertainment',
        description: 'Watch unlimited movies, TV shows, and more.',
        vouchersSold: 92340,
        popularity: 2,
        variants: [
            {
                id: 'netflix-500',
                name: '₹500 Gift Card',
                originalPrice: 500,
                salePrice: 480,
                discountPercent: 4,
                description: 'Binge watch your favorites',
                vouchersSold: 36780
            },
            {
                id: 'netflix-1000',
                name: '₹1000 Gift Card',
                originalPrice: 1000,
                salePrice: 960,
                discountPercent: 4,
                description: 'Extended streaming time',
                vouchersSold: 38920
            },
            {
                id: 'netflix-1500',
                name: '₹1500 Gift Card',
                originalPrice: 1500,
                salePrice: 1440,
                discountPercent: 4,
                description: 'Premium viewing experience',
                vouchersSold: 16640
            }
        ]
    },
    {
        id: 'bookmyshow',
        name: 'BookMyShow',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0NDMjEzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+Qk08L3RleHQ+PC9zdmc+',
        category: 'Entertainment',
        description: 'Book movie tickets and live event passes.',
        vouchersSold: 68920,
        popularity: 1,
        variants: [
            {
                id: 'bms-300',
                name: '₹300 Gift Card',
                originalPrice: 300,
                salePrice: 285,
                discountPercent: 5,
                description: 'Single movie ticket',
                vouchersSold: 28340
            },
            {
                id: 'bms-500',
                name: '₹500 Gift Card',
                originalPrice: 500,
                salePrice: 475,
                discountPercent: 5,
                description: 'Movie date night',
                vouchersSold: 26120
            },
            {
                id: 'bms-1000',
                name: '₹1000 Gift Card',
                originalPrice: 1000,
                salePrice: 950,
                discountPercent: 5,
                description: 'Multiple shows or events',
                vouchersSold: 14460
            }
        ]
    },
    {
        id: 'steam',
        name: 'Steam',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzFCMjgzOCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+UzwvdGV4dD48L3N2Zz4=',
        category: 'Gaming',
        description: 'Purchase the latest games and in-game items with Steam Wallet codes',
        vouchersSold: 152000,
        popularity: 16,
        variants: [
            {
                id: 'steam-100',
                name: '₹100 Wallet Code',
                originalPrice: 100,
                salePrice: 97.5,
                discountPercent: 2.5,
                description: 'Perfect for indie games',
                vouchersSold: 52100
            },
            {
                id: 'steam-500',
                name: '₹500 Wallet Code',
                originalPrice: 500,
                salePrice: 487.5,
                discountPercent: 2.5,
                description: 'Popular AAA titles',
                vouchersSold: 62400
            },
            {
                id: 'steam-1000',
                name: '₹1000 Wallet Code',
                originalPrice: 1000,
                salePrice: 975,
                discountPercent: 2.5,
                description: 'Multiple games',
                vouchersSold: 28100
            },
            {
                id: 'steam-2000',
                name: '₹2000 Wallet Code',
                originalPrice: 2000,
                salePrice: 1950,
                discountPercent: 2.5,
                description: 'Premium game collection',
                vouchersSold: 9400
            }
        ]
    },
    {
        id: 'valorant',
        name: 'Valorant',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0ZGNDY1NSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+VjwvdGV4dD48L3N2Zz4=',
        category: 'Gaming',
        description: 'Buy Valorant Points for skins, battle passes, and more',
        vouchersSold: 67000,
        popularity: 17,
        variants: [
            {
                id: 'valorant-475',
                name: '475 VP + 50 Bonus',
                originalPrice: 400,
                salePrice: 372.6,
                discountPercent: 6.85,
                description: 'Small bundle',
                vouchersSold: 28200
            },
            {
                id: 'valorant-1000',
                name: '1000 VP + 100 Bonus',
                originalPrice: 800,
                salePrice: 745.2,
                discountPercent: 6.85,
                description: 'Popular choice',
                vouchersSold: 29100
            },
            {
                id: 'valorant-2050',
                name: '2050 VP + 250 Bonus',
                originalPrice: 1600,
                salePrice: 1490.4,
                discountPercent: 6.85,
                description: 'Best value',
                vouchersSold: 9700
            }
        ]
    },
    {
        id: 'unipin',
        name: 'Unipin',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0ZGNkIwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+VTwvdGV4dD48L3N2Zz4=',
        category: 'Gaming',
        description: 'Top-up for your favorite mobile games',
        vouchersSold: 118000,
        popularity: 18,
        variants: [
            {
                id: 'unipin-100',
                name: '100 UC',
                originalPrice: 100,
                salePrice: 94,
                discountPercent: 6,
                description: 'Quick top-up',
                vouchersSold: 45300
            },
            {
                id: 'unipin-250',
                name: '250 UC',
                originalPrice: 250,
                salePrice: 235,
                discountPercent: 6,
                description: 'Popular choice',
                vouchersSold: 48200
            },
            {
                id: 'unipin-500',
                name: '500 UC',
                originalPrice: 500,
                salePrice: 470,
                discountPercent: 6,
                description: 'Best value',
                vouchersSold: 24500
            }
        ]
    },
    {
        id: 'zepto',
        name: 'Zepto',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzhCMkNBMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+WjwvdGV4dD48L3N2Zz4=',
        category: 'Grocery',
        description: 'Get instant delivery of groceries and essentials with Zepto gift cards',
        vouchersSold: 125000,
        popularity: 19,
        variants: [
            {
                id: 'zepto-100',
                name: '₹100 Gift Card',
                originalPrice: 100,
                salePrice: 98,
                discountPercent: 2,
                description: 'Quick essentials',
                vouchersSold: 48200
            },
            {
                id: 'zepto-200',
                name: '₹200 Gift Card',
                originalPrice: 200,
                salePrice: 196,
                discountPercent: 2,
                description: 'Daily groceries',
                vouchersSold: 52100
            },
            {
                id: 'zepto-500',
                name: '₹500 Gift Card',
                originalPrice: 500,
                salePrice: 490,
                discountPercent: 2,
                description: 'Weekly shopping',
                vouchersSold: 18300
            },
            {
                id: 'zepto-1000',
                name: '₹1000 Gift Card',
                originalPrice: 1000,
                salePrice: 980,
                discountPercent: 2,
                description: 'Bulk purchases',
                vouchersSold: 6400
            }
        ]
    },
    {
        id: 'blinkit',
        name: 'Blinkit',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0Y4Q0IwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IiMxRjI5MzciIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSJib2xkIj5CPC90ZXh0Pjwvc3ZnPg==',
        category: 'Grocery',
        description: 'Instant grocery delivery in minutes',
        vouchersSold: 95000,
        popularity: 20,
        variants: [
            {
                id: 'blinkit-100',
                name: '₹100 Gift Card',
                originalPrice: 100,
                salePrice: 98,
                discountPercent: 2,
                description: 'Quick essentials',
                vouchersSold: 38100
            },
            {
                id: 'blinkit-200',
                name: '₹200 Gift Card',
                originalPrice: 200,
                salePrice: 196,
                discountPercent: 2,
                description: 'Daily needs',
                vouchersSold: 40200
            },
            {
                id: 'blinkit-500',
                name: '₹500 Gift Card',
                originalPrice: 500,
                salePrice: 490,
                discountPercent: 2,
                description: 'Weekly groceries',
                vouchersSold: 14300
            },
            {
                id: 'blinkit-1000',
                name: '₹1000 Gift Card',
                originalPrice: 1000,
                salePrice: 980,
                discountPercent: 2,
                description: 'Monthly stock up',
                vouchersSold: 2400
            }
        ]
    },
    {
        id: 'makemytrip',
        name: 'MakeMyTrip',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0VCMjMyQyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+TU08L3RleHQ+PC9zdmc+',
        category: 'Travel',
        description: 'Book flights, hotels, and holiday packages.',
        vouchersSold: 54320,
        popularity: 21,
        variants: [
            {
                id: 'mmt-1000',
                name: '₹1000 Gift Card',
                originalPrice: 1000,
                salePrice: 950,
                discountPercent: 5,
                description: 'Quick getaway',
                vouchersSold: 21230
            },
            {
                id: 'mmt-2500',
                name: '₹2500 Gift Card',
                originalPrice: 2500,
                salePrice: 2375,
                discountPercent: 5,
                description: 'Weekend trip',
                vouchersSold: 19450
            },
            {
                id: 'mmt-5000',
                name: '₹5000 Gift Card',
                originalPrice: 5000,
                salePrice: 4750,
                discountPercent: 5,
                description: 'Vacation package',
                vouchersSold: 13640
            }
        ]
    },
    {
        id: 'uber',
        name: 'Uber',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzAwMDAwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+VTwvdGV4dD48L3N2Zz4=',
        category: 'Travel',
        description: 'Ride anywhere, anytime with Uber.',
        vouchersSold: 71250,
        popularity: 22,
        variants: [
            {
                id: 'uber-200',
                name: '₹200 Gift Card',
                originalPrice: 200,
                salePrice: 190,
                discountPercent: 5,
                description: 'Short rides',
                vouchersSold: 28430
            },
            {
                id: 'uber-500',
                name: '₹500 Gift Card',
                originalPrice: 500,
                salePrice: 475,
                discountPercent: 5,
                description: 'Multiple trips',
                vouchersSold: 29120
            },
            {
                id: 'uber-1000',
                name: '₹1000 Gift Card',
                originalPrice: 1000,
                salePrice: 950,
                discountPercent: 5,
                description: 'Extended travel',
                vouchersSold: 13700
            }
        ]
    },
    {
        id: 'apollo',
        name: 'Apollo',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzAwODk3QiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+QTwvdGV4dD48L3N2Zz4=',
        category: 'Healthcare',
        description: 'Health and wellness products from trusted Apollo Pharmacy',
        vouchersSold: 76000,
        popularity: 23,
        variants: [
            {
                id: 'apollo-250',
                name: '₹250 Gift Card',
                originalPrice: 250,
                salePrice: 235.5,
                discountPercent: 5.8,
                description: 'Essential medicines',
                vouchersSold: 32100
            },
            {
                id: 'apollo-500',
                name: '₹500 Gift Card',
                originalPrice: 500,
                salePrice: 471,
                discountPercent: 5.8,
                description: 'Health supplements',
                vouchersSold: 31200
            },
            {
                id: 'apollo-1000',
                name: '₹1000 Gift Card',
                originalPrice: 1000,
                salePrice: 942,
                discountPercent: 5.8,
                description: 'Complete healthcare',
                vouchersSold: 12700
            }
        ]
    }
]

// Get all unique categories
export const getCategories = (): string[] => {
    const categories = brandsData.map(brand => brand.category)
    return ['All', ...Array.from(new Set(categories))]
}
