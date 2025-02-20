'use client';
import { Product } from "@/product/products";
import api from "@/product/api";
import { useEffect, useState } from "react";
import { useProductStore } from "@/store/productsStore";
import { useRouter } from "next/navigation";
import { Image, Button } from "@heroui/react";

export default function Home() {

  const router = useRouter();
  const setSelectedProduct = useProductStore((state) => state.setSelectedProduct);

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
    <main className=" m-10 text-center">
      <h1 className="text-6xl font-extrabold pt-12 pb-6"><span className="bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">Tech`s</span> Cave</h1>
      <h2 className="text-2xl font-bold m-5 pb-12">El lugar perfecto donde cumplir tus fetiches más oscuros (informáticos, al menos). Tuneá a la maleducada como te parezca, nosotros lo tenemos.</h2> 
      <section className="bg-white rounded-2xl items-center justify-center flex flex-col p-10 mb-10">
        <h1 className="font-bold text-5xl text-black mb-10">Productos</h1>
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {products.map((product) => (
            <article key={product.id} className={`justify-center flex flex-col items-center bg-white text-black shadow-black rounded-3xl p-5 border-1 border-black ${product.stock === 0 ? "opacity-50" : ""}`}>
              <Image src={product.image} alt={product.name} className="my-10 object-cover" width={150} height={150}/>
              <h2>{product.name} - {product.price}</h2>
              <Button className="bg-red-600 text-white w-full font-bold" onPress={() => { setSelectedProduct(product); router.push("/details");}}>Ver más</Button>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}