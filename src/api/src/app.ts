import express, { Express } from "express";
import swaggerUI from "swagger-ui-express";
import cors from "cors";
import yaml from "yamljs";
import path from "path";
import fs from "fs";
import { getConfig } from "./config";
import lists from "./routes/lists";
import items from "./routes/items";
import { configureCosmos } from "./models/cosmosClient";
import { observability } from "./config/observability";

// Use API_ALLOW_ORIGINS env var with comma separated urls like
// `http://localhost:300, http://otherurl:100`
// Requests coming to the api server from other urls will be rejected as per
// CORS.
const allowOrigins = process.env.API_ALLOW_ORIGINS;

// Use NODE_ENV to change webConfiguration based on this value.
// For example, setting NODE_ENV=development disables CORS checking,
// allowing all origins.
const environment = process.env.NODE_ENV;

const originList = (): string[] | string => {

    if (environment && environment === "development") {
        console.log(`Allowing requests from any origins. NODE_ENV=${environment}`);
        return "*";
    }

    const origins = [
        "https://portal.azure.com",
        "https://ms.portal.azure.com",
    ];

    if (allowOrigins && allowOrigins !== "") {
        allowOrigins.split(",").forEach(origin => {
            origins.push(origin);
        });
    }

    return origins;
};

export const createApp = async (): Promise<Express> => {
    const config = await getConfig();
    const app = express();

    // Configuration
    observability(config.observability);
    await configureCosmos(config.database);
    // Middleware
    app.use(express.json());

    app.get("/health", (req, res) => res.status(200).send("OK"));

    app.use(cors({
        origin: originList()
    }));

    // API Routes
    app.use("/products", items);

    // Swagger UI
    try {
        const swaggerPath = path.join(__dirname, "../openapi.yaml");
        if (fs.existsSync(swaggerPath)) {
            const swaggerDocument = yaml.load(swaggerPath);
            app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
        } else {
            console.warn("Swagger spec NOT found at:", swaggerPath);
        }
    } catch (err) {
        console.error("Failed to load swagger UI:", err);
    }

    // Serve Static Files
    const publicPath = path.join(__dirname, "../public");
    if (fs.existsSync(publicPath)) {
        app.use(express.static(publicPath));
        app.get("*", (req, res) => {
            const indexPath = path.join(publicPath, "index.html");
            if (fs.existsSync(indexPath)) {
                res.sendFile(indexPath);
            } else {
                res.status(404).send("Frontend not found");
            }
        });
    }

    return app;
};
