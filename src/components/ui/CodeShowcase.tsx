'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

/* ──────────────────────────────────────────────
   Custom Light Theme (VS Code–inspired)
   ────────────────────────────────────────────── */
const codeTheme: { [key: string]: React.CSSProperties } = {
  'code[class*="language-"]': { color: '#383a42' },
  'pre[class*="language-"]': { color: '#383a42' },
  comment: { color: '#a0a1a7', fontStyle: 'italic' },
  prolog: { color: '#a0a1a7' },
  doctype: { color: '#a0a1a7' },
  cdata: { color: '#a0a1a7' },
  punctuation: { color: '#383a42' },
  property: { color: '#e45649' },
  tag: { color: '#e45649' },
  boolean: { color: '#986801' },
  number: { color: '#986801' },
  constant: { color: '#986801' },
  symbol: { color: '#986801' },
  deleted: { color: '#e45649' },
  selector: { color: '#50a14f' },
  'attr-name': { color: '#986801' },
  string: { color: '#50a14f' },
  char: { color: '#50a14f' },
  builtin: { color: '#c18401' },
  inserted: { color: '#50a14f' },
  operator: { color: '#0184bc' },
  entity: { color: '#0184bc' },
  url: { color: '#0184bc' },
  'language-css .token.string': { color: '#0184bc' },
  'style .token.string': { color: '#0184bc' },
  atrule: { color: '#a626a4' },
  'attr-value': { color: '#50a14f' },
  keyword: { color: '#a626a4' },
  function: { color: '#4078f2' },
  'class-name': { color: '#c18401' },
  regex: { color: '#986801' },
  important: { color: '#a626a4', fontWeight: 'bold' as const },
  variable: { color: '#e45649' },
  bold: { fontWeight: 'bold' as const },
  italic: { fontStyle: 'italic' as const },
  'template-string': { color: '#50a14f' },
  'template-punctuation': { color: '#50a14f' },
  'function-variable': { color: '#4078f2' },
  parameter: { color: '#383a42' },
  interpolation: { color: '#e45649' },
  'punctuation.interpolation-punctuation': { color: '#e45649' },
};

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

interface Slide {
  heading: string;
  summary: string;
  code: string;
  language: string;
  filePath: string;
}

/* ──────────────────────────────────────────────
   Slide Data
   ────────────────────────────────────────────── */

const slides: Slide[] = [
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

/* ──────────────────────────────────────────────
   Copy Button
   ────────────────────────────────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may fail in insecure contexts */
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="flex items-center justify-center w-8 h-8 rounded-md transition-colors duration-200 cursor-pointer"
      style={{
        color: copied ? '#22c55e' : 'rgba(250,250,249,0.4)',
        backgroundColor: copied ? 'rgba(34,197,94,0.1)' : 'transparent',
      }}
      aria-label={copied ? 'Copied!' : 'Copy code'}
    >
      {copied ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}

/* ──────────────────────────────────────────────
   Summary Card (Left)
   ────────────────────────────────────────────── */

export function CodeSummary({ className = '' }: { className?: string }) {
  const { slide, activeIndex, goTo, goNext, goPrev } = useCarousel();

  return (
    <div
      className={`rounded-lg lg:rounded-xl p-5 lg:p-8 xl:p-10 flex flex-col justify-between ${className}`}
      style={{ backgroundColor: 'var(--color-foreground)' }}
    >
      {/* Top: heading + summary */}
      <div className="flex flex-col gap-3">
        <h3
          className="text-xs lg:text-[clamp(14px,0.8vw,18px)] uppercase font-medium tracking-wider"
          style={{ color: 'var(--color-muted)' }}
        >
          {slide.heading}
        </h3>
        <p
          className="text-[clamp(14px,1vw,20px)] font-medium leading-[1.4]"
          style={{ color: 'var(--color-background)' }}
        >
          {slide.summary}
        </p>
      </div>

      {/* Bottom: navigation */}
      <div className="flex flex-col gap-4">

        {/* Arrows + Dots */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={goPrev}
            disabled={activeIndex === 0}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer disabled:opacity-20 disabled:cursor-default hover:bg-white/10"
            aria-label="Previous slide"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(250,250,249,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="flex items-center gap-2.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${i === activeIndex
                  ? 'w-6'
                  : 'w-2 hover:bg-white/30'
                  }`}
                style={{
                  backgroundColor: i === activeIndex ? 'var(--color-background)' : 'rgba(250,250,249,0.15)'
                }}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === activeIndex ? 'true' : undefined}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={activeIndex === slides.length - 1}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer disabled:opacity-20 disabled:cursor-default hover:bg-white/10"
            aria-label="Next slide"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(250,250,249,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Code Snippet Card (Right) — macOS Window
   ────────────────────────────────────────────── */

export function CodeSnippet({ className = '' }: { className?: string }) {
  const { slide } = useCarousel();

  /* Turn file path into breadcrumb segments */
  const breadcrumb = slide.filePath.split('/');

  return (
    <div
      className={`rounded-lg lg:rounded-xl flex flex-col overflow-hidden ${className}`}
      style={{
        backgroundColor: 'var(--color-background)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 1px 6px rgba(0,0,0,0.08)',
      }}
    >
      {/* ── Title Bar ── */}
      <div
        className="flex items-center gap-3 px-4 py-2.5 flex-shrink-0"
        style={{ backgroundColor: 'var(--color-secondary)', borderBottom: '1px solid var(--color-secondary)' }}
      >
        {/* Traffic light buttons */}
        <div className="flex items-center gap-[6px] flex-shrink-0">
          <span className="w-[12px] h-[12px] rounded-full" style={{ backgroundColor: '#ff5f57' }} />
          <span className="w-[12px] h-[12px] rounded-full" style={{ backgroundColor: '#febc2e' }} />
          <span className="w-[12px] h-[12px] rounded-full" style={{ backgroundColor: '#28c840' }} />
        </div>

        {/* Breadcrumb path */}
        <div className="flex items-center gap-1 overflow-hidden">
          {breadcrumb.map((segment, i) => (
            <span key={i} className="flex items-center gap-1 flex-shrink-0">
              {i > 0 && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              )}
              <span
                className="text-[11px] lg:text-xs whitespace-nowrap"
                style={{
                  color: i === breadcrumb.length - 1 ? '#333' : '#888',
                  fontWeight: i === breadcrumb.length - 1 ? 600 : 400,
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                }}
              >
                {segment}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Code Content ── */}
      <div className="flex-1 overflow-y-auto min-h-0" data-lenis-prevent>
        <SyntaxHighlighter
          language={slide.language}
          style={codeTheme}
          customStyle={{
            margin: 0,
            padding: '1rem 1.5rem',
            borderRadius: 0,
            fontSize: 'clamp(12px, 0.75vw, 15px)',
            lineHeight: 1.75,
            fontWeight: 500,
            background: 'transparent',
            fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
            height: '100%',
          }}
          showLineNumbers
          lineNumberStyle={{
            minWidth: '2.5em',
            paddingRight: '1.25em',
            color: '#c0c0c0',
            fontStyle: 'normal',
            fontWeight: 450,
          }}
          codeTagProps={{
            style: { fontWeight: 450 },
          }}
        >
          {slide.code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Shared Carousel State (hook)
   Both cards share the same active slide index
   via a simple module-level state + listeners.
   ────────────────────────────────────────────── */

type Listener = () => void;
let _activeIndex = 0;
const _listeners = new Set<Listener>();

function setGlobalIndex(index: number) {
  const next = Math.max(0, Math.min(index, slides.length - 1));
  if (next === _activeIndex) return;
  _activeIndex = next;
  _listeners.forEach((fn) => fn());
}

function useCarousel() {
  const [activeIndex, setActiveIndex] = useState(_activeIndex);
  const touchStartX = useRef(0);

  useEffect(() => {
    const listener = () => setActiveIndex(_activeIndex);
    _listeners.add(listener);
    return () => { _listeners.delete(listener); };
  }, []);

  const goTo = useCallback((i: number) => setGlobalIndex(i), []);
  const goNext = useCallback(() => setGlobalIndex(_activeIndex + 1), []);
  const goPrev = useCallback(() => setGlobalIndex(_activeIndex - 1), []);

  /* Keyboard */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setGlobalIndex(_activeIndex + 1);
      if (e.key === 'ArrowLeft') setGlobalIndex(_activeIndex - 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeIndex]);

  return {
    slide: slides[activeIndex],
    activeIndex,
    goTo,
    goNext,
    goPrev,
    touchStartX,
  };
}
