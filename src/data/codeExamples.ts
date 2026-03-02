export interface CodeSlide {
  heading: string;
  summary: string;
  code: string;
  language: string;
  filePath: string;
}

export const codeSlides: CodeSlide[] = [
  {
    heading: 'Type-Safe Filtering with Drizzle ORM',
    summary: 'Composable WHERE clauses with full type safety — no N+1 queries, SQL injection protected, scales without refactoring.',
    code: `function buildWhereConditions(filters: ProductFilters): SQL[] {
  const conditions: SQL[] = [];

  // Always filter for published products
  conditions.push(eq(products.isPublished, true));

  // Search filter with type-safe ILIKE
  if (filters.search) {
    const searchTerm = \`%\${filters.search}%\`;
    conditions.push(
      or(
        ilike(products.name, searchTerm),
        ilike(products.description, searchTerm)
      )!
    );
  }

  // Gender filter
  if (filters.gender.length > 0) {
    const genderConditions = db
      .select({ id: genders.id })
      .from(genders)
      .where(inArray(genders.slug, filters.gender));

    conditions.push(
      inArray(products.genderId, genderConditions)
    );
  }

  // Brand filter
  if (filters.brand.length > 0) {
    const brandConditions = db
      .select({ id: brands.id })
      .from(brands)
      .where(inArray(brands.slug, filters.brand));

    conditions.push(
      inArray(products.brandId, brandConditions)
    );
  }

  // Category filter
  if (filters.category.length > 0) {
    const categoryConditions = db
      .select({ id: categories.id })
      .from(categories)
      .where(inArray(categories.slug, filters.category));

    conditions.push(
      inArray(products.categoryId, categoryConditions)
    );
  }

  // Color filter - subquery with EXISTS for many-to-many
  if (filters.color.length > 0) {
    const colorIds = db
      .select({ id: colors.id })
      .from(colors)
      .where(inArray(colors.slug, filters.color));

    conditions.push(
      sql\`EXISTS (
        SELECT 1 FROM \${productVariants}
        WHERE \${productVariants.productId} = \${products.id}
        AND \${productVariants.colorId} IN \${colorIds}
      )\`
    );
  }

  // Size filter - similar pattern
  if (filters.size.length > 0) {
    const sizeIds = db
      .select({ id: sizes.id })
      .from(sizes)
      .where(inArray(sizes.slug, filters.size));

    conditions.push(
      sql\`EXISTS (
        SELECT 1 FROM \${productVariants}
        WHERE \${productVariants.productId} = \${products.id}
        AND \${productVariants.sizeId} IN \${sizeIds}
      )\`
    );
  }

  return conditions;
}`,
    language: 'typescript',
    filePath: 'src/lib/actions/product.ts',
  },
  {
    heading: 'Type-Safe SQL Aggregations with Template Literals',
    summary: 'Database-level aggregations with typed SQL template literals — MIN, MAX, COUNT, and CASE all inferred at compile time, zero post-processing.',
    code: `const productsQuery = db
  .select({
    id: products.id,
    name: products.name,
    categoryName: categories.name,
    brandName: brands.name,
    genderLabel: genders.label,
    // Type-safe SQL aggregations with explicit types
    minPrice: sql<string>\`MIN(CAST(\${productVariants.price} AS DECIMAL))\`,
    maxPrice: sql<string>\`MAX(CAST(\${productVariants.price} AS DECIMAL))\`,
    hasSalePrice: sql<boolean>\`MAX(CASE WHEN \${productVariants.salePrice} IS NOT NULL THEN 1 ELSE 0 END) = 1\`,
    minSalePrice: sql<string>\`MIN(CAST(\${productVariants.salePrice} AS DECIMAL))\`,
    minEffectivePrice: sql<string>\`MIN(CAST(COALESCE(\${productVariants.salePrice}, \${productVariants.price}) AS DECIMAL))\`,
    colorCount: sql<number>\`COUNT(DISTINCT \${productVariants.colorId})\`,
  })
  .from(products)
  .leftJoin(categories, eq(products.categoryId, categories.id))
  .leftJoin(brands, eq(products.brandId, brands.id))
  .leftJoin(genders, eq(products.genderId, genders.id))
  .leftJoin(productVariants, eq(products.id, productVariants.productId))
  .where(and(...whereConditions))
  .groupBy(
    products.id,
    products.name,
    products.categoryId,
    products.brandId,
    products.genderId,
    products.createdAt,
    categories.name,
    brands.name,
    genders.label
  )
  .orderBy(buildOrderBy(filters.sort))
  .limit(limit)
  .offset(offset);`,
    language: 'typescript',
    filePath: 'src/lib/actions/product.ts',
  },
  {
    heading: 'Zod Schema Validation with Type Inference',
    summary: 'Zod schemas as the single source of truth — runtime validation and TypeScript types generated from one definition, no manual syncing.',
    code: `import { z } from "zod";

export const deliveryAddressSchema = z.object({
  name: z.string().min(1, "Name is required"),
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().min(1, "Phone number is required"),
});

export const createOrderSchema = z.object({
  deliveryAddress: deliveryAddressSchema,
  deliveryMethod: z.enum(["standard", "express"]),
  paymentMethod: z.string().min(1, "Payment method is required"),
  guestEmail: z.string().email().optional(),
  createAccount: z.boolean().optional(),
});

// Type automatically inferred from schema - no manual typing needed!
export type CreateOrderInput = z.infer<typeof createOrderSchema>;

// Usage in server action:
export async function createOrder(data: CreateOrderInput) {
  // Validate with automatic error messages
  const validated = createOrderSchema.parse(data);
  
  // 'validated' is now fully typed without manual definitions
  console.log(validated.deliveryAddress.city); // \u2705 TypeScript knows this exists
  console.log(validated.deliveryMethod);       // \u2705 Type: "standard" | "express"
}`,
    language: 'typescript',
    filePath: 'src/lib/validations/order.ts',
  },
];
