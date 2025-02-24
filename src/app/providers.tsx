"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <HeroUIProvider>
                <ToastProvider placement="bottom-center" />
                {children}
            </HeroUIProvider>
        </SessionProvider>
    );
}