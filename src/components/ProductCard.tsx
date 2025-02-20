"use client";
import React, { useState } from "react";
import { Button, Image, addToast } from "@heroui/react";
import { Product } from "@/product/products";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/store/productsStore";

interface CartItem {
  id: number;
  name: string;
  price: number;
  cantidad: number;
}

interface ProductCardProps {
  product: Product;
  addToCart: (product: CartItem) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart }) => {
  const [onCart, setOnCart] = useState(false);
  const router = useRouter();
  const setSelectedProduct = useProductStore((state) => state.setSelectedProduct);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      cantidad: 1,
    });
    setOnCart(true);
    addToast({
        title: "Producto agregado al carrito",
        timeout: 2000,
        shouldShowTimeoutProgess: true,
        color:"success",
    });
  };

  return (
    <article className={`justify-center flex flex-col items-center bg-white text-black shadow-black rounded-3xl p-5 border-1 border-black ${product.stock === 0 ? "opacity-50" : ""}`}>
      <Image src={product.image} alt={product.name} className="my-10 object-cover" width={150} height={150} />
      <h2>{product.name}</h2>
      <h3>{product.price}</h3>
      <div className="w-full flex justify-between gap-5">
        <Button className={`${onCart ? "bg-green-600": "bg-gray-300"} w-3/4 hover:scale-105 font-bold`} onPress={handleAddToCart}>
          <FontAwesomeIcon icon={onCart ? faCheck : faCartShopping} size="xl" /> {onCart ? "Agregado" : "Agregar"}
        </Button>
        <Button className="bg-red-600 text-white w-1/2 font-bold hover:scale-105" onPress={() => { 
          setSelectedProduct(product); 
          router.push("/details");
        }}>
          Ver más
        </Button>
      </div>
    </article>
  );
};

export default ProductCard;
