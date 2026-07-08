import { connectDB } from "../src/lib/db/connection";
import { User } from "../src/lib/db/models/user.model";
import { Category } from "../src/lib/db/models/category.model";
import { Supplier } from "../src/lib/db/models/supplier.model";
import { Product } from "../src/lib/db/models/product.model";
import { Settings } from "../src/lib/db/models/settings.model";
import { hashPassword } from "../src/lib/auth/password";

async function seed() {
  console.log("Seeding database...");
  await connectDB();

  const existingUsers = await User.countDocuments();
  if (existingUsers > 0) {
    console.log("Database already has data. Skipping seed.");
    process.exit(0);
  }

  const hashedPassword = await hashPassword("password123");

  const user = await User.create({
    name: "Admin User",
    email: "admin@store.com",
    password: hashedPassword,
    role: "super_admin",
    isActive: true,
  });

  console.log("Created admin user: admin@store.com / password123");

  const categoryNames = [
    { name: "Beverages", description: "Drinks and beverages" },
    { name: "Snacks", description: "Chips, crackers, and snack foods" },
    { name: "Dairy", description: "Milk, cheese, yogurt, and dairy products" },
    { name: "Bakery", description: "Bread, pastries, and baked goods" },
    { name: "Vegetables", description: "Fresh vegetables" },
    { name: "Fruits", description: "Fresh fruits" },
    { name: "Frozen Food", description: "Frozen meals and ingredients" },
    { name: "Cleaning", description: "Cleaning supplies" },
    { name: "Cosmetics", description: "Beauty and personal care" },
    { name: "Spices", description: "Spices and seasonings" },
  ];

  const categories = await Category.insertMany(
    categoryNames.map((c, i) => ({
      name: c.name,
      slug: c.name.toLowerCase().replace(/\s+/g, "-"),
      description: c.description,
      sortOrder: i,
      isActive: true,
    })),
  );

  console.log(`Created ${categories.length} categories`);

  const supplierData = [
    { name: "Fresh Foods Co.", company: "Fresh Foods Corporation", email: "orders@freshfoods.com", phone: "+1-555-0101" },
    { name: "Global Distributors", company: "Global Distribution Inc.", email: "info@globaldist.com", phone: "+1-555-0102" },
    { name: "Premium Supplies", company: "Premium Supplies Ltd.", email: "sales@premiumsupplies.com", phone: "+1-555-0103" },
    { name: "Local Farmers Market", company: "Local Farmers Co-op", email: "hello@localfarmers.com", phone: "+1-555-0104" },
  ];

  const suppliers = await Supplier.insertMany(
    supplierData.map((s) => ({ ...s, isActive: true, productCount: 0 })),
  );

  console.log(`Created ${suppliers.length} suppliers`);

  const productData = [
    { name: "Organic Whole Milk", sku: "BEV-001", category: 0, supplier: 0, purchasePrice: 2.50, sellingPrice: 3.99, quantity: 50, minQuantity: 20 },
    { name: "Spring Water 500ml", sku: "BEV-002", category: 0, supplier: 1, purchasePrice: 0.50, sellingPrice: 1.29, quantity: 200, minQuantity: 50 },
    { name: "Potato Chips Classic", sku: "SNK-001", category: 1, supplier: 1, purchasePrice: 1.20, sellingPrice: 2.49, quantity: 100, minQuantity: 30 },
    { name: "Wheat Bread", sku: "BAK-001", category: 3, supplier: 0, purchasePrice: 1.80, sellingPrice: 3.49, quantity: 30, minQuantity: 15 },
    { name: "Cheddar Cheese Block", sku: "DRY-001", category: 2, supplier: 2, purchasePrice: 3.00, sellingPrice: 5.99, quantity: 25, minQuantity: 10 },
    { name: "Organic Bananas (lb)", sku: "FRT-001", category: 5, supplier: 3, purchasePrice: 0.40, sellingPrice: 0.89, quantity: 80, minQuantity: 40 },
    { name: "Mixed Salad Greens", sku: "VEG-001", category: 4, supplier: 3, purchasePrice: 1.50, sellingPrice: 3.99, quantity: 20, minQuantity: 15 },
    { name: "Frozen Pizza", sku: "FRZ-001", category: 6, supplier: 1, purchasePrice: 3.00, sellingPrice: 5.99, quantity: 40, minQuantity: 20 },
    { name: "All-Purpose Cleaner", sku: "CLN-001", category: 7, supplier: 2, purchasePrice: 2.00, sellingPrice: 4.49, quantity: 60, minQuantity: 20 },
    { name: "Hand Soap Refill", sku: "CLN-002", category: 7, supplier: 2, purchasePrice: 1.50, sellingPrice: 3.29, quantity: 45, minQuantity: 20 },
    { name: "Lip Balm", sku: "COS-001", category: 8, supplier: 2, purchasePrice: 0.80, sellingPrice: 2.49, quantity: 90, minQuantity: 30 },
    { name: "Ground Cinnamon", sku: "SPC-001", category: 9, supplier: 1, purchasePrice: 1.20, sellingPrice: 3.99, quantity: 35, minQuantity: 15 },
  ];

  const products = await Product.insertMany(
    productData.map((p) => ({
      name: p.name,
      sku: p.sku,
      category: categories[p.category]._id,
      supplier: suppliers[p.supplier]._id,
      purchasePrice: p.purchasePrice,
      sellingPrice: p.sellingPrice,
      quantity: p.quantity,
      minQuantity: p.minQuantity,
      status: "active",
      isActive: true,
    })),
  );

  for (const p of productData) {
    if (p.supplier !== undefined) {
      await Supplier.findByIdAndUpdate(suppliers[p.supplier]._id, { $inc: { productCount: 1 } });
    }
  }

  console.log(`Created ${products.length} products`);

  await Settings.create({
    storeName: "My Store",
    currency: "USD",
    currencySymbol: "$",
    taxRate: 0,
    lowStockThreshold: 10,
    timezone: "UTC",
    dateFormat: "MM/dd/yyyy",
    notifications: { lowStock: true, dailyReport: false },
    updatedBy: user._id,
  });

  console.log("Created default settings");
  console.log("\nSeed completed successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
