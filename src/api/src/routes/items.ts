import express, { Request, Response } from "express";
import { PagingQueryParams } from "./common";
import { Product } from "../models/product";
import { ProductRepository } from "../models/productRepository";

const router = express.Router({ mergeParams: true });

type ProductPathParams = {
    productId: string
}

/**
 * Gets a list of products
 */
router.get("/", async (req: Request<unknown, unknown, unknown, PagingQueryParams & { category?: string }>, res: Response) => {
    try {
        const repository = new ProductRepository();
        let products = await repository.findAll();

        // Filter by category if provided
        if (req.query.category) {
            products = products.filter((p: Product) => p.category === req.query.category);
        }

        // Apply pagination
        const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;
        const top = req.query.top ? parseInt(req.query.top as string) : 20;
        const paginatedProducts = products.slice(skip, skip + top);

        res.json(paginatedProducts);
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * Creates a new product
 */
router.post("/", async (req: Request<unknown, unknown, Product>, res: Response) => {
    try {
        const repository = new ProductRepository();
        const product = await repository.create(req.body);

        res.setHeader("location", `${req.protocol}://${req.get("Host")}/products/${product.id}`);
        res.status(201).json(product);
    } catch (err) {
        console.error("Error creating product:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * Gets a product with the specified ID
 */
router.get("/:productId", async (req: Request<ProductPathParams>, res: Response) => {
    try {
        const repository = new ProductRepository();
        const product = await repository.findById(req.params.productId);

        if (!product) {
            return res.status(404).send();
        }

        res.json(product);
    } catch (err) {
        console.error("Error fetching product:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * Updates a product with the specified ID
 */
router.put("/:productId", async (req: Request<ProductPathParams, unknown, Product>, res: Response) => {
    try {
        const repository = new ProductRepository();
        const updated = await repository.update(req.params.productId, req.body);

        if (!updated) {
            return res.status(404).send();
        }

        res.json(updated);
    } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * Deletes a product with the specified ID
 */
router.delete("/:productId", async (req: Request<ProductPathParams>, res: Response) => {
    try {
        const repository = new ProductRepository();
        const deleted = await repository.delete(req.params.productId);

        if (!deleted) {
            return res.status(404).send();
        }

        res.status(204).send();
    } catch (err) {
        console.error("Error deleting product:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;