import type { Metadata } from "next";
import { Geist, Montserrat } from "next/font/google";
import "../globals.css";
import { Providers } from "../providers";
import React from "react";
import api from "@/product/api";
import { Product } from "@/product/products";
import { ProductProvider } from "@/product/provider";
import { getCachedOrders } from "@/orders/api";
import { OrderProvider } from "@/orders/provider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});
  
  const mont = Montserrat({
    subsets: ["latin"],
});
  
  export const metadata: Metadata = {
    title: "Tech's Cave Dashboard",
    description: "Panel de administración de Tech's Cave",
    icons:{
        icon:"/logo_dragon_admin.png",
        shortcut:"/logo_dragon_admin.png",
    }
};

export default async function DashboardLayout({children,}: Readonly<{children: React.ReactNode;}>) {

    const products: Product[] = await api.list();
    const orders = await getCachedOrders();

    return(
        <html lang="es" className="bg-gradient-to-b from-black to-violet-950 text-white h-screen" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${mont.className} antialiased`}>
                <Providers>
                    <ProductProvider products={products}>
                        <OrderProvider orders={orders}>
                            {children}
                        </OrderProvider>
                    </ProductProvider>
                </Providers>
            </body>
        </html>
    )
}