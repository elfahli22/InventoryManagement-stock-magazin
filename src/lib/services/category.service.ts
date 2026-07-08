import { Category } from "@/lib/db/models/category.model";
import { connectDB } from "@/lib/db/connection";
import { NotFoundError, ConflictError } from "@/lib/api/api-error";
import { slugify } from "@/lib/utils/slug";

export const categoryService = {
  async list() {
    await connectDB();
    return Category.find({})
      .populate("parent", "name slug")
      .sort({ sortOrder: 1, name: 1 })
      .lean();
  },

  async getById(id: string) {
    await connectDB();
    const category = await Category.findById(id)
      .populate("parent", "name slug")
      .lean();
    if (!category) throw new NotFoundError("Category not found");
    return category;
  },

  async getBySlug(slug: string) {
    await connectDB();
    const category = await Category.findOne({ slug })
      .populate("parent", "name slug")
      .lean();
    if (!category) throw new NotFoundError("Category not found");
    return category;
  },

  async create(data: { name: string; description?: string; parent?: string; image?: string; sortOrder?: number }) {
    await connectDB();

    const slug = slugify(data.name);

    const existing = await Category.findOne({ slug });
    if (existing) throw new ConflictError("Category with this name already exists");

    if (data.parent) {
      const parent = await Category.findById(data.parent);
      if (!parent) throw new NotFoundError("Parent category not found");
    }

    return Category.create({
      ...data,
      slug,
      sortOrder: data.sortOrder || 0,
    });
  },

  async update(id: string, data: { name?: string; description?: string; parent?: string; image?: string; isActive?: boolean; sortOrder?: number }) {
    await connectDB();

    const category = await Category.findById(id);
    if (!category) throw new NotFoundError("Category not found");

    if (data.name && data.name !== category.name) {
      const newSlug = slugify(data.name);
      const existing = await Category.findOne({ slug: newSlug, _id: { $ne: id } });
      if (existing) throw new ConflictError("Category with this name already exists");
      data = { ...data, slug: newSlug } as typeof data;
    }

    if (data.parent) {
      if (data.parent === id) throw new ConflictError("Category cannot be its own parent");
      const parent = await Category.findById(data.parent);
      if (!parent) throw new NotFoundError("Parent category not found");
    }

    return Category.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate("parent", "name slug")
      .lean();
  },

  async delete(id: string) {
    await connectDB();
    const category = await Category.findById(id);
    if (!category) throw new NotFoundError("Category not found");

    const childrenCount = await Category.countDocuments({ parent: id });
    if (childrenCount > 0) {
      throw new ConflictError("Cannot delete category with subcategories");
    }

    await Category.findByIdAndDelete(id);
    return { deleted: true };
  },

  async getTree() {
    await connectDB();
    const categories = await Category.find({})
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    const map = new Map<string, typeof categories[0] & { children: typeof categories }>();
    const roots: (typeof categories[0] & { children: typeof categories })[] = [];

    for (const cat of categories) {
      map.set(cat._id.toString(), { ...cat, children: [] });
    }

    for (const cat of categories) {
      const id = cat._id.toString();
      const node = map.get(id)!;
      if (cat.parent && map.has(cat.parent.toString())) {
        map.get(cat.parent.toString())!.children.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  },
};
