import { API_CONFIG } from '../config/api'
import { Brand, BrandsApiResponse } from '../types/brand'
import { tokenService } from './authService'

// Cache for the API response to avoid multiple calls
let cachedBrands: Brand[] | null = null

// Fetch all brands from API
const fetchAllBrandsFromAPI = async (): Promise<Brand[]> => {
    // Return cached data if available
    if (cachedBrands) {
        return cachedBrands
    }

    const token = tokenService.getAccessToken()
    
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BRANDS.ALL}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    })

    if (!response.ok) {
        throw new Error('Failed to fetch brands')
    }

    const result: BrandsApiResponse = await response.json()
    
    if (!result.success) {
        throw new Error('Failed to fetch brands')
    }

    cachedBrands = result.data
    return result.data
}

export const brandsService = {
    // Get all brands
    getAllBrands: async (): Promise<Brand[]> => {
        return fetchAllBrandsFromAPI()
    },

    // Get brands filtered by category
    getBrandsByCategory: async (category: string): Promise<Brand[]> => {
        const allBrands = await fetchAllBrandsFromAPI()
        
        if (category === 'All' || !category) {
            return allBrands
        }
        
        return allBrands.filter(brand => 
            brand.category.toLowerCase() === category.toLowerCase()
        )
    },

    // Get popular brands sorted by popularity score
    getPopularBrands: async (limit: number = 6): Promise<Brand[]> => {
        const allBrands = await fetchAllBrandsFromAPI()
        
        return [...allBrands]
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, limit)
    },

    // Get single brand by ID
    getBrandById: async (brandId: string): Promise<Brand | null> => {
        const allBrands = await fetchAllBrandsFromAPI()
        
        const brand = allBrands.find(b => b.id === brandId)
        return brand || null
    },

    // Get all categories
    getCategories: async (): Promise<string[]> => {
        const allBrands = await fetchAllBrandsFromAPI()
        const categories = allBrands.map(brand => brand.category)
        return ['All', ...Array.from(new Set(categories))]
    },

    // Search brands by name
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

    // Clear cache
    clearCache: () => {
        cachedBrands = null
    }
}
