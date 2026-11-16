import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createProductSchema = z.object({
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

export const createVariantSchema = z.object({
  sku: z.string().min(1).max(100),
  name: z.string().min(1).max(255),
  priceModifier: z.number().default(0),
  stockQuantity: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().min(0).default(5),
});

export const updateStockSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int(),
  type: z.enum(['in', 'out', 'adjustment', 'return']),
  notes: z.string().optional(),
});

export const addToCartSchema = z.object({
  productVariantId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(99),
});

export const createOrderSchema = z.object({
  shippingAddressId: z.string().uuid(),
  billingAddressId: z.string().uuid(),
  paymentMethod: z.enum(['cod', 'bank_transfer', 'mobile_payment', 'payment_gateway']),
  couponId: z.string().uuid().optional(),
});

export const createPaymentSchema = z.object({
  orderId: z.string().uuid(),
  method: z.enum(['cod', 'bank_transfer', 'mobile_payment', 'payment_gateway']),
  amount: z.number().positive(),
});

export const createReviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1).max(255),
  text: z.string().min(10).max(5000),
  orderItemId: z.string().uuid(),
});

export const applyCouponSchema = z.object({
  code: z.string().min(1).max(50),
});

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const productFilterSchema = z.object({
  categoryId: z.string().uuid().optional(),
  brandId: z.string().uuid().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  minRating: z.number().min(1).max(5).optional(),
  inStock: z.boolean().optional(),
  hasDiscount: z.boolean().optional(),
  sortBy: z.enum(['relevance', 'popularity', 'newest', 'price_asc', 'price_desc', 'rating']).default('relevance'),
  search: z.string().optional(),
});

export const sellerProfileSchema = z.object({
  storeName: z.string().min(1).max(255),
  storeSlug: z.string().min(1).max(255),
  description: z.string().max(2000),
});

export const adminUpdateUserSchema = z.object({
  role: z.enum(['customer', 'seller', 'admin']),
  isActive: z.boolean().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.string(),
  note: z.string().optional(),
});
