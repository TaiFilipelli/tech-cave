'use client';
import { Product } from "@/product/products";
import api from "@/product/api";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import ProductCard from "@/components/ProductCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

export default function Home() {

  const [products, setProducts] = useState<Product[]>([]);

  const { addToCart } = useCartStore((state) => state);

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
    <main className="m-10 text-center">
      <h2 className="text-2xl font-bold m-5 pb-12">Tuneá a la maleducada como te parezca. Lo necesitas? Lo tenemos.</h2> 
      <section className="bg-white rounded-2xl items-center justify-center flex flex-col p-10 mb-10">
        <h1 className="font-bold text-5xl text-black mb-10">Productos</h1>
        { products.length>0 ? 
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </section>
          :
          <section className="flex flex-col gap-4 m-10">
            <h1 className="text-xl font-semibold text-black mb-4">Preparando productos...</h1>
            <FontAwesomeIcon icon={faCircleNotch} spin size="2xl" />
          </section>
        }
      </section>
    </main>
  );
}