'use client';
import { addToast, Button, Image } from "@heroui/react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartArrowDown, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/product/provider";
import { Product } from "@/product/products";

export default function ProductDetailsClient() {
  
    const [isOnCart, setIsOnCart] = useState(false);
    const { cart, addToCart, removeFromCart } = useCartStore((state) => state);
    const productName = useSearchParams().get("name");

    const products = useProducts();
    const product: Product | undefined = products.find((product) => product.name == productName);

    useEffect(() => {
        if (!product) return;
        const isOnCart = cart.some(item => item.id === product.id);
        setIsOnCart(isOnCart);
    }, [cart, product]);

    if(!product){
        return (
            <main className="p-20 text-center text-xl mt-20">
            <h1 className="font-bold text-4xl mb-10">Producto no encontrado</h1>
            <Link href="/" className="text-blue-500 underline">Volver a la tienda</Link>
            </main>
        );
    }

  const handleAddToCart = () => {
    setIsOnCart(true);

    addToCart({
      id: product!.id,
      name: product!.name,
      price: product!.price,
      cantidad: 1,
      type: product!.type,
      brand: product!.brand,
    });

    addToast({
      title: "Producto agregado al carrito",
      timeout: 2000,
      shouldShowTimeoutProgess: true,
      color: "success",
    });
  };

  
  const handleRemoveCart = () => {
    setIsOnCart(false);
    
    removeFromCart(product!.id);
    
    addToast({
      title: "Producto eliminado del carrito",
      timeout: 2000,
      shouldShowTimeoutProgess: true,
      color: "foreground",
    });
  };

  return (
    <main className="pt-32 pb-14 px-20 max-[640px]:p-5 max-[640px]:mt-[7.5rem]"> 
      <Button as={Link} href="/products" className="bg-transparent border-1 border-red-600 text-red-600 font-bold text-3xl items-center text-center">←</Button>
      <section className="bg-white dark:bg-[#1F2937] text-black dark:text-white mt-10 mb-16 items-center rounded-2xl border-1 border-black">
        <article className="flex flex-wrap max-[1000px]:flex-col max-[800px]:items-center p-10 max-[400px]:px-2">
          <div className="w-1/3 max-[800px]:w-2/3 max-[500px]:w-full flex items-center justify-center ">
            <Image src={product.image} alt={product.name} className="object-cover max-h-72"/>
          </div>
          <div className="w-2/3 max-[450px]:w-full">
            <p className="text-xl text-violet-600 dark:text-violet-400">{product.brand}</p>
            <h1 className="text-4xl max-[500px]:text-3xl font-bold my-3">{product.name}</h1>
            <p className="text-2xl text-violet-600 dark:text-violet-400 font-semibold">{product.type}</p>
            <h3 className="text-4xl font-semibold mt-5 text-green-600">{product.price}</h3>
            <div className="flex flex-wrap gap-2">
              <Button startContent={<FontAwesomeIcon icon={faCartArrowDown}/>} className={`w-1/2 max-[1000px]:w-2/3 max-[650px]:w-full text-xl text-white font-semibold rounded-2xl my-5 ${isOnCart ? "bg-green-600" : "bg-violet-500"}`} onPress={handleAddToCart} isDisabled={isOnCart}>
                {isOnCart ? "Agregado" : "Agregar"}
              </Button>
              <Button startContent={<FontAwesomeIcon icon={faTrash}/>} className={`w-auto max-[650px]:w-full text-xl text-white font-semibold rounded-2xl my-5 bg-red-600`} onPress={handleRemoveCart} isDisabled={!isOnCart}>
                {isOnCart ? "Eliminar del carrito" : ""}
              </Button>
            </div>
            <h4 className={`text-lg font-semibold ${product.stock > 15 ? "text-green-700" : product.stock > 10 ? "text-orange-500" : "text-red-600"}`}>
              Stock {product.stock > 15 ? "alto" : product.stock > 10 ? "medio" : "bajo"}, {product.stock} disponibles
            </h4>
          </div>
          <div className="flex flex-wrap items-center mt-5">
            <p className="text-xl font-bold">Sobre este producto:</p>
            <p className="py-3">{product.description}</p>
          </div>
        </article>
      </section>
    </main>
  );
}
