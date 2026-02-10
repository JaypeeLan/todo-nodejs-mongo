import { getTodoItemContainer } from "./cosmosClient";
import { Product, ProductStatus } from "./todoItem";
import { v4 as uuidv4 } from "uuid";

export class ProductRepository {
    private container = getTodoItemContainer();

    async findAll(): Promise<Product[]> {
        const querySpec = {
            query: "SELECT * FROM c"
        };

        const { resources } = await this.container.items.query(querySpec).fetchAll();
        return resources as Product[];
    }

    async findById(id: string): Promise<Product | null> {
        try {
            const { resource } = await this.container.item(id, id).read();
            return resource as Product || null;
        } catch (error: any) {
            if (error.code === 404) {
                return null;
            }
            throw error;
        }
    }

    async create(product: Partial<Product>): Promise<Product> {
        const id = uuidv4();
        const now = new Date();
        const newProduct: Product = {
            id,
            name: product.name || "",
            description: product.description || "",
            price: product.price || 0,
            imageUrl: product.imageUrl || "",
            stock: product.stock || 0,
            category: product.category || "General",
            status: product.status || ProductStatus.Available,
            createdDate: now,
            updatedDate: now,
        };

        const { resource } = await this.container.items.create(newProduct);
        if (!resource) {
            throw new Error("Failed to create product");
        }
        return resource as Product;
    }

    async update(id: string, product: Partial<Product>): Promise<Product | null> {
        const existing = await this.findById(id);
        if (!existing) {
            return null;
        }

        const updated: Product = {
            ...existing,
            ...product,
            id, // Ensure ID doesn't change
            updatedDate: new Date(),
        };

        const { resource } = await this.container.item(id, id).replace(updated);
        return resource as Product || null;
    }

    async delete(id: string): Promise<boolean> {
        try {
            await this.container.item(id, id).delete();
            return true;
        } catch (error: any) {
            if (error.code === 404) {
                return false;
            }
            throw error;
        }
    }

    async deleteByListId(_: string): Promise<void> {
        return Promise.resolve();
    }
}
