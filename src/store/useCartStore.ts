import { create } from 'zustand';

interface CartItem {
  id: number;
  name: string;
  price: number;
  cantidad: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (producto: CartItem) => void;
  removeFromCart: (idProducto: number) => void;
  updateCartItem: (idProducto: number, cantidad: number) => void;
  clearCart: () => void;
}

const getStoredCart = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  }
  return [];
};


const saveCart = (cart: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
};

export const useCartStore = create<CartStore>((set) => ({
  cart: getStoredCart(),

  addToCart: (producto: CartItem) => set((state) => {
    const existingProductIndex = state.cart.findIndex(item => item.id === producto.id);

    let updatedCart;
    if (existingProductIndex >= 0) {
      updatedCart = state.cart.map(item =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      );
    } else {
      updatedCart = [...state.cart, { ...producto, cantidad: 1 }];
    }

    saveCart(updatedCart);
    return { cart: updatedCart };
  }),

  removeFromCart: (idProducto: number) => set((state) => {
    const updatedCart = state.cart.filter(item => item.id !== idProducto);
    saveCart(updatedCart);
    return { cart: updatedCart };
  }),

  updateCartItem: (idProducto: number, cantidad: number) => set((state) => {
    const updatedCart = state.cart.map(item =>
      item.id === idProducto ? { ...item, cantidad } : item
    );

    saveCart(updatedCart);
    return { cart: updatedCart };
  }),

  clearCart: () => set(() => {
    saveCart([]);
    return { cart: [] };
  }),
}));
