import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@nova/shared';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'nova-auth' }
  )
);

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

interface CartItem {
  id: string;
  productVariantId: string;
  productName: string;
  variantName: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  sku: string;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.productVariantId === item.productVariantId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productVariantId === item.productVariantId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'nova-cart' }
  )
);

interface WishlistState {
  items: string[];
  addItem: (variantId: string) => void;
  removeItem: (variantId: string) => void;
  isInWishlist: (variantId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (variantId) => set((state) => ({ items: [...state.items, variantId] })),
      removeItem: (variantId) => set((state) => ({ items: state.items.filter((id) => id !== variantId) })),
      isInWishlist: (variantId) => get().items.includes(variantId),
      clearWishlist: () => set({ items: [] }),
    }),
    { name: 'nova-wishlist' }
  )
);

interface NotificationState {
  notifications: NotificationData[];
  addNotification: (n: NotificationData) => void;
  markAsRead: (id: string) => void;
}

interface NotificationData {
  id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],
  addNotification: (n) => set((state) => ({ notifications: [n, ...state.notifications] })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    })),
}));
