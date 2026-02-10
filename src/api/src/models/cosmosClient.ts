import mongoose from "mongoose";
import { DatabaseConfig } from "../config/appConfig";
import { logger } from "../config/observability";
import { ProductModel } from "./product";
import { seedProducts } from "./seedData";

export const configureCosmos = async (config: DatabaseConfig) => {
    // Skip configuration in test environment
    if (process.env.NODE_ENV === "test") {
        logger.info("Skipping Database configuration in test environment");
        return;
    }

    try {
        const connectionString = config.connectionString;

        if (!connectionString) {
            logger.warn("No MONGODB_URI or AZURE_COSMOS_CONNECTION_STRING found. Falling back to local MongoDB.");
        }

        const uri = connectionString || "mongodb://localhost:27017/Todo";

        logger.info(`Connecting to MongoDB at ${uri.replace(/:([^:@]{1,})@/, ":****@")}...`);

        await mongoose.connect(uri, {
            dbName: config.databaseName || "Todo"
        });

        logger.info("MongoDB connected successfully!");

        // Seed database
        await seedDatabase();

    } catch (err) {
        logger.error(`MongoDB connection error: ${err}`);
        logger.error("The application will continue to run, but database operations will fail.");
    }
};

const seedDatabase = async () => {
    try {
        const count = await ProductModel.countDocuments();
        if (count === 0) {
            logger.info("No products found in database. Seeding initial data...");
            await ProductModel.insertMany(seedProducts);
            logger.info(`Successfully seeded ${seedProducts.length} products.`);
        } else {
            logger.info(`Database already contains ${count} products. Skipping seed.`);
        }
    } catch (err) {
        logger.error(`Failed to seed database: ${err}`);
    }
};

export const getTodoItemContainer = () => {
    // This is a dummy for now to avoid breaking imports during refactor
    return null;
};