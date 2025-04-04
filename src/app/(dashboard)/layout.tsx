import type { Metadata } from "next";
import { Geist, Montserrat } from "next/font/google";
import "../globals.css";
import { Providers } from "../providers";
import React from "react";

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
};

export default function DashboardLayout({children,}: Readonly<{children: React.ReactNode;}>) {
    return(
        <html lang="es" className="bg-gradient-to-b from-black to-violet-950 text-white h-screen">
            <body className={`${geistSans.variable} ${mont.className} antialiased`}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}