'use client';
import { Product } from "@/product/products";
import api from "@/product/api";
import { useEffect, useState } from "react";
import { Image, Button } from "@heroui/react";

export default function Home() {

  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async() => {
      try{
        const apiProducts = await api.list();
        setProducts(apiProducts);
      }
      catch(err){
        console.error('ERROR FETCHING PRODUCTS:', err);
      }
    };

    fetchProducts();

    const interval = setInterval(fetchProducts, 3600000); // 1 hour
    return () => clearInterval(interval);

  }, []);


  return (
    <main className="bg-black m-10 text-center">
      <h1 className="text-6xl font-extrabold m-5 p-16"><span className="bg-gradient-to-b from-violet-600 to-yellow-500 bg-clip-text text-transparent">Tech`s</span> Cave</h1> 
      <section className="bg-gray-500 rounded-2xl items-center justify-center flex flex-col p-10 mb-10">
        <h1 className="font-bold text-5xl text-white mb-10">Products</h1>
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
          {products.map((product) => (
            <article key={product.id} className="justify-center flex flex-col items-center bg-white text-black shadow-black rounded-3xl p-5">
              <h2>{product.name} - {product.price}</h2>
              <Image src={product.image} alt={product.name} className="my-10" width={150} height={150}/>
              <Button className="bg-red-600 text-white font-bold">See more</Button>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}