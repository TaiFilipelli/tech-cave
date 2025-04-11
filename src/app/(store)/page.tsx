'use client';
import { Product } from "@/product/products";
import api from "@/product/api";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import ProductCard from "@/components/ProductCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch, faComputer, faShieldHalved, faTruckFast } from "@fortawesome/free-solid-svg-icons";
import { Divider } from "@heroui/react";
export default function Home() {

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  const { addToCart } = useCartStore((state) => state);

  useEffect(() => {
    const fetchProducts = async() => {
      try{
        const apiProducts = await api.list();

        const featured = [...apiProducts].sort(()=>0.5-Math.random());
        setFeaturedProducts(featured.slice(0,5));
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
      <h2 className="text-2xl font-bold m-5 p-5">Tuneá a la maleducada como te parezca. Lo necesitas? Lo tenemos.</h2> 
      <section className="mx-10">
        <h3 className="text-4xl font-bold mb-5">Productos <span className="bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">destacados</span>
        </h3> 
        { featuredProducts.length === 0 && (
          <article className="flex flex-col gap-4 m-10">
            <h1 className="text-xl font-semibold text-black mb-4">Preparando productos...</h1>
            <FontAwesomeIcon icon={faCircleNotch} spin size="2xl"/>
          </article>
        )}
        <div className="overflow-x-auto relative" style={{maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",}}>
          <article className="flex gap-6 flex-nowrap justify-center">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart}/>
            ))}
          </article>
        </div>
      </section>
      <Divider className="my-5"/>
      <section className="flex flex-row gap-4 justify-around items-center p-2">
        <article>
          <FontAwesomeIcon icon={faComputer} size="3x" className="mb-2"/>
          <h1 className="text-2xl font-bold">Todo lo que necesitas</h1>
          <p className="font-semibold">para tu PC de ensueño</p>
        </article>
        <article>
          <FontAwesomeIcon icon={faShieldHalved} size="3x" className="mb-2"/>
          <h1 className="text-2xl font-bold">Garantia oficial</h1>
          <p className="font-semibold">en todos los productos</p>
        </article>
        <article>
          <FontAwesomeIcon icon={faTruckFast} size="3x" className="mb-2"/>
          <h1 className="text-2xl font-bold">Envios a tu casa</h1>
          <p className="font-semibold">rápidos y seguros</p>  
        </article>
      </section>
      <Divider className="my-5"/>
    </main>
  );
}