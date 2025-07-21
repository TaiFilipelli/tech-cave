"use client";

import { Drawer, DrawerHeader, DrawerBody, DrawerContent, DrawerFooter, Button, useDisclosure, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faTrash, faFaceFrown, faMinusCircle, faPlusCircle, faUserXmark, faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";
import {faWhatsapp, faGoogle} from "@fortawesome/free-brands-svg-icons";
import React, { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";


const Cart = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { cart, clearCart, removeFromCart, updateCartItem } = useCartStore((state) => state);
  const [products, setProducts] = useState(cart);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [count, setCount] = useState(0);
  const [confirmDeleteProductId, setConfirmDeleteProductId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {data:session} = useSession();

  const router = useRouter();

  useEffect(() => {
    setProducts(cart);
    const newSubtotal = cart.reduce((acc, product) => {
      const price = Number(product.price.toString().replace(/[^0-9]/g, ''));
      return acc + price * product.cantidad;
    }, 0);
    
    setCount(cart.length);
    setSubtotal(newSubtotal);
  }, [cart]);

  const increaseQuantity = (id: number, cantidad: number) => {
    updateCartItem(id, cantidad + 1);
  };

  const decreaseQuantity = (id: number, cantidad: number) => {
    if (cantidad > 1) {
      updateCartItem(id, cantidad - 1);
    } else {
      setConfirmDeleteProductId(id);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmRemoveProduct = () => {
    if (confirmDeleteProductId !== null) {
      removeFromCart(confirmDeleteProductId);
      setConfirmDeleteProductId(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleBuy = () => {
    if(session?.user && session?.accessToken){
      setIsLogged(true);
    }
    setIsModalOpen(true);
  }

  const formattedSubtotal = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(subtotal);
  
  const sendMessage = () => {
      let message:string = "Hola! Deseo comprar estos componentes:%0A";
      const number:string = "3364181788";

      products.forEach((product) => {
        message += `${product.cantidad}x ${product.name} - ${product.price}%0A`;
      });

      message += `Total: ${formattedSubtotal}`;

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
    <div>
      {count > 0 && (
        <span className="fixed bottom-[6.5rem] right-16 bg-white text-black border-1 border-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center z-30">
        {count}
        </span>
      )}
      <Button onPress={onOpen} className="fixed bottom-16 right-16 bg-violet-600 text-white rounded-full p-7 shadow-md hover:bg-blue-700 transition-all border-1 border-black shadow-gray-600 z-20">
        <FontAwesomeIcon icon={faCartShopping} size="2xl" />
      </Button>
    </div>
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
                        <p className="text-gray-700 dark:text-gray-200">{product.price}</p>
                    </header>
                    <Button onPress={()=> removeFromCart(product.id)} className="bg-red-600 text-white font-bold rounded-full"><FontAwesomeIcon icon={faTrash}/></Button>
                  </div>
                  <div className="flex flex-row gap-5 mt-2 items-center">
                    <Button onPress={()=>decreaseQuantity(product.id, product.cantidad)} className="bg-transparent border-1 hover:bg-slate-100 dark:hover:bg-slate-700"><FontAwesomeIcon icon={faMinusCircle} size="lg"/></Button>
                    <p>x{product.cantidad}</p>
                    <Button onPress={()=>increaseQuantity(product.id, product.cantidad)} className="bg-transparent border-1 hover:bg-slate-100 dark:hover:bg-slate-700"><FontAwesomeIcon icon={faPlusCircle} size="lg"/></Button>
                  </div>
                </article>
              ))
            ) : (
                <section className="items-center justify-center text-center flex flex-col p-5 h-full">
                    <p className="text-center text-3xl font-bold mb-5">Tu carrito está vacío.</p>
                    <FontAwesomeIcon icon={faFaceFrown} size="4x"/>
                </section>
            )}
          </DrawerBody>
          <DrawerFooter className="flex flex-col gap-2">
            <h1 className="my-4 font-semibold text-2xl">Subtotal: {formattedSubtotal}</h1>
            <div className="flex flex-row justify-between gap-2">
                <Button className="bg-green-500 text-white dark:text-black font-bold w-1/2" onPress={handleBuy} startContent={<FontAwesomeIcon icon={faMoneyBillWave}/>}>Comprar</Button>
                <Button className="bg-red-600 text-white dark:text-black font-bold w-1/2" onPress={onClose}>Cerrar</Button>
            </div>
            <Button className="bg-gray-400 font-bold text-black" onPress={clearCart}><FontAwesomeIcon icon={faTrash}/>Limpiar carro</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {isDeleteModalOpen && (
        <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} backdrop='opaque' classNames={{backdrop: 'bg-gradient-to-t from-red-900 to-zinc-900/10 backdrop-opacity-20'}}>
          <ModalContent>
            <ModalHeader className="text-xl font-bold">Eliminar del carrito</ModalHeader>
            <ModalBody>
              <p>Estás por eliminar este producto del carrito. ¿Estás seguro?</p>
            </ModalBody>
            <ModalFooter className="flex gap-2">
              <Button variant="light" className="hover:underline" onPress={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
              <Button className="bg-red-600 text-white font-semibold text-lg" onPress={confirmRemoveProduct}>Eliminar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}

export default Cart;
