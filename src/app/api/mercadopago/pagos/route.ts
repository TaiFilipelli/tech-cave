import {mp} from "@/app/api/api";
import { Payment } from "mercadopago";

export async function POST(req: Request) {
    try {
        const body: { data: { id: string } } = await req.json();
        console.log("BODY RECIBIDO:", body);

        if (!body?.data?.id) {
            return new Response(JSON.stringify({ error: "Falta el ID de pago." }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const paymentConfirm = await new Payment(mp).get({id: body.data.id});
        console.log("ESTADO DEL PAGO:", paymentConfirm);

        if(paymentConfirm.status === 'approved'){
            return new Response(JSON.stringify({ status: paymentConfirm }), {
                status: paymentConfirm ? 200 : 400,
                headers: { "Content-Type": "application/json" },
            });
        }
    } catch (error) {
        console.error("ERROR EN EL ENDPOINT DE PAGO:", error);
        return new Response(JSON.stringify({ error: error }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
