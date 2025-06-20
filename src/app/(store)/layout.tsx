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
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const mont = Montserrat({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tech's Cave",
  description: "El lugar perfecto donde llevar tu equipo al próximo nivel. Componentes electrónicos de alta gama con el mejor precio.",
  icons:{
    icon: "/logo.png",
    shortcut: "/logo.png",
  }
};

export default async function RootLayout({ children, }: Readonly<{
  children: React.ReactNode;
}>) {
  const products: Product[] = await api.list();

  const cookieStore = await cookies();
  const token = cookieStore.get("userToken")?.value;

  let isAdmin = false;

 if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        isAdmin?: boolean;
      };
      isAdmin = decoded.isAdmin === true;
    } catch (err) {
      console.error("Error al verificar token:", err);
    }
  }

  return (
    <html lang="en" className="bg-gray-200 dark:bg-black dark:text-white h-[100dvh]" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${mont.className} antialiased dark:bg-black dark:text-white`}>
        <Providers>
          <ProductProvider products={products}>
            <Navbar isAdmin={isAdmin}/>
            {children}
            <Cart/>
            <Footer/>
          </ProductProvider>
        </Providers>
      </body>
    </html>
  );
}
