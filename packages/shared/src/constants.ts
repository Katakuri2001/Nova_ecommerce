export const ROLES = ['customer', 'seller', 'admin'] as const;
export type Role = (typeof ROLES)[number];

export const ORDER_STATES = ['PENDING', 'PAYMENT_PENDING', 'PAID', 'PROCESSING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REFUND_REQUESTED', 'REFUNDED', 'RETURN_REQUESTED', 'RETURNED'] as const;
export type OrderState = (typeof ORDER_STATES)[number];

export const PAYMENT_STATES = ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'] as const;
export type PaymentState = (typeof PAYMENT_STATES)[number];

export const PAYMENT_METHODS = ['cod', 'bank_transfer', 'mobile_payment', 'payment_gateway'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const COUPON_TYPES = ['percentage', 'fixed', 'product', 'category'] as const;
export type CouponType = (typeof COUPON_TYPES)[number];

export const REVIEW_STATES = ['pending', 'approved', 'rejected'] as const;
export type ReviewState = (typeof REVIEW_STATES)[number];
