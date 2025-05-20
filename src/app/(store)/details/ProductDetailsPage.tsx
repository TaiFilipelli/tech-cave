'use client';
import { addToast, Button, Image } from "@heroui/react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartArrowDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/product/provider";
import { Product } from "@/product/products";

export default function ProductDetailsClient() {
  
    
    const [isOnCart, setIsOnCart] = useState(false);
    const { addToCart } = useCartStore((state) => state);
    const productName = useSearchParams().get("name");

    const products = useProducts();
    const product: Product | undefined = products.find((product) => product.name == productName);

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
    });

    addToast({
      title: "Producto agregado al carrito",
      timeout: 2000,
      shouldShowTimeoutProgess: true,
      color: "success",
    });
  };

  return (
    <main className="p-20 max-[640px]:p-5 mt-4 max-[640px]:mt-[7.5rem]">
      <Button as={Link} href="/" className="bg-red-600 text-white font-bold text-3xl items-center text-center">←</Button>
      <section className="bg-white text-black mt-10 mb-16 items-center rounded-2xl border-1 border-black">
        <article className="flex flex-wrap max-[1000px]:flex-col max-[800px]:items-center p-10 max-[400px]:px-2">
          <div className="w-1/3 max-[800px]:w-2/3 max-[500px]:w-full flex items-center justify-center ">
            <Image src={product.image} alt={product.name} className="object-cover max-h-72"/>
          </div>
          <div className="w-2/3 max-[450px]:w-full">
            <p className="text-xl text-violet-600">{product.brand}</p>
            <h1 className="text-4xl max-[500px]:text-3xl font-bold my-3">{product.name}</h1>
            <p className="text-2xl text-violet-600 font-semibold">{product.type}</p>
            <h3 className="text-4xl font-semibold mt-5 text-green-600">{product.price}</h3>
            <Button startContent={<FontAwesomeIcon icon={faCartArrowDown}/>} className={`w-1/2 max-[1000px]:w-2/3 max-[650px]:w-full text-xl text-white font-semibold rounded-2xl my-5 ${isOnCart ? "bg-green-600" : "bg-violet-500"}`} onPress={handleAddToCart} isDisabled={isOnCart}>
              {isOnCart ? "Agregado" : "Agregar"}
            </Button>
            <h4 className={`text-lg font-semibold ${product.stock > 15 ? "text-green-700" : product.stock > 10 ? "text-orange-500" : "text-red-600"}`}>
              Stock {product.stock > 15 ? "alto" : product.stock > 10 ? "medio" : "bajo"}, {product.stock} disponibles
            </h4>
          </div>
            <p className="text-xl font-bold mt-5">Sobre este producto:</p>
            <p>{product.description}</p>
        </article>
      </section>
    </main>
  );
}
