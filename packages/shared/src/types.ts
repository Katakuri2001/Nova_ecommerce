export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  phone: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone: string;
  is_default: boolean;
  created_at: string;
}

export interface Seller {
  id: string;
  user_id: string;
  store_name: string;
  store_slug: string;
  description: string;
  logo_url: string | null;
  banner_url: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  rating: number;
  review_count: number;
  follower_count: number;
  commission_rate: number;
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: string;
  seller_id: string;
  name: string;
  slug: string;
  description: string;
  banner_url: string | null;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent_id: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  seller_id: string;
  category_id: string;
  brand_id: string | null;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  sku: string;
  base_price: number;
  compare_at_price: number | null;
  status: 'draft' | 'active' | 'archived';
  weight: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  name: string;
  price_modifier: number;
  stock_quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  variant_id: string | null;
  image_url: string;
  thumbnail_url: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface InventoryTransaction {
  id: string;
  product_variant_id: string;
  type: 'in' | 'out' | 'adjustment' | 'return';
  quantity: number;
  reference: string | null;
  notes: string | null;
  created_at: string;
}

export interface Cart {
  id: string;
  user_id: string;
  expires_at: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_variant_id: string;
  quantity: number;
  unit_price: number;
  created_at: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  wishlist_id: string;
  product_variant_id: string;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string;
  subtotal: number;
  discount_amount: number;
  delivery_charge: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  shipping_address_id: string;
  billing_address_id: string;
  coupon_id: string | null;
  seller_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_variant_id: string;
  product_name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  seller_id: string;
  created_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: string;
  note: string | null;
  created_by: string;
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  transaction_id: string | null;
  provider: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  min_order_amount: number | null;
  max_discount_amount: number | null;
  total_usage_limit: number | null;
  per_user_limit: number;
  usage_count: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  seller_id: string | null;
  created_at: string;
}

export interface CouponUsage {
  id: string;
  coupon_id: string;
  user_id: string;
  order_id: string;
  discount_amount: number;
  created_at: string;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  type: string;
  value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  order_item_id: string;
  rating: number;
  title: string;
  text: string;
  state: string;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface ReviewImage {
  id: string;
  review_id: string;
  image_url: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}
