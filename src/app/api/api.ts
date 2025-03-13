import { MercadoPagoConfig, Preference } from "mercadopago";
import { CartItem } from "@/types/cart";

export const mp = new MercadoPagoConfig({ 
    accessToken: process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN!,
    options:{
        
    }
});

const api = {    
    async createPayment(body: { cart: CartItem[] }) {
        try {
            console.log('Entró a la creación de preferencia con este body:', body.cart, 'y estas opciones:', mp);
            const preference = new Preference(mp);

            const response = await preference.create({
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
                    auto_return: "approved"
                },
            });

            console.log('Respuesta de la creación de preferencia:', response);

            const url: string = response.init_point!;
            console.log('Debería devolver esta URL:', url);

            return url;

        } catch (error) {
            console.error('Error al crear la preferencia:', error);
            throw error;
        }
    }
};

export default api;
