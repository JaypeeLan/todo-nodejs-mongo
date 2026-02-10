export enum ProductStatus {
    Available = "available",
    OutOfStock = "outofstock",
    Discontinued = "discontinued"
}

export type Product = {
    id: string
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