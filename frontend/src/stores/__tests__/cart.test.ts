import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../index';

describe('Cart Store', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('should start with empty cart', () => {
    expect(useCartStore.getState().items).toEqual([]);
  });

  it('should add an item to cart', () => {
    const item = {
      id: '1',
      productVariantId: 'v1',
      productName: 'Test Product',
      variantName: 'Default',
      imageUrl: 'https://example.com/img.jpg',
      quantity: 1,
      unitPrice: 1000,
      sku: 'SKU-1',
    };
    useCartStore.getState().addItem(item);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].productName).toBe('Test Product');
  });

  it('should increase quantity for existing item', () => {
    const item = {
      id: '1',
      productVariantId: 'v1',
      productName: 'Test Product',
      variantName: 'Default',
      imageUrl: 'https://example.com/img.jpg',
      quantity: 1,
      unitPrice: 1000,
      sku: 'SKU-1',
    };
    useCartStore.getState().addItem(item);
    useCartStore.getState().addItem({ ...item, quantity: 2 });
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(3);
  });

  it('should remove an item from cart', () => {
    const item = {
      id: '1',
      productVariantId: 'v1',
      productName: 'Test Product',
      variantName: 'Default',
      imageUrl: 'https://example.com/img.jpg',
      quantity: 1,
      unitPrice: 1000,
      sku: 'SKU-1',
    };
    useCartStore.getState().addItem(item);
    useCartStore.getState().removeItem('1');
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('should update quantity', () => {
    const item = {
      id: '1',
      productVariantId: 'v1',
      productName: 'Test Product',
      variantName: 'Default',
      imageUrl: 'https://example.com/img.jpg',
      quantity: 1,
      unitPrice: 1000,
      sku: 'SKU-1',
    };
    useCartStore.getState().addItem(item);
    useCartStore.getState().updateQuantity('1', 5);
    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it('should clear cart', () => {
    const item = {
      id: '1',
      productVariantId: 'v1',
      productName: 'Test Product',
      variantName: 'Default',
      imageUrl: 'https://example.com/img.jpg',
      quantity: 1,
      unitPrice: 1000,
      sku: 'SKU-1',
    };
    useCartStore.getState().addItem(item);
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});

describe('Wishlist Store', () => {
  beforeEach(() => {
    useWishlistStore.getState().clearWishlist();
  });

  it('should start with empty wishlist', () => {
    expect(useWishlistStore.getState().items).toEqual([]);
  });

  it('should add item to wishlist', () => {
    useWishlistStore.getState().addItem('v1');
    expect(useWishlistStore.getState().items).toContain('v1');
    expect(useWishlistStore.getState().isInWishlist('v1')).toBe(true);
  });

  it('should remove item from wishlist', () => {
    useWishlistStore.getState().addItem('v1');
    useWishlistStore.getState().removeItem('v1');
    expect(useWishlistStore.getState().items).not.toContain('v1');
    expect(useWishlistStore.getState().isInWishlist('v1')).toBe(false);
  });

  it('should clear wishlist', () => {
    useWishlistStore.getState().addItem('v1');
    useWishlistStore.getState().addItem('v2');
    useWishlistStore.getState().clearWishlist();
    expect(useWishlistStore.getState().items).toHaveLength(0);
  });
});