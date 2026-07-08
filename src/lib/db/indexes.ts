import { connectDB } from "./connection";
import { logger } from "@/lib/utils/logger";

export async function ensureIndexes(): Promise<void> {
  try {
    await connectDB();
    const db = (await connectDB()).connection.db;
    if (!db) {
      throw new Error("Database not connected");
    }
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    const models = [
      "users",
      "categories",
      "suppliers",
      "products",
      "stockmovements",
      "inventoryhistories",
      "settings",
      "backuprecords",
    ];

    for (const modelName of models) {
      if (!collectionNames.includes(modelName)) {
        logger.info(`Collection ${modelName} does not exist, will be created on first use`);
      }
    }

    logger.info("Indexes ensured successfully");
  } catch (error) {
    logger.error("Failed to ensure indexes", { error: String(error) });
    throw error;
  }
}
