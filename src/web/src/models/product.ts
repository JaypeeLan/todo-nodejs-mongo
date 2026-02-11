export enum ProductStatus {
    Available = "Available",
    OutOfStock = "OutOfStock",
    Discontinued = "Discontinued"
}

export interface Product {
    id?: string
    name: string
    description: string
    price: number
    imageUrl: string
    stock: number
    category: string
    status: ProductStatus
    createdDate?: Date
    updatedDate?: Date
}