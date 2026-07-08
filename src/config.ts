export const config = {
  app: {
    name: process.env.APP_NAME || "InventoryManager",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
  db: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/inventory",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "fallback-secret-change-me-in-production",
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || "15m",
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || "7d",
  },
  upload: {
    dir: process.env.UPLOAD_DIR || "public/uploads",
    maxFileSize: Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024,
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
  },
  rateLimit: {
    window: Number(process.env.RATE_LIMIT_WINDOW) || 60000,
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
  },
  backup: {
    dir: process.env.BACKUP_DIR || "./backups",
  },
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
} as const;
