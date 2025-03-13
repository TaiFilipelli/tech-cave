import {MercadoPagoConfig, Preference} from "mercadopago";
import { CartItem } from "@/types/cart";

export const mp = new MercadoPagoConfig({ accessToken: process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN! });

const api = {    
    async createPayment (body: {cart: CartItem[]}){
        console.log('Entró al método createPayment');
        const preference = await new Preference(mp).create({
            body: {
                items: body.cart.map((product: CartItem) => ({
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
            },
        });
        console.log('Preferencia creada:',preference);
        const url:string = preference.init_point!;
        console.log('Deberia devolver esta url:',preference.init_point);
        return url;
    },
};

export default api;