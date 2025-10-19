// This service layer will be replaced with actual API calls later
// For now, it uses mock data to simulate API responses

import { brandsData, Brand } from '../data/brandsData'

// Simulates an API call delay
const simulateApiDelay = (ms: number = 100) => 
    new Promise(resolve => setTimeout(resolve, ms))

// Cache for the API response to avoid multiple calls
let cachedBrands: Brand[] | null = null

// Single API call that fetches all brands data
// In production, this will be replaced with: fetch('/api/brands')
const fetchAllBrandsFromAPI = async (): Promise<Brand[]> => {
    // Return cached data if available
    if (cachedBrands) {
        return cachedBrands
    }

    await simulateApiDelay()
    
    // In production, replace with:
    // const response = await fetch('/api/brands')
    // const data = await response.json()
    // cachedBrands = data
    // return data
    
    cachedBrands = brandsData
    return brandsData
}

export const brandsService = {
    // Get all brands
    getAllBrands: async (): Promise<Brand[]> => {
        return fetchAllBrandsFromAPI()
    },

    // Get brands filtered by category (filtering done on frontend)
    getBrandsByCategory: async (category: string): Promise<Brand[]> => {
        const allBrands = await fetchAllBrandsFromAPI()
        
        if (category === 'All' || !category) {
            return allBrands
        }
        
        return allBrands.filter(brand => 
            brand.category.toLowerCase() === category.toLowerCase()
        )
    },

    // Get popular brands (sorted by popularity score - filtering done on frontend)
    getPopularBrands: async (limit: number = 6): Promise<Brand[]> => {
        const allBrands = await fetchAllBrandsFromAPI()
        
        return [...allBrands]
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, limit)
    },

    // Get single brand by ID (filtering done on frontend)
    getBrandById: async (brandId: string): Promise<Brand | null> => {
        const allBrands = await fetchAllBrandsFromAPI()
        
        const brand = allBrands.find(b => b.id === brandId)
        return brand || null
    },

    // Get all categories (extracted from brands data on frontend)
    getCategories: async (): Promise<string[]> => {
        const allBrands = await fetchAllBrandsFromAPI()
        const categories = allBrands.map(brand => brand.category)
        return ['All', ...Array.from(new Set(categories))]
    },

    // Search brands by name (filtering done on frontend)
    searchBrands: async (query: string): Promise<Brand[]> => {
        const allBrands = await fetchAllBrandsFromAPI()
        
        if (!query) {
            return allBrands
        }
        
        const lowerQuery = query.toLowerCase()
        return allBrands.filter(brand =>
            brand.name.toLowerCase().includes(lowerQuery) ||
            brand.description.toLowerCase().includes(lowerQuery)
        )
    },

    // Clear cache (useful for refreshing data)
    clearCache: () => {
        cachedBrands = null
    }
}

// When switching to production API, replace the entire service with:
/*
export const brandsService = {
    getAllBrands: async (): Promise<Brand[]> => {
        const response = await fetch('/api/brands')
        if (!response.ok) throw new Error('Failed to fetch brands')
        return response.json()
    },

    getBrandsByCategory: async (category: string): Promise<Brand[]> => {
        const allBrands = await brandsService.getAllBrands()
        if (category === 'All' || !category) return allBrands
        return allBrands.filter(brand => 
            brand.category.toLowerCase() === category.toLowerCase()
        )
    },

    getPopularBrands: async (limit: number = 6): Promise<Brand[]> => {
        const allBrands = await brandsService.getAllBrands()
        return [...allBrands]
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, limit)
    },

    getBrandById: async (brandId: string): Promise<Brand | null> => {
        const allBrands = await brandsService.getAllBrands()
        return allBrands.find(b => b.id === brandId) || null
    },

    getCategories: async (): Promise<string[]> => {
        const allBrands = await brandsService.getAllBrands()
        const categories = allBrands.map(brand => brand.category)
        return ['All', ...Array.from(new Set(categories))]
    },

    searchBrands: async (query: string): Promise<Brand[]> => {
        const allBrands = await brandsService.getAllBrands()
        if (!query) return allBrands
        const lowerQuery = query.toLowerCase()
        return allBrands.filter(brand =>
            brand.name.toLowerCase().includes(lowerQuery) ||
            brand.description.toLowerCase().includes(lowerQuery)
        )
    }
}
*/
