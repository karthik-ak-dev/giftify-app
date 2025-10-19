// Types for Orders Data
export interface VoucherCode {
    code: string
    pin: string
}

export interface VoucherGroup {
    brandName: string
    brandLogo: string
    variantValue: number
    vouchers: VoucherCode[]
}

export interface Order {
    orderId: string
    date: string
    items: number
    total: number
    status: 'Completed' | 'Processing' | 'Failed' | 'Cancelled'
    vouchers: VoucherGroup[]
}

// Mock Orders Data - Will be replaced by API
export const ordersData: Order[] = [
    {
        orderId: 'ORD-001',
        date: '2025-10-15',
        items: 3,
        total: 1470,
        status: 'Completed',
        vouchers: [
            {
                brandName: 'Zepto',
                brandLogo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzhCMkNBMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+WjwvdGV4dD48L3N2Zz4=',
                variantValue: 500,
                vouchers: [
                    { code: 'ZEPTO-5K7M-9N2P-4X8Q', pin: '1234' },
                    { code: 'ZEPTO-3L6H-8J9K-2M5N', pin: '5678' }
                ]
            },
            {
                brandName: 'KFC',
                brandLogo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0U0MDAyQiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+SzwvdGV4dD48L3N2Zz4=',
                variantValue: 250,
                vouchers: [
                    { code: 'KFC-8X2B-5N9M-7Q3P', pin: '9012' }
                ]
            }
        ]
    },
    {
        orderId: 'ORD-002',
        date: '2025-10-18',
        items: 1,
        total: 490,
        status: 'Completed',
        vouchers: [
            {
                brandName: 'Zepto',
                brandLogo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzhCMkNBMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+WjwvdGV4dD48L3N2Zz4=',
                variantValue: 500,
                vouchers: [
                    { code: 'ZEPTO-1A4B-7C8D-9E2F', pin: '3456' }
                ]
            }
        ]
    },
    {
        orderId: 'ORD-003',
        date: '2025-10-10',
        items: 2,
        total: 980,
        status: 'Completed',
        vouchers: [
            {
                brandName: 'Amazon',
                brandLogo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0ZGOTkwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IiMxRjI5MzciIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSJib2xkIj5BPC90ZXh0Pjwvc3ZnPg==',
                variantValue: 1000,
                vouchers: [
                    { code: 'AMZN-X9Y2-Z3A4-B5C6', pin: '7890' }
                ]
            }
        ]
    },
    {
        orderId: 'ORD-004',
        date: '2025-10-08',
        items: 4,
        total: 1920,
        status: 'Completed',
        vouchers: [
            {
                brandName: 'Flipkart',
                brandLogo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzIxNzRGMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+RjwvdGV4dD48L3N2Zz4=',
                variantValue: 500,
                vouchers: [
                    { code: 'FLIP-K1L2-M3N4-O5P6', pin: '1111' },
                    { code: 'FLIP-Q7R8-S9T0-U1V2', pin: '2222' }
                ]
            },
            {
                brandName: 'Swiggy',
                brandLogo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0ZGNTIwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+UzwvdGV4dD48L3N2Zz4=',
                variantValue: 200,
                vouchers: [
                    { code: 'SWIG-W3X4-Y5Z6-A7B8', pin: '3333' },
                    { code: 'SWIG-C9D0-E1F2-G3H4', pin: '4444' }
                ]
            }
        ]
    },
    {
        orderId: 'ORD-005',
        date: '2025-10-05',
        items: 1,
        total: 245,
        status: 'Completed',
        vouchers: [
            {
                brandName: 'Starbucks',
                brandLogo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzAwNzA0QSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+UzwvdGV4dD48L3N2Zz4=',
                variantValue: 250,
                vouchers: [
                    { code: 'STAR-I5J6-K7L8-M9N0', pin: '5555' }
                ]
            }
        ]
    }
]

