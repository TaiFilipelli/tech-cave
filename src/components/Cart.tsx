"use client";

import { Drawer, DrawerHeader, DrawerBody, DrawerContent, DrawerFooter, Button, useDisclosure} from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faTrash, faFaceFrown } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";

const Cart = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { cart } = useCartStore((state) => state);
  const {clearCart} = useCartStore((state) => state);
  const [products, setProducts] = useState(cart);

  const router = useRouter();

  useEffect(() => {
    setProducts(cart);
  }, [cart]);


  
  const sendMessage = () => {
      let message:string = "Hola! Deseo comprar estos componentes:%0A";
      const number:string = "3364181788";
      let subtotal:number = 0;

      products.forEach((product) => {
        message += `${product.cantidad}x ${product.name} - ${product.price}%0A`;
        subtotal += product.price * product.cantidad;
      });

      message += `Total: $${subtotal}`
    return router.push(`https://wa.me/${number}?text=${message}`)

  }
  return (
    <>
      <Button onPress={onOpen} className="fixed bottom-16 right-16 bg-blue-600 text-white rounded-full p-7 shadow-lg hover:bg-blue-700 transition-all">
        <FontAwesomeIcon icon={faCartShopping} size="2xl" />
      </Button>

      <Drawer isOpen={isOpen} onOpenChange={onClose}>
        <DrawerContent>
          <DrawerHeader className="text-2xl font-bold">Carrito de Compras</DrawerHeader>
          <DrawerBody>
            {products.length > 0 ? (
              products.map((product) => (
                <article key={product.id} className="flex justify-between items-center p-3 border-b border-gray-200">
                  <h1 className="font-semibold">{product.name}</h1>
                  <p className="text-gray-700">{product.price}</p>
                  <p className="text-sm text-gray-600">x{product.cantidad}</p>
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
            <Button className="bg-gray-400 font-bold text-black" onPress={clearCart}><FontAwesomeIcon icon={faTrash}/>Limpiar carro</Button>
            <div className="flex flex-row justify-between gap-2">
                <Button className="bg-green-500 text-white font-bold w-1/2" onPress={sendMessage}>Comprar</Button>
                <Button className="bg-red-600 text-white font-bold w-1/2" onPress={onClose}>Cerrar</Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Cart;
