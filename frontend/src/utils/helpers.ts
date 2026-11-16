export const VARIANTS = {
  size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  color: ['Black', 'White', 'Navy', 'Red', 'Green', 'Blue'],
  material: ['Cotton', 'Polyester', 'Silk', 'Wool'],
} as const;

export function formatPrice(price: number, currency = 'MMK'): string {
  return `${price.toLocaleString()} ${currency}`;
}

export function calculateDiscount(currentPrice: number, originalPrice: number): number {
  if (!originalPrice || currentPrice >= originalPrice) return 0;
  return Math.round((1 - currentPrice / originalPrice) * 100);
}

export function generateOrderNumber(): string {
  return `NC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
