"use client";

import { createContext, useContext } from "react";
import { Product } from "@/product/products";

const ProductContext = createContext<Product[]>([]);

export const ProductProvider = ({
  children,
  products,
}: {
  children: React.ReactNode;
  products: Product[];
}) => {
  return (
    <ProductContext.Provider value={products}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
