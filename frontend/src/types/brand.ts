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
    logo: string
    category: string
    description: string
    vouchersSold: number
    popularity: number
    variants: BrandVariant[]
}

export interface BrandsApiResponse {
    success: boolean
    count: number
    data: Brand[]
}

