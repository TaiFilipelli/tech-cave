"use client";

import { Drawer, DrawerHeader, DrawerBody, DrawerContent, DrawerFooter, Button, useDisclosure} from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";

const Cart = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { cart } = useCartStore((state) => state);
  const [products, setProducts] = useState(cart);

  useEffect(() => {
    setProducts(cart);
  }, [cart]);

  return (
    <>
      <Button 
        onPress={onOpen} 
        className="fixed bottom-5 right-5 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all"
      >
        <FontAwesomeIcon icon={faCartShopping} size="xl" />
      </Button>

      <Drawer isOpen={isOpen} onOpenChange={onClose}>
        <DrawerContent>
          <DrawerHeader className="text-lg font-bold">Carrito de Compras</DrawerHeader>
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
              <p className="text-center text-gray-500">Tu carrito está vacío.</p>
            )}
          </DrawerBody>
          <DrawerFooter>
            <Button className="w-full bg-green-600 text-white font-bold" onPress={onClose}>
              Cerrar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Cart;
