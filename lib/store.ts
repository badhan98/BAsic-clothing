import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductColor } from './supabase';

export interface CartItem {
  product: Product;
  color: ProductColor;
  size: string;
  quantity: number;
}

export interface Address {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface UserSession {
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  addresses: Address[];
}

interface AppStore {
  // Cart
  cart: CartItem[];
  coupon: { code: string; type: 'percentage' | 'fixed_amount'; value: number } | null;
  giftWrap: boolean;
  orderNotes: string;
  addToCart: (product: Product, color: ProductColor, size: string, quantity?: number) => void;
  removeFromCart: (productId: string, colorHex: string, size: string) => void;
  updateCartQuantity: (productId: string, colorHex: string, size: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  setGiftWrap: (wrap: boolean) => void;
  setOrderNotes: (notes: string) => void;
  getCartSubtotal: () => number;
  getCartDiscount: () => number;
  getCartTotal: () => number;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Auth
  user: UserSession | null;
  login: (email: string, firstName?: string, lastName?: string) => void;
  logout: () => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Recently Viewed & Compare
  recentlyViewed: Product[];
  addRecentlyViewed: (product: Product) => void;
  compareProducts: Product[];
  toggleCompareProduct: (product: Product) => void;
  clearCompare: () => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Cart State
      cart: [],
      coupon: null,
      giftWrap: false,
      orderNotes: '',

      addToCart: (product, color, size, quantity = 1) => {
        const cart = get().cart;
        const existingIndex = cart.findIndex(
          (item) =>
            item.product.id === product.id &&
            item.color.hex === color.hex &&
            item.size === size
        );

        if (existingIndex >= 0) {
          const updated = [...cart];
          updated[existingIndex].quantity += quantity;
          set({ cart: updated });
        } else {
          set({ cart: [...cart, { product, color, size, quantity }] });
        }
      },

      removeFromCart: (productId, colorHex, size) => {
        set({
          cart: get().cart.filter(
            (item) =>
              !(
                item.product.id === productId &&
                item.color.hex === colorHex &&
                item.size === size
              )
          )
        });
      },

      updateCartQuantity: (productId, colorHex, size, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, colorHex, size);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.product.id === productId &&
            item.color.hex === colorHex &&
            item.size === size
              ? { ...item, quantity }
              : item
          )
        });
      },

      clearCart: () => set({ cart: [], coupon: null, giftWrap: false, orderNotes: '' }),

      applyCoupon: (code) => {
        const cleanCode = code.toUpperCase();
        if (cleanCode === 'BASIC10') {
          set({ coupon: { code: 'BASIC10', type: 'percentage', value: 10 } });
          return true;
        } else if (cleanCode === 'BASIC50') {
          set({ coupon: { code: 'BASIC50', type: 'fixed_amount', value: 50 } });
          return true;
        } else if (cleanCode === 'WELCOME20') {
          set({ coupon: { code: 'WELCOME20', type: 'percentage', value: 20 } });
          return true;
        }
        return false;
      },

      removeCoupon: () => set({ coupon: null }),
      setGiftWrap: (wrap) => set({ giftWrap: wrap }),
      setOrderNotes: (notes) => set({ orderNotes: notes }),

      getCartSubtotal: () => {
        return get().cart.reduce((sum, item) => sum + item.product.basePrice * item.quantity, 0);
      },

      getCartDiscount: () => {
        const subtotal = get().getCartSubtotal();
        const coupon = get().coupon;
        if (!coupon) return 0;
        if (coupon.type === 'percentage') {
          return parseFloat(((subtotal * coupon.value) / 100).toFixed(2));
        } else {
          return Math.min(coupon.value, subtotal);
        }
      },

      getCartTotal: () => {
        const subtotal = get().getCartSubtotal();
        const discount = get().getCartDiscount();
        const giftWrapCost = get().giftWrap ? 5.00 : 0;
        const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15.00;
        const tax = parseFloat(((subtotal - discount) * 0.08).toFixed(2)); // 8% Tax
        return parseFloat((subtotal - discount + giftWrapCost + shipping + tax).toFixed(2));
      },

      // Wishlist State
      wishlist: [],
      toggleWishlist: (product) => {
        const wishlist = get().wishlist;
        const exists = wishlist.some((item) => item.id === product.id);
        if (exists) {
          set({ wishlist: wishlist.filter((item) => item.id !== product.id) });
        } else {
          set({ wishlist: [...wishlist, product] });
        }
      },
      isInWishlist: (productId) => {
        return get().wishlist.some((item) => item.id === productId);
      },

      // Auth State
      user: null,
      login: (email, firstName = 'Guest', lastName = 'User') => {
        const existingUser = get().user;
        set({
          user: {
            email,
            firstName,
            lastName,
            avatarUrl: existingUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
            addresses: existingUser?.addresses || [
              {
                id: 'addr-1',
                title: 'Home',
                firstName,
                lastName,
                addressLine1: '128 Mercer St',
                city: 'New York',
                state: 'NY',
                postalCode: '10012',
                country: 'United States',
                isDefault: true
              }
            ]
          }
        });
      },
      logout: () => set({ user: null }),

      addAddress: (address) => {
        const user = get().user;
        if (!user) return;
        const id = `addr-${Math.random().toString(36).substr(2, 9)}`;
        const newAddress: Address = { ...address, id };
        let updatedAddresses = [...user.addresses];

        if (address.isDefault) {
          updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
        }

        updatedAddresses.push(newAddress);
        set({ user: { ...user, addresses: updatedAddresses } });
      },

      removeAddress: (id) => {
        const user = get().user;
        if (!user) return;
        set({ user: { ...user, addresses: user.addresses.filter((a) => a.id !== id) } });
      },

      setDefaultAddress: (id) => {
        const user = get().user;
        if (!user) return;
        set({
          user: {
            ...user,
            addresses: user.addresses.map((a) => ({
              ...a,
              isDefault: a.id === id
            }))
          }
        });
      },

      // Recently Viewed
      recentlyViewed: [],
      addRecentlyViewed: (product) => {
        const current = get().recentlyViewed.filter((p) => p.id !== product.id);
        // Cap at 10 items
        set({ recentlyViewed: [product, ...current].slice(0, 10) });
      },

      // Compare
      compareProducts: [],
      toggleCompareProduct: (product) => {
        const current = get().compareProducts;
        const exists = current.some((p) => p.id === product.id);
        if (exists) {
          set({ compareProducts: current.filter((p) => p.id !== product.id) });
        } else {
          if (current.length >= 3) return; // limit to 3 items
          set({ compareProducts: [...current, product] });
        }
      },
      clearCompare: () => set({ compareProducts: [] })
    }),
    {
      name: 'basic-brand-storage',
      partialize: (state) => ({
        cart: state.cart,
        coupon: state.coupon,
        giftWrap: state.giftWrap,
        wishlist: state.wishlist,
        user: state.user,
        recentlyViewed: state.recentlyViewed
      })
    }
  )
);
