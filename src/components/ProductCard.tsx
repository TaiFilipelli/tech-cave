"use client";
import React, { useState, useEffect } from "react";
import { Button, Image, addToast, Card, CardBody, CardFooter } from "@heroui/react";
import { Product } from "@/product/products";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";

interface CartItem {
  id: number;
  name: string;
  price: number;
  cantidad: number;
  type: string;
  brand: string;
}

interface ProductCardProps {
  product: Product;
  addToCart: (product: CartItem) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart }) => {
  const [onCart, setOnCart] = useState(false);
  const router = useRouter();
  const cart = useCartStore((state) => state.cart);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      cantidad: 1,
      type: product.type,
      brand: product.brand,
    });
    setOnCart(true);
    addToast({
        title: "Producto agregado al carrito",
        timeout: 2000,
        shouldShowTimeoutProgess: true,
        color:"success",
    });
  };

  useEffect(() => {
    const isOnCart = cart.some(item => item.id === product.id);
    setOnCart(isOnCart);
  }, [cart, product.id]);

  return (
    <Card isPressable onPress={() => { router.push(`/details?name=${encodeURIComponent(product.name)}`);}} className={`group h-auto justify-between flex flex-col items-center bg-white text-black dark:bg-[#1F2937] dark:text-white rounded-3xl border-1 border-gray-300 dark:border-gray-600 hover:border-violet-600 transition-all duration-400 ${product.stock === 0 ? "opacity-50" : ""}`}>
      <CardBody className="relative w-[16rem] min-h-[16rem] p-0 overflow-hidden justify-center bg-white">
        <Image src={product.image} alt={product.name} className="object-cover transition-transform duration-500" width="100%" height="100%"/> 
      </CardBody>
      <CardFooter className="flex flex-col gap-2 z-10 text-small items-start border-t-1 border-black p-4">
        <header className="flex flex-col text-start">
          <h3 className="text-violet-500 py-1 px-2 border border-violet-500 rounded-2xl">{product.type}</h3>
          <h3 className="text-violet-500 py-1 px-2">{product.brand}</h3>
        </header>
        <h3 className="transition-colors duration-300 group-hover:text-violet-600 font-semibold text-medium">{product.name.length > 25 ? product.name.slice(0, 20) + "..." : product.name}</h3>
        <article className="flex flex-col text-start gap-2 w-full">
          <h3 className="font-semibold text-xl">{product.price}</h3>
          <Button className={`${onCart ? "bg-green-600": "bg-gray-300 dark:bg-violet-500"} w-full max-[1300px]:w-full hover:scale-105 font-bold dark:text-black`} onPress={handleAddToCart}>
            <FontAwesomeIcon icon={onCart ? faCheck : faCartShopping} size="xl" /> {onCart ? "Agregado" : "Agregar"}
          </Button>
        </article>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
