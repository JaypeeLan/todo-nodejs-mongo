import { ActionResponse } from "./common";
import { ProductModel } from "./product";

export class ProductRepository {
    public async findAll(): Promise<any[]> {
        const products = await ProductModel.find();
        return products.map(p => p.toJSON());
    }

    public async findById(id: string): Promise<any | undefined> {
        const product = await ProductModel.findById(id);
        return product ? product.toJSON() : undefined;
    }

    public async create(item: any): Promise<any> {
        const product = new ProductModel(item);
        await product.save();
        return (product as any).toJSON();
    }

    public async update(id: string, item: any): Promise<any | undefined> {
        const product = await ProductModel.findByIdAndUpdate(id, item, { new: true });
        return product ? product.toJSON() : undefined;
    }

    public async delete(id: string): Promise<ActionResponse> {
        const result = await ProductModel.findByIdAndDelete(id);
        return {
            success: result !== null
        };
    }
}
