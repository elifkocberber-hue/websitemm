'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { CeramicProduct } from '@/types/ceramic';
import { useUser } from '@/context/UserContext';
import { ceramicProducts } from '@/data/ceramicProducts';
import { trackAddToCart } from '@/lib/pixel';

export interface CartCeramicItem extends CeramicProduct {
  quantity: number;
}

interface CartContextType {
  items: CartCeramicItem[];
  addToCart: (product: CeramicProduct, quantity: number) => void;
  removeFromCart: (productId: number | string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartCeramicItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevUserIdRef = useRef<string | null>(null);

  // Supabase'e debounced sync
  const syncToSupabase = useCallback((cartItems: CartCeramicItem[]) => {
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(async () => {
      try {
        await fetch('/api/user/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            // user_id sunucuda oturum cookie'sinden alınır — burada gönderilmez
            items: cartItems.map(i => ({ product_id: String(i.id), quantity: i.quantity })),
          }),
        });
      } catch {
        // localStorage her zaman source of truth — sessizce geç
      }
    }, 800);
  }, []);

  // İlk yükleme: localStorage
  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem('ceramic-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Sepet verisi yüklenemedi:', error);
      }
    }
  }, []);

  // localStorage sync
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('ceramic-cart', JSON.stringify(items));
    }
  }, [items, mounted]);

  // Kullanıcı giriş yaptığında: Supabase sepetini çek ve birleştir
  useEffect(() => {
    if (!mounted) return;
    if (!user) {
      prevUserIdRef.current = null;
      return;
    }
    // Aynı kullanıcı tekrar tetiklenmesin
    if (prevUserIdRef.current === user.id) return;
    prevUserIdRef.current = user.id;

    const fetchAndMerge = async () => {
      try {
        const res = await fetch('/api/user/cart', { credentials: 'same-origin' });
        if (!res.ok) return;
        const { items: remoteItems } = await res.json() as {
          items: { product_id: string; quantity: number }[];
        };

        if (!remoteItems?.length) {
          // Uzak sepet boş → local sepeti Supabase'e yükle
          setItems(prev => {
            if (prev.length > 0) syncToSupabase(prev);
            return prev;
          });
          return;
        }

        // Local + remote birleştir
        setItems(prev => {
          const merged = [...prev];
          for (const remote of remoteItems) {
            const localIdx = merged.findIndex(i => String(i.id) === remote.product_id);
            if (localIdx >= 0) {
              // Local'de zaten var → local miktarı koru (daha taze)
            } else {
              // Sadece remote'da var → ürün datasını local JSON'dan bul
              const product = ceramicProducts.find(p => String(p.id) === remote.product_id);
              if (product) {
                merged.push({ ...product, quantity: remote.quantity });
              }
            }
          }
          // Birleştirilmiş sepeti Supabase'e kaydet
          syncToSupabase(merged);
          return merged;
        });
      } catch {
        // Hata olursa local sepet korunur
      }
    };

    fetchAndMerge();
  }, [user, mounted, syncToSupabase]);

  // Sepet değişince Supabase'e sync (kullanıcı giriş yapmışsa)
  useEffect(() => {
    if (!mounted || !user) return;
    // İlk merge tetiklemesi dışında sync et
    syncToSupabase(items);
  }, [items, user, mounted, syncToSupabase]);

  const addToCart = (product: CeramicProduct, quantity: number) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
    trackAddToCart(product, quantity);
  };

  const removeFromCart = (productId: number | string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number | string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
