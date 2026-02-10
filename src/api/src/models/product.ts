import mongoose, { Schema, Document } from "mongoose";

export enum ProductStatus {
    Available = "Available",
    OutOfStock = "OutOfStock",
    Discontinued = "Discontinued"
}

export interface Product {
    id?: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    stock: number;
    category: string;
    status: ProductStatus;
    createdDate?: Date;
    updatedDate?: Date;
}

export interface IProduct extends Document, Omit<Product, 'id'> {
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, default: 0 },
    imageUrl: { type: String },
    stock: { type: Number, default: 0 },
    category: { type: String, default: "General" },
    status: { type: String, enum: Object.values(ProductStatus), default: ProductStatus.Available },
}, {
    timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' },
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        }
    }
});

export const ProductModel = mongoose.model<IProduct>("Product", ProductSchema);