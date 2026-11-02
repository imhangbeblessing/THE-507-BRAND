import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const StoreContext = createContext(null);

function readStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.error(`Unable to read ${key} from local storage.`, error);
    return fallback;
  }
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => readStorage('507-cart', []));
  const [wishlist, setWishlist] = useState(() => readStorage('507-wishlist', []));
  const [orders, setOrders] = useState(() => readStorage('507-orders', []));
  const [notice, setNotice] = useState('');

  useEffect(() => localStorage.setItem('507-cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('507-wishlist', JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem('507-orders', JSON.stringify(orders)), [orders]);
  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(''), 2800);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const value = useMemo(() => ({
    cart,
    wishlist,
    orders,
    notice,
    notify: setNotice,
    addToCart: (product, quantity = 1, selections = {}) => {
      setCart((items) => {
        const key = `${product.id}-${selections.size || 'custom'}-${selections.color || ''}`;
        const current = items.find((item) => item.key === key);
        if (current) return items.map((item) => item.key === key ? { ...item, quantity: item.quantity + quantity } : item);
        return [...items, { key, product, quantity, selections }];
      });
      setNotice(`${product.name} added to your bag`);
    },
    updateQuantity: (key, quantity) => setCart((items) => items.map((item) => item.key === key ? { ...item, quantity: Math.max(1, quantity) } : item)),
    removeFromCart: (key) => setCart((items) => items.filter((item) => item.key !== key)),
    clearCart: () => setCart([]),
    toggleWishlist: (product) => {
      setWishlist((items) => items.some((item) => item.id === product.id)
        ? items.filter((item) => item.id !== product.id)
        : [...items, product]);
      setNotice(wishlist.some((item) => item.id === product.id) ? 'Removed from your wishlist' : 'Saved to your wishlist');
    },
    submitOrder: (order) => {
      const saved = { ...order, reference: `507-${Date.now().toString().slice(-7)}`, status: 'Order received', createdAt: new Date().toISOString() };
      setOrders((items) => [saved, ...items]);
      return saved;
    },
  }), [cart, wishlist, orders, notice]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}
