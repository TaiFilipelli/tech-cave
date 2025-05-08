"use client";

import { Drawer, DrawerHeader, DrawerBody, DrawerContent, DrawerFooter, Button, useDisclosure, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faTrash, faFaceFrown, faMinusCircle, faPlusCircle, faUserXmark,   } from "@fortawesome/free-solid-svg-icons";
import {faWhatsapp, faGoogle} from "@fortawesome/free-brands-svg-icons";
import React, { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
// import api from "@/app/api/api";
import { useSession, signIn } from "next-auth/react";


const Cart = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { cart, clearCart, removeFromCart, updateCartItem } = useCartStore((state) => state);
  const [products, setProducts] = useState(cart);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const {data:session} = useSession();

  const router = useRouter();

  useEffect(() => {
    setProducts(cart);
    const newSubtotal = cart.reduce((acc, product) => {
      const price = Number(product.price.toString().replace(/[^0-9]/g, ''));
      return acc + price * product.cantidad;
    }, 0);
  
    setSubtotal(newSubtotal);
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

  const handleBuy = () => {
    if(session?.user && session?.accessToken){
      setIsLogged(true);
    }
    setIsModalOpen(true);
  }

  
  const sendMessage = () => {
      let message:string = "Hola! Deseo comprar estos componentes:%0A";
      const number:string = "3364181788";
      let subtotal:number = 0;

      products.forEach((product) => {
        message += `${product.cantidad}x ${product.name} - ${product.price}%0A`;
        subtotal +=  Number(product.price.toString().replace(/[^0-9.,]/g, '').replace(',', '.')) * product.cantidad;
      });

      message += `Total: $${subtotal}`;
      console.log(subtotal);

    // return router.push(`https://wa.me/${number}?text=${message}`)
    return console.log('A este numero:', number, 'con el mensaje:', message, 'le llega este subtotal:', subtotal);
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

  const formattedSubtotal = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(subtotal);
  
  return (
    <>
      <Button onPress={onOpen} className="fixed bottom-16 right-16 bg-violet-600 text-white rounded-full p-7 shadow-md hover:bg-blue-700 transition-all border-1 border-black shadow-gray-600 z-20">
        <FontAwesomeIcon icon={faCartShopping} size="2xl" />
      </Button>

      {isModalOpen && (
      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
      <ModalContent>
        <ModalHeader className="text-2xl font-bold">Finalizar compra</ModalHeader>
        {isLogged ?
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
        :
          <ModalBody>
            <FontAwesomeIcon icon={faUserXmark} size="2xl" className="animate-appearance-in"/>
            <h1 className="text-2xl font-bold">Inicia sesión para continuar</h1>
            <p className="text-gray-700 ">Para poder comprar, debes iniciar sesión.</p>
            <Button onPress={() => signIn("google")} startContent={<FontAwesomeIcon icon={faGoogle} size="xl"/>} className="bg-violet-600 text-white w-full font-semibold text-lg p-6">Iniciar sesión</Button>
          </ModalBody>
        }

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
            <h1 className="my-4 font-semibold text-2xl">Subtotal: {formattedSubtotal}</h1>
            <div className="flex flex-row justify-between gap-2">
                <Button className="bg-green-500 text-white font-bold w-1/2" onPress={handleBuy}>Comprar</Button>
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
