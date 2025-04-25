import type { Metadata } from "next";
import { Geist, Montserrat } from "next/font/google";
import "../globals.css";
import { Providers } from "../providers";
import Cart from "@/components/Cart";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ProductProvider } from "@/product/provider";
import api from "@/product/api";
import { Product } from "@/product/products";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const mont = Montserrat({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tech's Cave",
  description: "El lugar perfecto donde cumplir tus fetiches asquerosos con componentes electrónicos. Tuneá a la maleducada como te parezca, acá lo encontrás.",
};

export default async function RootLayout({ children, }: Readonly<{
  children: React.ReactNode;
}>) {
  const products: Product[] = await api.list();

  return (
    <html lang="en" className="bg-gray-200">
      <body className={`${geistSans.variable} ${mont.className} antialiased`}>
        <Providers>
          <ProductProvider products={products}>
            <Navbar/>
            {children}
            <Cart/>
            <Footer/>
          </ProductProvider>
        </Providers>
      </body>
    </html>
  );
}
