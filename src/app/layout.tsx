import type { Metadata } from "next";
import { Geist, Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Cart from "@/components/Cart";
import Navbar from "@/components/Navbar";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-gray-200">
      <body className={`${geistSans.variable} ${mont.className} antialiased`}>
        <Providers>
          <Navbar/>
          {children}
          <Cart/>
        </Providers>
      </body>
    </html>
  );
}
