"use client";

import { createContext, useContext, ReactNode } from "react";
import { Order } from "./order";

const OrderContext = createContext<Order[] | undefined>(undefined);

export const OrderProvider = ({
  children,
  orders,
}: {
  children: ReactNode;
  orders: Order[];
}) => {
  return (
    <OrderContext.Provider value={orders}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
