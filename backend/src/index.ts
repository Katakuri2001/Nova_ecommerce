import { z } from 'zod';
import type { Env, Database } from './env';

const rateLimitStore: Record<string, { count: number; resetAt: number }> = {};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    if (url.pathname.startsWith('/api/')) {
      return handleRequest(request, env, ctx);
    }
    
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  },
};

async function handleRequest(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');
  const method = request.method;

  // Rate limiting (simple in-memory, per worker instance)
  const clientIp = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
  const rateLimitKey = `${clientIp}:${path}`;
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 100; // per minute per IP
  if (!rateLimitStore[rateLimitKey]) {
    rateLimitStore[rateLimitKey] = { count: 0, resetAt: now + windowMs };
  }
  if (now > rateLimitStore[rateLimitKey].resetAt) {
    rateLimitStore[rateLimitKey] = { count: 0, resetAt: now + windowMs };
  }
  rateLimitStore[rateLimitKey].count++;
  if (rateLimitStore[rateLimitKey].count > maxRequests) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(Math.ceil((rateLimitStore[rateLimitKey].resetAt - now) / 1000)),
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  // CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Auth-Token',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  try {
    // Auth routes
    if (path === '/auth/register' && method === 'POST') {
      return handleRegister(request, env);
    }
    if (path === '/auth/login' && method === 'POST') {
      return handleLogin(request, env);
    }
    if (path === '/auth/logout' && method === 'POST') {
      return handleLogout(request, env);
    }
    if (path === '/auth/refresh' && method === 'POST') {
      return handleRefresh(request, env);
    }
    if (path === '/auth/me' && method === 'GET') {
      return handleMe(request, env);
    }

    // Product routes
    if (path === '/products' && method === 'GET') {
      return handleListProducts(request, env);
    }
    if (path.startsWith('/products/') && method === 'GET' && !path.endsWith('/reviews')) {
      return handleGetProduct(request, env, path);
    }
    if (path === '/products' && method === 'POST') {
      return handleCreateProduct(request, env);
    }
    if (path.startsWith('/products/') && method === 'PATCH') {
      return handleUpdateProduct(request, env, path);
    }
    if (path.startsWith('/products/') && method === 'DELETE') {
      return handleDeleteProduct(request, env, path);
    }

    // Search
    if (path === '/search' && method === 'GET') {
      return handleSearch(request, env);
    }

    // Cart routes
    if (path === '/cart' && method === 'GET') {
      return handleGetCart(request, env);
    }
    if (path === '/cart/items' && method === 'POST') {
      return handleAddToCart(request, env);
    }
    if (path.startsWith('/cart/items/') && method === 'PATCH') {
      return handleUpdateCartItem(request, env, path);
    }
    if (path.startsWith('/cart/items/') && method === 'DELETE') {
      return handleRemoveCartItem(request, env, path);
    }

    // Wishlist routes
    if (path === '/wishlist' && method === 'GET') {
      return handleGetWishlist(request, env);
    }
    if (path === '/wishlist/items' && method === 'POST') {
      return handleAddToWishlist(request, env);
    }
    if (path.startsWith('/wishlist/items/') && method === 'DELETE') {
      return handleRemoveFromWishlist(request, env, path);
    }

    // Address routes
    if (path === '/addresses' && method === 'GET') {
      return handleListAddresses(request, env);
    }
    if (path === '/addresses' && method === 'POST') {
      return handleCreateAddress(request, env);
    }
    if (path.startsWith('/addresses/') && method === 'PATCH') {
      return handleUpdateAddress(request, env, path);
    }
    if (path.startsWith('/addresses/') && method === 'DELETE') {
      return handleDeleteAddress(request, env, path);
    }

    // Order routes
    if (path === '/orders' && method === 'POST') {
      return handleCreateOrder(request, env);
    }
    if (path === '/orders' && method === 'GET') {
      return handleListOrders(request, env);
    }
    if (path.startsWith('/orders/') && method === 'GET') {
      return handleGetOrder(request, env, path);
    }
    if (path.startsWith('/orders/') && method === 'POST' && path.endsWith('/cancel')) {
      return handleCancelOrder(request, env, path);
    }

    // Payment routes
    if (path === '/payments/create' && method === 'POST') {
      return handleCreatePayment(request, env);
    }
    if (path === '/payments/verify' && method === 'POST') {
      return handleVerifyPayment(request, env);
    }

    // Seller routes
    if (path.startsWith('/seller/') && method === 'GET') {
      return handleSellerDashboard(request, env, path);
    }

    // Admin routes
    if (path.startsWith('/admin/') && method === 'GET') {
      return handleAdminList(request, env, path);
    }

    // Reviews
    if (path.endsWith('/reviews') && method === 'GET') {
      return handleGetReviews(request, env, path);
    }
    if (path.endsWith('/reviews' ) && method === 'POST') {
      return handleCreateReview(request, env, path);
    }

    // Coupons
    if (path === '/coupons/validate' && method === 'POST') {
      return handleValidateCoupon(request, env);
    }

    return new Response(JSON.stringify({ error: 'Route not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof ValidationError) {
      return new Response(JSON.stringify({ error: 'Validation failed', details: error.details }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}

function getAuthToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return request.headers.get('X-Auth-Token');
}

async function verifyToken(token: string, env: Env): Promise<{ userId: string; role: string } | null> {
  try {
    const db = await getDB(env);
    const session = await db
      .prepare('SELECT * FROM sessions WHERE token = ? AND expires_at > ?')
      .bind(token, new Date().toISOString())
      .first();
    if (session) {
      return { userId: session.user_id as string, role: session.role as string };
    }
    return null;
  } catch {
    return null;
  }
}

async function hashPassword(password: string, env: Env): Promise<string> {
  const pepper = (env.JWT_SECRET as string | undefined) || 'change-me-in-production';
  const encoder = new TextEncoder();
  const data = encoder.encode(password + ':' + pepper);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function verifyPassword(password: string, hash: string, env: Env): Promise<boolean> {
  const expected = await hashPassword(password, env);
  return expected === hash;
}

async function getDB(env: Env): Promise<Database> {
  return env.DB;
}

async function jsonResponse(data: unknown, status: number = 200): Promise<Response> {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Auth-Token',
    },
  });
}

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().min(10).max(10000),
  shortDescription: z.string().max(500).optional(),
  categoryId: z.string().uuid(),
  brandId: z.string().uuid().optional(),
  sku: z.string().min(1).max(100),
  basePrice: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  weight: z.number().positive().optional(),
});

const addToCartSchema = z.object({
  productVariantId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
});

const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(99),
});

const createOrderSchema = z.object({
  shippingAddressId: z.string().uuid(),
  billingAddressId: z.string().uuid(),
  paymentMethod: z.enum(['cod', 'bank_transfer', 'mobile_payment', 'payment_gateway']),
  couponId: z.string().uuid().optional(),
});

const createPaymentSchema = z.object({
  orderId: z.string().uuid(),
  method: z.enum(['cod', 'bank_transfer', 'mobile_payment', 'payment_gateway']),
  amount: z.number().positive(),
});

const createReviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1).max(255),
  text: z.string().min(10).max(5000),
  orderItemId: z.string().uuid(),
});

const applyCouponSchema = z.object({
  code: z.string().min(1).max(50),
});

const verifyPaymentSchema = z.object({
  transactionId: z.string(),
});

class ValidationError extends Error {
  constructor(public details: unknown) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
}

function validateBody<T>(schema: z.ZodSchema<T>, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

async function requireAuth(request: Request, env: Env): Promise<{ userId: string; role: string }> {
  const token = getAuthToken(request);
  if (!token) {
    throw new Error('Unauthorized');
  }
  const user = await verifyToken(token, env);
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

// Handler implementations (simplified for structure)
async function handleRegister(request: Request, env: Env) {
  const body = validateBody(registerSchema, await request.json());
  const db = await getDB(env);
  const passwordHash = await hashPassword(body.password, env);
  const result = await db
    .prepare('INSERT INTO users (email, password_hash, role, first_name, last_name) VALUES (?, ?, ?, ?, ?)')
    .bind(body.email, passwordHash, 'customer', body.firstName, body.lastName)
    .first();
  return jsonResponse({ success: true, userId: result?.id }, 201);
}

async function handleLogin(request: Request, env: Env) {
  const body = validateBody(loginSchema, await request.json());
  const db = await getDB(env);
  const user = await db
    .prepare('SELECT * FROM users WHERE email = ?')
    .bind(body.email)
    .first();
  if (!user) throw new Error('Invalid credentials');
  const passwordValid = await verifyPassword(body.password, user.password_hash as string, env);
  if (!passwordValid) throw new Error('Invalid credentials');
  const token = crypto.randomUUID();
  await db
    .prepare('INSERT INTO sessions (user_id, token, role, expires_at) VALUES (?, ?, ?, ?)')
    .bind(user.id, token, user.role, new Date(Date.now() + 86400000).toISOString())
    .first();
  return jsonResponse({ token, user: { id: user.id, email: user.email, role: user.role } });
}

async function handleLogout(_request: Request, env: Env) {
  const db = await getDB(env);
  await db.prepare('DELETE FROM sessions WHERE token = ?').bind(getAuthToken(_request!) || '').first();
  return jsonResponse({ success: true });
}

async function handleRefresh(request: Request, env: Env) {
  const { userId, role } = await requireAuth(request, env);
  const db = await getDB(env);
  const token = crypto.randomUUID();
  await db.prepare('DELETE FROM sessions WHERE user_id = ?').bind(userId).first();
  await db.prepare('INSERT INTO sessions (user_id, token, role, expires_at) VALUES (?, ?, ?, ?)')
    .bind(userId, token, role, new Date(Date.now() + 86400000).toISOString()).first();
  return jsonResponse({ token });
}

async function handleMe(request: Request, env: Env) {
  const { userId } = await requireAuth(request, env);
  const db = await getDB(env);
  const user = await db.prepare('SELECT id, email, first_name, last_name, role, avatar_url, phone FROM users WHERE id = ?').bind(userId).first();
  return jsonResponse({ user });
}

async function handleListProducts(request: Request, env: Env) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const search = url.searchParams.get('search') || '';
  const db = await getDB(env);
  
  let where = 'WHERE p.status = ?';
  let params: (string | number)[] = ['active'];
  
  if (search) {
    where += ' AND (p.name LIKE ? OR p.description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  
  const countQuery = `SELECT COUNT(*) as count FROM products p LEFT JOIN categories c ON p.category_id = c.id LEFT JOIN brands b ON p.brand_id ${where}`;
  const countResult = await db.prepare(countQuery).bind(...params).first();
  const total = Number(countResult?.['count'] || 0);
  
  const dataQuery = `SELECT p.*, c.name as category_name, b.name as brand_name FROM products p LEFT JOIN categories c ON p.category_id = c.id LEFT JOIN brands b ON p.brand_id ${where} ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
  const dataParams = [...params, limit, (page - 1) * limit];
  const products = await db.prepare(dataQuery).bind(...dataParams).all();
  
  return jsonResponse({ products: products.results, total, page, limit });
}

async function handleGetProduct(_request: Request, env: Env, path: string) {
  const id = path.split('/products/')[1];
  const db = await getDB(env);
  const product = await db.prepare('SELECT * FROM products WHERE id = ? AND status = ?').bind(id, 'active').first();
  if (!product) return jsonResponse({ error: 'Product not found' }, 404);
  
  const variants = await db.prepare('SELECT * FROM product_variants WHERE product_id = ?').bind(id).all();
  const images = await db.prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order').bind(id).all();
  
  return jsonResponse({ ...product, variants: variants.results, images: images.results });
}

async function handleCreateProduct(request: Request, env: Env) {
  const { userId, role } = await requireAuth(request, env);
  if (role !== 'seller') throw new Error('Forbidden');
  
  const body = validateBody(createProductSchema, await request.json());
  const db = await getDB(env);
  const result = await db
    .prepare('INSERT INTO products (seller_id, name, slug, description, sku, base_price, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(userId, body.name, body.slug, body.description, body.sku, body.basePrice, body.categoryId)
    .first();
  return jsonResponse({ id: result?.id, ...body }, 201);
}

async function handleSearch(request: Request, env: Env) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q') || '';
  const db = await getDB(env);
  const results = await db
    .prepare('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.status = ? AND (p.name LIKE ? OR p.description LIKE ?) LIMIT 20')
    .bind('active', `%${q}%`, `%${q}%`)
    .all();
  return jsonResponse({ results: results.results, query: q });
}

async function handleGetCart(request: Request, env: Env) {
  const { userId } = await requireAuth(request, env);
  const db = await getDB(env);
  const cart = await db.prepare('SELECT * FROM carts WHERE user_id = ?').bind(userId).first();
  return jsonResponse({ cart });
}

async function handleAddToCart(request: Request, env: Env) {
  const { userId } = await requireAuth(request, env);
  const body = validateBody(addToCartSchema, await request.json());
  const db = await getDB(env);
  
  const variant = await db.prepare('SELECT pv.*, p.base_price FROM product_variants pv JOIN products p ON pv.product_id = p.id WHERE pv.id = ?').bind(body.productVariantId).first() as { stock_quantity: number; price_modifier: number; base_price: number } | null;
  if (!variant || variant.stock_quantity < body.quantity) {
    throw new Error('Insufficient stock');
  }
  
  let cart = await db.prepare('SELECT * FROM carts WHERE user_id = ?').bind(userId).first();
  if (!cart) {
    const result = await db.prepare('INSERT INTO carts (user_id) VALUES (?)').bind(userId).first();
    cart = { id: result?.id };
  }
  
  const existing = await db
    .prepare('SELECT * FROM cart_items WHERE cart_id = ? AND product_variant_id = ?')
    .bind(cart.id, body.productVariantId)
    .first();
  
  if (existing) {
    await db.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?').bind(body.quantity, existing.id).first();
  } else {
    await db.prepare('INSERT INTO cart_items (cart_id, product_variant_id, quantity, unit_price) VALUES (?, ?, ?, ?)')
      .bind(cart.id, body.productVariantId, body.quantity, variant.base_price + variant.price_modifier).first();
  }
  
  return jsonResponse({ success: true });
}

async function handleUpdateCartItem(request: Request, env: Env, path: string) {
  await requireAuth(request, env);
  const body = validateBody(updateCartItemSchema, await request.json());
  const itemId = path.split('/cart/items/')[1];
  const db = await getDB(env);
  
  const item = await db.prepare('SELECT ci.*, p.price FROM cart_items ci JOIN products p ON ci.product_variant_id = p.id WHERE ci.id = ?').bind(itemId).first();
  if (!item) throw new Error('Cart item not found');
  
  await db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').bind(body.quantity, itemId).first();
  return jsonResponse({ success: true });
}

async function handleRemoveCartItem(request: Request, env: Env, path: string) {
  await requireAuth(request, env);
  const itemId = path.split('/cart/items/')[1];
  const db = await getDB(env);
  await db.prepare('DELETE FROM cart_items WHERE id = ?').bind(itemId).first();
  return jsonResponse({ success: true });
}

async function handleCreateOrder(request: Request, env: Env) {
  const { userId } = await requireAuth(request, env);
  const body = validateBody(createOrderSchema, await request.json());
  const db = await getDB(env);
  
  const orderNumber = 'NC-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  const result = await db
    .prepare('INSERT INTO orders (user_id, order_number, status, payment_status, subtotal, total_amount, payment_method, currency, shipping_address_id, billing_address_id, coupon_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(userId, orderNumber, 'PENDING', 'pending', 0, 0, body.paymentMethod, 'MMK', body.shippingAddressId, body.billingAddressId, body.couponId || null)
    .first();
  
  return jsonResponse({ orderId: result?.id, orderNumber }, 201);
}

async function handleListOrders(request: Request, env: Env) {
  const { userId } = await requireAuth(request, env);
  const db = await getDB(env);
  const orders = await db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').bind(userId).all();
  return jsonResponse({ orders: orders.results });
}

async function handleGetOrder(request: Request, env: Env, path: string) {
  await requireAuth(request, env);
  const id = path.split('/orders/')[1];
  const db = await getDB(env);
  const order = await db.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first();
  if (!order) return jsonResponse({ error: 'Order not found' }, 404);
  
  const items = await db.prepare('SELECT * FROM order_items WHERE order_id = ?').bind(id).all();
  const history = await db.prepare('SELECT * FROM order_status_history WHERE order_id = ? ORDER BY created_at').bind(id).all();
  
  return jsonResponse({ ...order, items: items.results, history: history.results });
}

async function handleCancelOrder(request: Request, env: Env, path: string) {
  const { userId } = await requireAuth(request, env);
  const id = path.split('/orders/')[1];
  const db = await getDB(env);
  const order = await db.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first();
  if (!order || order.user_id !== userId) throw new Error('Order not found');
  if (!['PENDING', 'PAYMENT_PENDING'].includes(order.status as string)) throw new Error('Cannot cancel this order');
  
  await db.prepare('UPDATE orders SET status = ? WHERE id = ?').bind('CANCELLED', id).first();
  await db.prepare('INSERT INTO order_status_history (order_id, status, note, created_by) VALUES (?, ?, ?, ?)').bind(id, 'CANCELLED', 'Cancelled by customer', userId).first();
  
  return jsonResponse({ success: true });
}

async function handleCreatePayment(request: Request, env: Env) {
  const body = validateBody(createPaymentSchema, await request.json());
  const db = await getDB(env);
  const paymentId = 'pay_' + Math.random().toString(36).substr(2, 12);
  await db.prepare('INSERT INTO payments (order_id, amount, method, status, currency) VALUES (?, ?, ?, ?, ?)')
    .bind(body.orderId, body.amount, body.method, body.method === 'cod' ? 'paid' : 'pending', 'MMK')
    .first();
  
  if (body.method === 'cod') {
    await db.prepare('UPDATE orders SET status = ?, payment_status = ? WHERE id = ?').bind('PROCESSING', 'paid', body.orderId).first();
  }
  
  return jsonResponse({ paymentId, clientSecret: 'cs_' + body.orderId });
}

async function handleVerifyPayment(request: Request, env: Env) {
  const body = validateBody(verifyPaymentSchema, await request.json());
  const db = await getDB(env);
  const payment = await db.prepare('SELECT * FROM payments WHERE transaction_id = ?').bind(body.transactionId).first();
  if (!payment) throw new Error('Payment not found');
  return jsonResponse({ payment });
}

async function handleUpdateProduct(request: Request, env: Env, path: string) {
  const { role } = await requireAuth(request, env);
  if (role !== 'seller' && role !== 'admin') throw new Error('Forbidden');
  const id = path.split('/products/')[1];
  const body = await request.json() as Record<string, any>;
  const db = await getDB(env);
  const updates: string[] = [];
  const params: (string | number)[] = [];
  if (body.name) { updates.push('name = ?'); params.push(body.name); }
  if (body.description) { updates.push('description = ?'); params.push(body.description); }
  if (body.basePrice) { updates.push('base_price = ?'); params.push(body.basePrice); }
  if (body.status) { updates.push('status = ?'); params.push(body.status); }
  if (updates.length === 0) return jsonResponse({ error: 'No updates provided' }, 400);
  params.push(id);
  await db.prepare(`UPDATE products SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(...params).first();
  return jsonResponse({ success: true });
}

async function handleDeleteProduct(request: Request, env: Env, path: string) {
  const { role } = await requireAuth(request, env);
  if (role !== 'seller' && role !== 'admin') throw new Error('Forbidden');
  const id = path.split('/products/')[1];
  const db = await getDB(env);
  await db.prepare('UPDATE products SET status = ? WHERE id = ?').bind('archived', id).first();
  return jsonResponse({ success: true });
}

async function handleGetWishlist(request: Request, env: Env) {
  const { userId } = await requireAuth(request, env);
  const db = await getDB(env);
  const wishlist = await db.prepare('SELECT * FROM wishlists WHERE user_id = ?').bind(userId).first();
  if (!wishlist) {
    const result = await db.prepare('INSERT INTO wishlists (user_id) VALUES (?)').bind(userId).first();
    return jsonResponse({ wishlist: { id: result?.id, user_id: userId, items: [] } });
  }
  const items = await db.prepare('SELECT wi.*, pv.*, p.name as product_name, p.base_price, p.image_url FROM wishlist_items wi LEFT JOIN product_variants pv ON wi.product_variant_id = pv.id LEFT JOIN products p ON pv.product_id = p.id WHERE wi.wishlist_id = ?').bind(wishlist.id).all();
  return jsonResponse({ wishlist: { ...wishlist, items: items.results } });
}

async function handleAddToWishlist(request: Request, env: Env) {
  const { userId } = await requireAuth(request, env);
  const body = await request.json() as Record<string, any>;
  const db = await getDB(env);
  let wishlist = await db.prepare('SELECT * FROM wishlists WHERE user_id = ?').bind(userId).first();
  if (!wishlist) {
    const result = await db.prepare('INSERT INTO wishlists (user_id) VALUES (?)').bind(userId).first();
    wishlist = { id: result?.id };
  }
  await db.prepare('INSERT OR IGNORE INTO wishlist_items (wishlist_id, product_variant_id) VALUES (?, ?)').bind(wishlist.id, body.productVariantId).first();
  return jsonResponse({ success: true });
}

async function handleRemoveFromWishlist(request: Request, env: Env, path: string) {
  const { userId } = await requireAuth(request, env);
  const variantId = path.split('/wishlist/items/')[1];
  const db = await getDB(env);
  const wishlist = await db.prepare('SELECT * FROM wishlists WHERE user_id = ?').bind(userId).first();
  if (wishlist) {
    await db.prepare('DELETE FROM wishlist_items WHERE wishlist_id = ? AND product_variant_id = ?').bind(wishlist.id, variantId).first();
  }
  return jsonResponse({ success: true });
}

async function handleListAddresses(request: Request, env: Env) {
  const { userId } = await requireAuth(request, env);
  const db = await getDB(env);
  const addresses = await db.prepare('SELECT * FROM addresses WHERE user_id = ?').bind(userId).all();
  return jsonResponse({ addresses: addresses.results });
}

async function handleCreateAddress(request: Request, env: Env) {
  const { userId } = await requireAuth(request, env);
  const body = await request.json() as Record<string, any>;
  const db = await getDB(env);
  const id = 'addr_' + Math.random().toString(36).substr(2, 12);
  await db.prepare('INSERT INTO addresses (id, user_id, label, full_name, address_line_1, address_line_2, city, state, zip_code, country, phone, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(id, userId, body.label || 'Home', body.fullName, body.addressLine1, body.addressLine2 || null, body.city, body.state, body.zipCode, body.country, body.phone, body.isDefault || false).first();
  return jsonResponse({ id }, 201);
}

async function handleUpdateAddress(request: Request, env: Env, path: string) {
  const { userId } = await requireAuth(request, env);
  const id = path.split('/addresses/')[1];
  const body = await request.json() as Record<string, any>;
  const db = await getDB(env);
  const addr = await db.prepare('SELECT * FROM addresses WHERE id = ? AND user_id = ?').bind(id, userId).first();
  if (!addr) throw new Error('Address not found');
  const updates: string[] = [];
  const params: (string | number | boolean)[] = [];
  if (body.label) { updates.push('label = ?'); params.push(body.label); }
  if (body.fullName) { updates.push('full_name = ?'); params.push(body.fullName); }
  if (body.addressLine1) { updates.push('address_line_1 = ?'); params.push(body.addressLine1); }
  if (body.city) { updates.push('city = ?'); params.push(body.city); }
  if (body.state) { updates.push('state = ?'); params.push(body.state); }
  if (body.zipCode) { updates.push('zip_code = ?'); params.push(body.zipCode); }
  if (body.country) { updates.push('country = ?'); params.push(body.country); }
  if (body.phone) { updates.push('phone = ?'); params.push(body.phone); }
  if (updates.length === 0) return jsonResponse({ error: 'No updates provided' }, 400);
  params.push(id);
  await db.prepare(`UPDATE addresses SET ${updates.join(', ')} WHERE id = ?`).bind(...params).first();
  return jsonResponse({ success: true });
}

async function handleDeleteAddress(request: Request, env: Env, path: string) {
  const { userId } = await requireAuth(request, env);
  const id = path.split('/addresses/')[1];
  const db = await getDB(env);
  await db.prepare('DELETE FROM addresses WHERE id = ? AND user_id = ?').bind(id, userId).first();
  return jsonResponse({ success: true });
}

async function handleSellerDashboard(request: Request, env: Env, path: string) {
  const { userId, role } = await requireAuth(request, env);
  if (role !== 'seller' && role !== 'admin') throw new Error('Forbidden');
  
  const db = await getDB(env);
  
  if (path === '/seller/analytics') {
    const analytics = await db
      .prepare('SELECT COUNT(*) as totalOrders, SUM(total_amount) as totalRevenue FROM orders WHERE seller_id = (SELECT id FROM sellers WHERE user_id = ?)')
      .bind(userId)
      .first();
    return jsonResponse(analytics);
  }
  
  return jsonResponse({});
}

const ADMIN_TABLE_ALLOWLIST = new Set([
  'users', 'sellers', 'stores', 'categories', 'brands',
  'products', 'orders', 'order_items', 'payments', 'coupons',
  'reviews', 'notifications', 'audit_logs',
]);

async function handleAdminList(request: Request, env: Env, path: string) {
  const { role } = await requireAuth(request, env);
  if (role !== 'admin') throw new Error('Forbidden');
  
  const db = await getDB(env);
  const segments = path.split('/admin/');
  const resource = segments[1] || '';
  
  if (resource === 'analytics') {
    const stats = await db.prepare(`
      SELECT 
        COUNT(DISTINCT u.id) as totalUsers,
        COUNT(DISTINCT s.id) as totalSellers,
        COUNT(DISTINCT p.id) as totalProducts,
        COUNT(DISTINCT o.id) as totalOrders,
        SUM(o.total_amount) as totalRevenue
      FROM users u 
      LEFT JOIN sellers s ON u.id = s.user_id 
      LEFT JOIN products p ON s.id = p.seller_id 
      LEFT JOIN orders o ON u.id = o.user_id
    `).first();
    return jsonResponse(stats);
  }
  
  if (!ADMIN_TABLE_ALLOWLIST.has(resource)) {
    return jsonResponse({ error: 'Forbidden resource' }, 403);
  }
  
  const results = await db.prepare(`SELECT * FROM ${resource} LIMIT 50`).all();
  return jsonResponse(results);
}

async function handleGetReviews(_request: Request, env: Env, path: string) {
  const productId = path.split('/products/')[1]?.split('/reviews')[0];
  const db = await getDB(env);
  const reviews = await db.prepare('SELECT * FROM reviews WHERE product_id = ? AND state = ? ORDER BY created_at DESC').bind(productId, 'approved').all();
  return jsonResponse({ reviews: reviews.results });
}

async function handleCreateReview(request: Request, env: Env, _path: string) {
  const { userId } = await requireAuth(request, env);
  const body = validateBody(createReviewSchema, await request.json());
  const db = await getDB(env);
  const reviewId = 'rev_' + Math.random().toString(36).substr(2, 12);
  await db.prepare('INSERT INTO reviews (product_id, user_id, order_item_id, rating, title, text, state) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(body.productId, userId, body.orderItemId, body.rating, body.title, body.text, 'pending')
    .first();
  return jsonResponse({ id: reviewId }, 201);
}

async function handleValidateCoupon(request: Request, env: Env) {
  const body = validateBody(applyCouponSchema, await request.json());
  const db = await getDB(env);
  const coupon = await db.prepare('SELECT * FROM coupons WHERE code = ? AND is_active = ? AND start_date <= ? AND end_date >= ?').bind(body.code, true, new Date().toISOString(), new Date().toISOString()).first();
  if (!coupon) throw new Error('Invalid coupon');
  return jsonResponse({ coupon });
}
