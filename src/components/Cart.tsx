"use client";

import { Drawer, DrawerHeader, DrawerBody, DrawerContent, DrawerFooter, Button, useDisclosure, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faTrash, faFaceFrown, faMinusCircle, faPlusCircle  } from "@fortawesome/free-solid-svg-icons";
import {faWhatsapp} from "@fortawesome/free-brands-svg-icons";
import React, { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
// import api from "@/app/api/api";
import { useSession } from "next-auth/react";


const Cart = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { cart, clearCart, removeFromCart, updateCartItem } = useCartStore((state) => state);
  const [products, setProducts] = useState(cart);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {data:session} = useSession();

  const router = useRouter();

  useEffect(() => {
    setProducts(cart);
  }, [cart]);

  const increaseQuantity = (id: number, cantidad: number) => {
    updateCartItem(id, cantidad + 1);
  };

  const decreaseQuantity = (id: number, cantidad: number) => {
    if (cantidad > 1) {
      updateCartItem(id, cantidad - 1);
    } else {
      removeFromCart(id);
    }
  };

  
  const sendMessage = () => {
      let message:string = "Hola! Deseo comprar estos componentes:%0A";
      const number:string = "3364181788";
      let subtotal:number = 0;

      products.forEach((product) => {
        message += `${product.cantidad}x ${product.name} - ${product.price}%0A`;
        subtotal += product.price * product.cantidad;
      });

      message += `Total: $${subtotal}`;
      console.log(subtotal);

    return router.push(`https://wa.me/${number}?text=${message}`)
  }
  const handleMP = async () => {
    try {
        localStorage.setItem("buyerEmail", session?.user?.email || "");

        const response = await fetch("/api/mercadopago/pagos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart: products }),
        });

        const data = await response.json();

        console.log('DATA:', data);
        
        if (!data.url) {
            throw new Error("No se recibió una URL de pago");
        }

        router.push(data.url);

    } catch (err) {
        console.error("ERROR PROCESANDO EL PAGO:", err);
    }
};

  
  return (
    <>
      <Button onPress={onOpen} className="fixed bottom-16 right-16 bg-blue-600 text-white rounded-full p-7 shadow-md hover:bg-blue-700 transition-all border-1 border-black shadow-gray-600 z-20">
        <FontAwesomeIcon icon={faCartShopping} size="2xl" />
      </Button>

      {isModalOpen && (
      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
      <ModalContent>
        <ModalHeader className="text-2xl font-bold">Finalizar compra</ModalHeader>
        <ModalBody>
          <h1>Seleccione el método de pago:</h1>
          <ul className="gap-4 list-item">
            <li className="mb-2">WhatsApp: Contacta directamente con el vendedor para transferencias o efectivo</li>
            <li>MercadoPago: Paga con tarjeta de crédito, débito o con billeteras virtuales</li>
          </ul>
          <Button className="bg-green-500 text-white w-full font-semibold text-lg" startContent={<FontAwesomeIcon icon={faWhatsapp} size="xl"/>} onPress={sendMessage}>
            WhatsApp
          </Button>
          <Button className="bg-blue-600 text-white w-full font-semibold text-lg" onPress={handleMP}>
            MercadoPago
          </Button>
        </ModalBody>
        <ModalFooter>
          <Button className="bg-red-600 w-full text-white font-semibold text-lg" onPress={() => setIsModalOpen(false)}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
      </Modal>
      )}
      <Drawer isOpen={isOpen} onOpenChange={onClose}>
        <DrawerContent>
          <DrawerHeader className="text-2xl font-bold">Carrito de Compras</DrawerHeader>
          <DrawerBody>
            {products.length > 0 ? (
              products.map((product) => (
                <article key={product.id} className="flex flex-col p-3 border-b border-gray-200">
                  <div className="flex flex-row justify-between items-center">
                    <header>
                        <h1 className="font-semibold">{product.name}</h1>
                        <p className="text-gray-700">{product.price}</p>
                    </header>
                    <Button onPress={()=> removeFromCart(product.id)} className="bg-red-600 text-white font-bold"><FontAwesomeIcon icon={faTrash}/></Button>
                  </div>
                  <div className="flex flex-row gap-5 mt-2 items-center">
                    <Button onPress={()=>decreaseQuantity(product.id, product.cantidad)} className="bg-transparent border-1 hover:bg-slate-100"><FontAwesomeIcon icon={faMinusCircle} size="lg"/></Button>
                    <p>x{product.cantidad}</p>
                    <Button onPress={()=>increaseQuantity(product.id, product.cantidad)} className="bg-transparent border-1 hover:bg-slate-100"><FontAwesomeIcon icon={faPlusCircle} size="lg"/></Button>
                  </div>
                </article>
              ))
            ) : (
                <section className="items-center justify-center text-center flex flex-col p-5">
                    <p className="text-center text-3xl font-bold mb-5">Tu carrito está vacío.</p>
                    <FontAwesomeIcon icon={faFaceFrown} size="2xl"/>
                </section>
            )}
          </DrawerBody>
          <DrawerFooter className="flex flex-col gap-2">
            <div className="flex flex-row justify-between gap-2">
                <Button className="bg-green-500 text-white font-bold w-1/2" onPress={() => setIsModalOpen(true)}>Comprar</Button>
                <Button className="bg-red-600 text-white font-bold w-1/2" onPress={onClose}>Cerrar</Button>
            </div>
            <Button className="bg-gray-400 font-bold text-black" onPress={clearCart}><FontAwesomeIcon icon={faTrash}/>Limpiar carro</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Cart;
