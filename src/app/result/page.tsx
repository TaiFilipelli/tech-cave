"use client";

import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

const ResultPage = () => {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<string | null>(null);

    
    useEffect(() => {
        console.log("HOLA! ENTRÓ!");
        if(!searchParams) return;

        const paymentStatus = searchParams.get("status");
        console.log('Estado del pago recibido:',paymentStatus);

        if (paymentStatus === "approved") {
            handleOrder();
        }
        setStatus(paymentStatus);
    }, [searchParams]);

    const handleOrder = async () => {

        if (typeof window === "undefined") return;

        const userEmail = localStorage.getItem("buyerEmail");
        const cart = localStorage.getItem("cart")!;
        
        const orderData = {
            payment_id: searchParams.get("payment_id"),
            collection_id: searchParams.get("collection_id"),
            status: searchParams.get("status"),
            payment_type: searchParams.get("payment_type"),
            date: new Date().toISOString(),
            user_email: userEmail,
            items: JSON.parse(cart),
        };

        console.log("Registrando orden:", orderData);

        const response = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData),
        });

        console.log('Habemus response:', response);

        const data = await response.json();
        if (data.success) {
            console.log("Orden guardada con ID:", data.id);
        } else {
            console.error("Error al guardar orden:", data.error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-10">
            <h1 className="text-2xl font-bold">Estado del pago: {status === null ? "ERROR" : status}</h1>
            {status !== null ? ( 
              status === "approved" ? (
              <p className="text-green-500">¡Pago exitoso! Registrando la orden...</p>
          ) : (
              <p className="text-red-500">Hubo un error al aprobar el pago. Inténtelo nuevamente.</p>
          ))
            : 
              <h1 className="text-2xl font-semibold">
                Hubo un error al realizar el pago. Por favor, intentelo nuevamente.
              </h1>
            }
           
        </div>
    );
};


const ResultPageWrapper = () => {

    return(
        <Suspense fallback={<FontAwesomeIcon icon={faCircleNotch} spin/>}>
            <ResultPage/>
        </Suspense>
    );
};
export default ResultPageWrapper;
