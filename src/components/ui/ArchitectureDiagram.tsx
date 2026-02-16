'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

/* ─── Types ─── */
interface Field { name: string; type: string; pk?: boolean; fk?: string; }
interface TableDef { pos: { x: number; y: number }; fields: Field[]; }

/* ─── Constants ─── */
const TW = 220;   // table width
const HH = 37;    // header height
const FH = 28;    // field row height
const BP = 3;     // body top padding

/* ─── Schema ─── */
const schema: Record<string, TableDef> = {
  verification: {
    pos: { x: 30, y: 30 },
    fields: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'identifier', type: 'text' },
      { name: 'value', type: 'text' },
      { name: 'expires_at', type: 'timestamp' },
      { name: 'created_at', type: 'timestamp' },
    ],
  },
  coupons: {
    pos: { x: 330, y: 30 },
    fields: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'code', type: 'text' },
      { name: 'discount_type', type: 'enum' },
      { name: 'discount_value', type: 'numeric(10,2)' },
      { name: 'min_purchase_amount', type: 'numeric(10,2)' },
      { name: 'max_uses', type: 'integer' },
      { name: 'current_uses', type: 'integer' },
      { name: 'valid_from', type: 'timestamp' },
      { name: 'valid_until', type: 'timestamp' },
      { name: 'is_active', type: 'boolean' },
      { name: 'created_at', type: 'timestamp' },
    ],
  },
  user: {
    pos: { x: 630, y: 30 },
    fields: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'name', type: 'text' },
      { name: 'email', type: 'text' },
      { name: 'email_verified', type: 'boolean' },
      { name: 'image', type: 'text' },
      { name: 'created_at', type: 'timestamp' },
      { name: 'updated_at', type: 'timestamp' },
    ],
  },
  account: {
    pos: { x: 930, y: 30 },
    fields: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'user_id', type: 'uuid', fk: 'user.id' },
      { name: 'guest_id', type: 'uuid' },
      { name: 'provider_id', type: 'text' },
      { name: 'access_token', type: 'text' },
      { name: 'refresh_token', type: 'text' },
      { name: 'expires_at', type: 'timestamp' },
      { name: 'created_at', type: 'timestamp' },
    ],
  },
  guest: {
    pos: { x: 630, y: 330 },
    fields: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'session_id', type: 'uuid' },
      { name: 'created_at', type: 'timestamp' },
    ],
  },
  session: {
    pos: { x: 930, y: 360 },
    fields: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'user_id', type: 'uuid', fk: 'user.id' },
      { name: 'expires_at', type: 'timestamp' },
      { name: 'token', type: 'text' },
      { name: 'ip_address', type: 'text' },
      { name: 'user_agent', type: 'text' },
      { name: 'created_at', type: 'timestamp' },
    ],
  },
  genders: {
    pos: { x: 330, y: 440 },
    fields: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'label', type: 'text' },
      { name: 'slug', type: 'text' },
    ],
  },
  brands: {
    pos: { x: 330, y: 620 },
    fields: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'name', type: 'text' },
      { name: 'slug', type: 'text' },
      { name: 'logo_url', type: 'text' },
    ],
  },
  categories: {
    pos: { x: 330, y: 830 },
    fields: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'name', type: 'text' },
      { name: 'slug', type: 'text' },
      { name: 'description', type: 'text' },
      { name: 'parent_id', type: 'uuid' },
    ],
  },
  colors: {
    pos: { x: 330, y: 1060 },
    fields: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'name', type: 'text' },
      { name: 'slug', type: 'text' },
      { name: 'hex_code', type: 'text' },
    ],
  },
  sizes: {
    pos: { x: 330, y: 1260 },
    fields: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'name', type: 'text' },
      { name: 'slug', type: 'text' },
      { name: 'sort_order', type: 'integer' },
    ],
  },
  collections: {
    pos: { x: 330, y: 1460 },
    fields: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'name', type: 'text' },
      { name: 'slug', type: 'text' },
      { name: 'description', type: 'text' },
      { name: 'is_active', type: 'boolean' },
      { name: 'created_at', type: 'timestamp' },
    ],
  },
  addresses: {
    pos: { x: 930, y: 660 },
    fields: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'user_id', type: 'uuid', fk: 'user.id' },
      { name: 'type', type: 'text' },
      { name: 'address_type', type: 'text' },
      { name: 'first_name', type: 'text' },
      { name: 'last_name', type: 'text' },
      { name: 'street', type: 'text' },
      { name: 'city', type: 'text' },
      { name: 'state', type: 'text' },
      { name: 'postal_code', type: 'text' },
      { name: 'phone', type: 'text' },
      { name: 'is_default', type: 'boolean' },
      { name: 'created_at', type: 'timestamp' },
      { name: 'updated_at', type: 'timestamp' },
    ],
  },
  carts: {
    pos: { x: 630, y: 700 },
    fields: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'user_id', type: 'uuid', fk: 'user.id' },
      { name: 'guest_id', type: 'uuid', fk: 'guest.id' },
      { name: 'created_at', type: 'timestamp' },
      { name: 'updated_at', type: 'timestamp' },
    ],
  },
  products: {
    pos: { x: 630, y: 960 },
    fields: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'name', type: 'text' },
      { name: 'description', type: 'text' },
      { name: 'category_id', type: 'uuid', fk: 'categories.id' },
      { name: 'gender_id', type: 'uuid', fk: 'genders.id' },
      { name: 'brand_id', type: 'uuid', fk: 'brands.id' },
      { name: 'is_published', type: 'boolean' },
      { name: 'default_variant_id', type: 'uuid' },
      { name: 'created_at', type: 'timestamp' },
      { name: 'updated_at', type: 'timestamp' },
    ],
  },
  orders: {
    pos: { x: 1230, y: 30 },
    fields: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'user_id', type: 'uuid', fk: 'user.id' },
      { name: 'guest_email', type: 'text' },
      { name: 'status', type: 'enum' },
      { name: 'order_status', type: 'enum' },
      { name: 'shipping_price', type: 'numeric(10,2)' },
      { name: 'total_amount', type: 'numeric(10,2)' },
      { name: 'delivery_method', type: 'text' },
      { name: 'payment_method', type: 'text' },
      { name: 'delivery_address', type: 'json' },
      { name: 'shipping_address_id', type: 'uuid', fk: 'addresses.id' },
      { name: 'billing_address_id', type: 'uuid', fk: 'addresses.id' },
      { name: 'created_at', type: 'timestamp' },
      { name: 'updated_at', type: 'timestamp' },
    ],
  },
  reviews: {
    pos: { x: 1230, y: 530 },
    fields: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'product_id', type: 'uuid', fk: 'products.id' },
      { name: 'user_id', type: 'uuid', fk: 'user.id' },
      { name: 'rating', type: 'integer' },
      { name: 'title', type: 'text' },
      { name: 'content', type: 'text' },
      { name: 'is_verified_purchase', type: 'boolean' },
      { name: 'updated_at', type: 'timestamp' },
    ],
  },
  product_variants: {
    pos: { x: 1230, y: 840 },
    fields: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'product_id', type: 'uuid', fk: 'products.id' },
      { name: 'sku', type: 'text' },
      { name: 'color_id', type: 'uuid', fk: 'colors.id' },
      { name: 'size_id', type: 'uuid', fk: 'sizes.id' },
      { name: 'price', type: 'numeric(10,2)' },
      { name: 'sale_price', type: 'numeric(10,2)' },
      { name: 'in_stock', type: 'boolean' },
      { name: 'weight', type: 'numeric' },
      { name: 'dimensions', type: 'text' },
      { name: 'created_at', type: 'timestamp' },
      { name: 'updated_at', type: 'timestamp' },
    ],
  },
  product_collections: {
    pos: { x: 1230, y: 1270 },
    fields: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'product_id', type: 'uuid', fk: 'products.id' },
      { name: 'collection_id', type: 'uuid', fk: 'collections.id' },
      { name: 'sort_order', type: 'integer' },
      { name: 'created_at', type: 'timestamp' },
    ],
  },
  payments: {
    pos: { x: 1530, y: 30 },
    fields: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'order_id', type: 'uuid', fk: 'orders.id' },
      { name: 'amount', type: 'numeric(10,2)' },
      { name: 'method', type: 'text' },
      { name: 'status', type: 'enum' },
      { name: 'created_at', type: 'timestamp' },
    ],
  },
  order_items: {
    pos: { x: 1530, y: 300 },
    fields: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'order_id', type: 'uuid', fk: 'orders.id' },
      { name: 'product_variant_id', type: 'uuid', fk: 'product_variants.id' },
      { name: 'quantity', type: 'integer' },
      { name: 'price_at_purchase', type: 'numeric(10,2)' },
    ],
  },
  wishlists: {
    pos: { x: 1530, y: 530 },
    fields: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'product_id', type: 'uuid', fk: 'products.id' },
      { name: 'variant_id', type: 'uuid', fk: 'product_variants.id' },
      { name: 'created_at', type: 'timestamp' },
    ],
  },
  product_images: {
    pos: { x: 1530, y: 720 },
    fields: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'product_id', type: 'uuid', fk: 'products.id' },
      { name: 'url', type: 'text' },
      { name: 'sort_order', type: 'integer' },
      { name: 'is_primary', type: 'boolean' },
    ],
  },
  cart_items: {
    pos: { x: 1530, y: 930 },
    fields: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'cart_id', type: 'uuid', fk: 'carts.id' },
      { name: 'product_variant_id', type: 'uuid', fk: 'product_variants.id' },
      { name: 'quantity', type: 'integer' },
    ],
  },
};

/* ─── Connection builder ─── */
function fieldY(table: TableDef, fieldIdx: number) {
  return table.pos.y + HH + BP + fieldIdx * FH + FH / 2;
}

function getConnections() {
  // 1. Build raw connections
  const raw: { fromX: number; fromY: number; toX: number; toY: number }[] = [];
  for (const tableData of Object.values(schema)) {
    for (const field of tableData.fields) {
      if (!field.fk) continue;
      const [tgt, tgtField] = field.fk.split('.');
      const target = schema[tgt];
      if (!target) continue;
      const fi = tableData.fields.indexOf(field);
      const ti = target.fields.findIndex((f) => f.name === tgtField);
      if (ti === -1) continue;

      const srcCx = tableData.pos.x + TW / 2;
      const tgtCx = target.pos.x + TW / 2;

      let fromX: number, toX: number;
      if (srcCx <= tgtCx) {
        fromX = tableData.pos.x + TW;
        toX = target.pos.x;
      } else {
        fromX = tableData.pos.x;
        toX = target.pos.x + TW;
      }
      raw.push({ fromX, fromY: fieldY(tableData, fi), toX, toY: fieldY(target, ti) });
    }
  }

  // Helper: for a group of N items, return the offset for index i, centered around 0
  const S = 6; // spacing in px
  const spread = (i: number, n: number) => (i - (n - 1) / 2) * S;

  // 2. Offset shared source points (same fromX+fromY → horizontal exit lines overlap)
  const srcKey = (c: typeof raw[0]) => `${c.fromX}:${c.fromY}`;
  const srcGroups: Record<string, number[]> = {};
  raw.forEach((c, i) => { const k = srcKey(c); (srcGroups[k] ??= []).push(i); });

  // 3. Offset shared target points (same toX+toY → horizontal entry lines overlap)
  const tgtKey = (c: typeof raw[0]) => `${c.toX}:${c.toY}`;
  const tgtGroups: Record<string, number[]> = {};
  raw.forEach((c, i) => { const k = tgtKey(c); (tgtGroups[k] ??= []).push(i); });

  // 4. Offset shared vertical corridors (same column gap → vertical lines overlap)
  const corKey = (c: typeof raw[0]) => `${Math.min(c.fromX, c.toX)}:${Math.max(c.fromX, c.toX)}`;
  const corGroups: Record<string, number[]> = {};
  raw.forEach((c, i) => { const k = corKey(c); (corGroups[k] ??= []).push(i); });

  return raw.map((c, i) => {
    // Source Y offset
    const sg = srcGroups[srcKey(c)];
    const fromYOff = sg.length > 1 ? spread(sg.indexOf(i), sg.length) : 0;

    // Target Y offset
    const tg = tgtGroups[tgtKey(c)];
    const toYOff = tg.length > 1 ? spread(tg.indexOf(i), tg.length) : 0;

    // Corridor X offset
    const cg = corGroups[corKey(c)];
    const midXOff = cg.length > 1 ? spread(cg.indexOf(i), cg.length) : 0;

    return {
      fromX: c.fromX,
      fromY: c.fromY + fromYOff,
      toX: c.toX,
      toY: c.toY + toYOff,
      midX: (c.fromX + c.toX) / 2 + midXOff,
    };
  });
}

/* ─── Theme ─── */
const t = {
  bg: '#FAFAF9',
  gridLine: 'rgba(23,23,23,0.06)',
  tableBg: 'linear-gradient(135deg,#fff,#F5F5F4)',
  tableBorder: '#E5E5E5',
  tableShadow: '0 4px 20px rgba(0,0,0,0.08),0 0 0 1px rgba(0,0,0,0.04)',
  headerBg: 'linear-gradient(135deg,#292524,#171717)',
  headerBorder: '#171717',
  headerColor: '#FAFAF9',
  fieldText: '#171717',
  fieldType: '#9F9FA9',
  fieldBorder: 'rgba(0,0,0,0.06)',
  pkBg: 'rgba(255,215,0,0.08)',
  connStroke: 'rgba(23,23,23,0.2)',
  connDot: 'rgba(23,23,23,0.35)',
  controlBg: 'rgba(0,0,0,0.04)',
  controlBorder: 'rgba(0,0,0,0.1)',
  controlBtn: 'rgba(0,0,0,0.07)',
  controlText: 'rgba(0,0,0,0.55)',
  controlIcon: '#171717',
  overlayBg: 'rgba(250,250,249,0.5)',
  overlayText: 'rgba(23,23,23,0.85)',
};

/* ─── Component ─── */
export default function ArchitectureDiagram({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.7);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const start = useRef({ x: 0, y: 0 });
  const tRef = useRef({ x: 0, y: 0 });

  useEffect(() => { tRef.current = translate; }, [translate]);

  // Centre on mount
  useEffect(() => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const s = 0.7;
    setTranslate({ x: width / 2 - 880 * s, y: height / 2 - 500 * s });
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    setHasInteracted(true);
    start.current = { x: e.clientX - tRef.current.x, y: e.clientY - tRef.current.y };
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch { /* synthetic events have no active pointer */ }
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    setTranslate({ x: e.clientX - start.current.x, y: e.clientY - start.current.y });
  }, [isDragging]);

  const onPointerUp = useCallback(() => setIsDragging(false), []);

  const applyZoom = useCallback((delta: number) => {
    setScale((prev) => {
      const next = Math.min(Math.max(0.2, prev + delta), 3);
      if (!containerRef.current) return next;
      const r = containerRef.current.getBoundingClientRect();
      const cx = r.width / 2, cy = r.height / 2;
      setTranslate((t) => ({
        x: cx - (cx - t.x) * (next / prev),
        y: cy - (cy - t.y) * (next / prev),
      }));
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setScale(0.7);
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    setTranslate({ x: width / 2 - 880 * 0.7, y: height / 2 - 500 * 0.7 });
  }, []);

  const connections = getConnections();
  const tf = `translate(${translate.x}px,${translate.y}px) scale(${scale})`;

  return (
    <div
      ref={containerRef}
      className={className}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: 'relative', overflow: 'hidden', background: t.bg,
        cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'pan-y',
        userSelect: 'none', transition: 'background 0.35s ease',
      }}
    >
      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.10, pointerEvents: 'none',
        backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`,
        backgroundSize: '50px 50px',
      }} />

      {/* Controls – vertical strip, centered on right edge */}
      <div
        onPointerDown={(e) => e.stopPropagation()}
        style={{
          position: 'absolute', top: '50%', right: 16, transform: 'translateY(-50%)',
          zIndex: 10, display: 'flex', flexDirection: 'column', gap: 6,
          background: t.controlBg, backdropFilter: 'blur(10px)',
          padding: 6, borderRadius: 12, border: `1px solid ${t.controlBorder}`,
        }}
      >
        <button onClick={() => applyZoom(0.15)} style={{ ...btnBase, background: t.controlBtn, color: t.controlIcon }}>+</button>
        <span style={{ padding: '6px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.controlText, fontSize: 11, fontWeight: 500 }}>
          {Math.round(scale * 100)}%
        </span>
        <button onClick={() => applyZoom(-0.15)} style={{ ...btnBase, background: t.controlBtn, color: t.controlIcon }}>−</button>
      </div>

      {/* SVG connections */}
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'visible', transformOrigin: '0 0', transform: tf }}>
        <style>{`@keyframes ad{to{stroke-dashoffset:-100}}`}</style>
        {connections.map((c, i) => {
          return (
            <g key={i}>
              <path
                d={`M${c.fromX} ${c.fromY} H${c.midX} V${c.toY} H${c.toX}`}
                stroke={t.connStroke} strokeWidth={1.5} fill="none"
                strokeDasharray="5 3" style={{ animation: 'ad 20s linear infinite', transition: 'stroke 0.35s ease' }}
              />
              <circle cx={c.fromX} cy={c.fromY} r={3} fill={t.connDot} />
              <circle cx={c.toX} cy={c.toY} r={3} fill={t.connDot} />
            </g>
          );
        })}
      </svg>

      {/* Tables */}
      <div style={{ position: 'absolute', transformOrigin: '0 0', transform: tf, zIndex: 2 }}>
        {Object.entries(schema).map(([name, td]) => (
          <div key={name} style={{
            position: 'absolute', left: td.pos.x, top: td.pos.y, width: TW,
            background: t.tableBg, border: `1px solid ${t.tableBorder}`, borderRadius: 8,
            boxShadow: t.tableShadow, overflow: 'hidden', transition: 'background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
          }}>
            <div style={{
              background: t.headerBg, padding: '9px 14px',
              fontWeight: 600, fontSize: 12, letterSpacing: 0.3,
              borderBottom: `2px solid ${t.headerBorder}`,
              display: 'flex', alignItems: 'center', gap: 7, color: t.headerColor,
              transition: 'background 0.35s ease, color 0.35s ease',
            }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ opacity: 0.8, flexShrink: 0 }}>
                <rect x={3} y={3} width={18} height={18} rx={2} /><line x1={3} y1={9} x2={21} y2={9} /><line x1={9} y1={21} x2={9} y2={9} />
              </svg>
              {name}
            </div>
            <div style={{ padding: `${BP}px 0` }}>
              {td.fields.map((f, fi) => (
                <div key={fi} style={{
                  padding: '6px 14px', fontSize: 11, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  borderBottom: fi < td.fields.length - 1 ? `1px solid ${t.fieldBorder}` : 'none',
                  background: f.pk ? t.pkBg : 'transparent',
                }}>
                  <span style={{ color: t.fieldText, fontWeight: 500 }}>
                    {f.pk && '🔑 '}{f.fk && '🔗 '}{f.name}
                  </span>
                  <span style={{ color: t.fieldType, fontSize: 10, fontFamily: "'Monaco','Courier New',monospace" }}>{f.type}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Blur overlay with hint – fades out on first drag */}
      <div
        onPointerDown={(e) => e.stopPropagation()}
        style={{
          position: 'absolute', inset: 0, zIndex: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: hasInteracted ? 'none' : 'blur(4px)',
          background: hasInteracted ? 'transparent' : t.overlayBg,
          opacity: hasInteracted ? 0 : 1,
          transition: 'opacity 0.5s ease, backdrop-filter 0.5s ease, background 0.5s ease',
          pointerEvents: hasInteracted ? 'none' : 'auto',
          cursor: 'grab',
        }}
        onPointerDownCapture={() => {
          setHasInteracted(true);
        }}
      >
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          color: t.overlayText, fontFamily: 'var(--font-geist-sans), inherit',
        }}>
          <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
            <path d="M5 9l-3 3 3 3" />
            <path d="M9 5l3-3 3 3" />
            <path d="M15 19l-3 3-3-3" />
            <path d="M19 9l3 3-3 3" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="12" y1="2" x2="12" y2="22" />
          </svg>
          <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: 0.5 }}>
            Drag to explore
          </span>
        </div>
      </div>
    </div>
  );
}

const btnBase: React.CSSProperties = {
  width: 36, height: 36, border: 'none', borderRadius: 8,
  cursor: 'pointer', fontSize: 18, fontWeight: 600,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'background 0.2s ease',
};
