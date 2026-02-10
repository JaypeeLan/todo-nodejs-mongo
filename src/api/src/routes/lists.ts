import express, { Request, Response } from "express";

const router = express.Router({ mergeParams: true });

// Obsolete route for ecommerce transition
router.get("/", async (req: Request, res: Response) => {
    res.json([]);
});

export default router;