import { CartItem } from "@/types/cart";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { cart } = await req.json();

        if (!cart || !Array.isArray(cart)) {
            return NextResponse.json({ error: "El carrito es inválido" }, { status: 400 });
        }

        const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN!}`,
            },
            body: JSON.stringify({
                items: cart.map((product: CartItem) => ({
                    id: product.id.toString(),
                    title: product.name,
                    quantity: product.cantidad,
                    currency_id: "ARS",
                    unit_price: Number(String(product.price).replace(/[$.]/g, "")),
                })),
                back_urls: {
                    success: "https://tech-cave.vercel.app/result",
                    failure: "https://tech-cave.vercel.app/result",
                    pending: "https://tech-cave.vercel.app/result",
                },
                auto_return: "approved",
            }),
        });

        if (!response.ok) {
            throw new Error("Error en la solicitud a MercadoPago");
        }

        const data = await response.json();
        return NextResponse.json({ url: data.init_point }, { status: 200 });

    } catch (error) {
        console.error("Error al crear la preferencia:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
