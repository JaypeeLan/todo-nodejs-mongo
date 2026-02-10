import { ActionResponse } from "./common";
import { ProductModel } from "./product";

export class ProductRepository {
    public async findAll(): Promise<any[]> {
        return await ProductModel.find().lean();
    }

    public async findById(id: string): Promise<any | undefined> {
        return await ProductModel.findById(id).lean();
    }

    public async create(item: any): Promise<any> {
        const product = new ProductModel(item);
        await product.save();
        return (product as any).toJSON();
    }

    public async update(id: string, item: any): Promise<any | undefined> {
        return await ProductModel.findByIdAndUpdate(id, item, { new: true }).lean();
    }

    public async delete(id: string): Promise<ActionResponse> {
        const result = await ProductModel.findByIdAndDelete(id);
        return {
            success: result !== null
        };
    }
}
