// Seed data for development
import { DB } from 'better-sqlite3';
import { randomUUID } from 'crypto';

interface Category { id: string; name: string; slug: string; parent_id: string | null; is_active: boolean; sort_order: number; }
interface Brand { id: string; name: string; slug: string; is_active: boolean; }
interface Product { id: string; seller_id: string; category_id: string; name: string; slug: string; description: string; sku: string; base_price: number; status: string; }
interface User { id: string; email: string; password_hash: string; role: string; first_name: string; last_name: string; is_verified: boolean; }
interface Seller { id: string; user_id: string; store_name: string; store_slug: string; status: string; commission_rate: number; }

const categories: Category[] = [
  { id: randomUUID(), name: 'Electronics', slug: 'electronics', parent_id: null, is_active: true, sort_order: 1 },
  { id: randomUUID(), name: 'Fashion', slug: 'fashion', parent_id: null, is_active: true, sort_order: 2 },
  { id: randomUUID(), name: 'Home & Living', slug: 'home', parent_id: null, is_active: true, sort_order: 3 },
  { id: randomUUID(), name: 'Sports', slug: 'sports', parent_id: null, is_active: true, sort_order: 4 },
  { id: randomUUID(), name: 'Beauty', slug: 'beauty', parent_id: null, is_active: true, sort_order: 5 },
  { id: randomUUID(), name: 'Food & Grocery', slug: 'food', parent_id: null, is_active: true, sort_order: 6 },
];

const brands: Brand[] = [
  { id: randomUUID(), name: 'TechNova', slug: 'technova', is_active: true },
  { id: randomUUID(), name: 'StyleMax', slug: 'stylemax', is_active: true },
  { id: randomUUID(), name: 'HomeEssentials', slug: 'homeessentials', is_active: true },
  { id: randomUUID(), name: 'FitPro', slug: 'fitpro', is_active: true },
  { id: randomUUID(), name: 'GlowUp', slug: 'glowup', is_active: true },
];

const sellerUsers: User[] = [
  { id: randomUUID(), email: 'seller1@nova.com', password_hash: 'hash1', role: 'seller', first_name: 'Alice', last_name: 'Chen', is_verified: true },
  { id: randomUUID(), email: 'seller2@nova.com', password_hash: 'hash2', role: 'seller', first_name: 'Bob', last_name: 'Tan', is_verified: true },
  { id: randomUUID(), email: 'seller3@nova.com', password_hash: 'hash3', role: 'seller', first_name: 'Carol', last_name: 'Lee', is_verified: false },
];

const sellers: Seller[] = [
  { id: randomUUID(), user_id: sellerUsers[0].id, store_name: 'TechNova Store', store_slug: 'technova-store', status: 'approved', commission_rate: 8 },
  { id: randomUUID(), user_id: sellerUsers[1].id, store_name: 'StyleHub', store_slug: 'stylehub', status: 'approved', commission_rate: 10 },
  { id: randomUUID(), user_id: sellerUsers[2].id, store_name: 'FitWorld', store_slug: 'fitworld', status: 'pending', commission_rate: 12 },
];

const products = [
  { name: 'Wireless Noise-Cancelling Headphones', slug: 'wireless-headphones', desc: 'Premium noise-cancelling headphones with 30-hour battery life.', sku: 'WNC-001', price: 89000, seller: sellers[0].id, category: categories[0].id, brand: brands[0].id },
  { name: 'Smart Watch Pro X', slug: 'smart-watch-pro', desc: 'Advanced smartwatch with health monitoring and GPS.', sku: 'SWP-001', price: 159000, seller: sellers[0].id, category: categories[0].id, brand: brands[0].id },
  { name: 'Organic Cotton T-Shirt', slug: 'organic-cotton-tshirt', desc: 'Sustainably made 100% organic cotton t-shirt.', sku: 'OCT-001', price: 25000, seller: sellers[1].id, category: categories[1].id, brand: brands[1].id },
  { name: 'Premium Silk Dress', slug: 'premium-silk-dress', desc: 'Elegant silk dress for any occasion.', sku: 'PSD-001', price: 185000, seller: sellers[1].id, category: categories[1].id, brand: brands[1].id },
  { name: 'Ceramic Cookware Set', slug: 'ceramic-cookware', desc: 'Handcrafted ceramic cookware set for modern kitchens.', sku: 'CCS-001', price: 67000, seller: sellers[0].id, category: categories[2].id, brand: brands[2].id },
  { name: 'Yoga Mat Premium', slug: 'yoga-mat', desc: 'Non-slip eco-friendly yoga mat with alignment guides.', sku: 'YMP-001', price: 32000, seller: sellers[2].id, category: categories[3].id, brand: brands[3].id },
  { name: 'Vitamin C Serum', slug: 'vitamin-c-serum', desc: 'Brightening vitamin C serum with hyaluronic acid.', sku: 'VCS-001', price: 45000, seller: sellers[1].id, category: categories[4].id, brand: brands[4].id },
  { name: 'Organic Green Tea Collection', slug: 'green-tea', desc: 'Premium loose-leaf green tea collection.', sku: 'GTC-001', price: 18000, seller: sellers[2].id, category: categories[5].id, brand: brands[2].id },
  { name: 'Bluetooth Speaker', slug: 'bluetooth-speaker', desc: 'Portable waterproof Bluetooth speaker.', sku: 'BS-001', price: 55000, seller: sellers[0].id, category: categories[0].id, brand: brands[0].id },
  { name: 'Running Shoes Elite', slug: 'running-shoes', desc: 'Lightweight performance running shoes.', sku: 'RE-001', price: 125000, seller: sellers[2].id, category: categories[3].id, brand: brands[3].id },
  { name: 'Denim Jacket Classic', slug: 'denim-jacket', desc: 'Timeless classic denim jacket.', sku: 'DJ-001', price: 95000, seller: sellers[1].id, category: categories[1].id, brand: brands[1].id },
  { name: 'Coffee Maker Deluxe', slug: 'coffee-maker', desc: 'Automatic espresso and coffee maker.', sku: 'CMD-001', price: 145000, seller: sellers[0].id, category: categories[2].id, brand: brands[2].id },
];

export function seedDB(db: DB) {
  // Create tables (already exist from migration)
  
  // Insert categories
  for (const c of categories) {
    db.prepare('INSERT OR IGNORE INTO categories (id, name, slug, parent_id, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(c.id, c.name, c.slug, c.parent_id, c.is_active, c.sort_order).run();
  }
  
  // Insert brands
  for (const b of brands) {
    db.prepare('INSERT OR IGNORE INTO brands (id, name, slug, is_active) VALUES (?, ?, ?, ?)')
      .bind(b.id, b.name, b.slug, b.is_active).run();
  }
  
  // Insert sellers
  for (const s of sellerUsers) {
    db.prepare('INSERT OR IGNORE INTO users (id, email, password_hash, role, first_name, last_name, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(s.id, s.email, s.password_hash, s.role, s.first_name, s.last_name, s.is_verified).run();
  }
  for (const s of sellers) {
    db.prepare('INSERT OR IGNORE INTO sellers (id, user_id, store_name, store_slug, status, commission_rate) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(s.id, s.user_id, s.store_name, s.store_slug, s.status, s.commission_rate).run();
  }
  
  // Insert products
  for (const p of products) {
    const productId = randomUUID();
    const variants = [
      { id: randomUUID(), sku: p.sku, name: 'Default', priceModifier: 0, stockQuantity: Math.floor(Math.random() * 200) + 10, lowStockThreshold: 5 },
    ];
    
    db.prepare('INSERT OR IGNORE INTO products (id, seller_id, category_id, brand_id, name, slug, description, sku, base_price, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(productId, p.seller, p.category, p.brand, p.name, p.slug, p.desc, p.sku, p.price, 'active').run();
    
    for (const v of variants) {
      db.prepare('INSERT OR IGNORE INTO product_variants (id, product_id, sku, name, price_modifier, stock_quantity, low_stock_threshold) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(v.id, productId, v.sku, v.name, v.priceModifier, v.stockQuantity, v.lowStockThreshold).run();
    }
    
    db.prepare('INSERT OR IGNORE INTO product_images (id, product_id, image_url, is_primary) VALUES (?, ?, ?, ?)')
      .bind(randomUUID(), productId, `https://picsum.photos/seed/${p.slug}/800/800`, true).run();
  }
  
  // Insert coupons
  db.prepare('INSERT OR IGNORE INTO coupons (id, code, type, value, min_order_amount, max_discount_amount, total_usage_limit, per_user_limit, start_date, end_date, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(randomUUID(), 'NOVA10', 'percentage', 10, 50000, 10000, 1000, 3, new Date().toISOString(), new Date(Date.now() + 30 * 86400000).toISOString(), true).run();
  
  db.prepare('INSERT OR IGNORE INTO coupons (id, code, type, value, min_order_amount, max_discount_amount, total_usage_limit, per_user_limit, start_date, end_date, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(randomUUID(), 'FREESHIP', 'fixed', 5000, 100000, null, 500, 1, new Date().toISOString(), new Date(Date.now() + 30 * 86400000).toISOString(), true).run();
  
  console.log('✅ Seed data created successfully');
}
