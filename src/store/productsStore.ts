import { Product } from '@/product/products';
import {create} from 'zustand';

interface ProductStore {
    selectedProduct: Product | null;
    setSelectedProduct: (product: Product) => void;
}
  

export const useProductStore = create<ProductStore>()((set) => ({
    selectedProduct: null,
    setSelectedProduct: (product: Product) => set({ selectedProduct: product }),
}));