import { Product } from '@/product/products';
import {create} from 'zustand';

// interface CartItem extends Product {
//     quantity: number;
// }

// First steps into a Cart logic

interface ProductStore {
    selectedProduct: Product | null;
    setSelectedProduct: (product: Product) => void;
}
  

export const useProductStore = create<ProductStore>()((set) => ({
    selectedProduct: null,
    setSelectedProduct: (product: Product) => set({ selectedProduct: product }),
}));