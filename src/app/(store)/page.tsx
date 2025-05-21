'use client';
import { Product } from "@/product/products";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import ProductCard from "@/components/ProductCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch, faComputer, faShieldHalved, faTruckFast } from "@fortawesome/free-solid-svg-icons";
import { Divider } from "@heroui/react";
import Image from "next/image";
import { categories } from "@/data/categoriesData";
import { useRouter } from "next/navigation";
import { useProducts } from "@/product/provider";
import HeroSection from "@/components/HeroSection";
import BrandsStrip from "@/components/BrandsStrip";
export default function Home() {

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  const { addToCart } = useCartStore((state) => state);

  const router = useRouter();

  const products = useProducts();

  useEffect(() => {
    const featured = [...products].sort(()=>0.5-Math.random());
    setFeaturedProducts(featured.slice(0,5));
  }, [products]);

  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection/>
      <section className="flex flex-col text-left p-10 dark:bg-black dark:text-white">
        <h3 className='text-3xl font-bold my-5 opacity-0 animate-fade-up animation-delay-400'>Lo necesitas? Lo tenemos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category, index) =>{

            const delay = `${index * 100}ms`
            const delayClass = `animation-delay-[${delay}]`

            return(
            <article className={`relative w-full h-40 rounded-xl overflow-hidden shadow-lg group transition-transform hover:scale-105 hover:cursor-pointer opacity-0 animate-fade-up ${delayClass}`} key={index} onClick={() => {router.push(`/products?type=${category.type}`)}}>
              <Image src={category.img} alt={category.name} fill className="object-cover brightness-50"/> 
              <span className="absolute inset-0 flex text-white font-semibold text-xl z-10 p-5">{category.name}</span>
            </article>
          )
            
          })}
        </div>
      </section>
      <Divider className="mb-5"/>
        <BrandsStrip/>
      <Divider className="mb-5"/>
      <section className="mx-5 p-2 text-center">
        <h3 className="text-4xl font-bold mb-5">Productos <span className="bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">destacados</span></h3> 
        { featuredProducts.length === 0 && (
          <article className="flex flex-col gap-4 m-10">
            <h1 className="text-xl font-semibold text-black mb-4">Preparando productos...</h1>
            <FontAwesomeIcon icon={faCircleNotch} spin size="2xl"/>
          </article>
        )}
        <div className="overflow-x-auto w-full">
          <article className="flex gap-6 flex-nowrap px-4 justify-center">
            {featuredProducts.map((product) => (
              <div key={product.id} className="min-w-[250px]">
               <ProductCard product={product} addToCart={addToCart} />
              </div>
            ))}
          </article>
        </div>
      </section>
      <Divider className="my-5"/>
      <section className="flex flex-row max-[510px]:flex-col gap-4 justify-around items-center text-center p-2">
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
      <section id="about" className="flex flex-col text-center p-2">
        <h3 className="text-4xl font-bold mb-5">Quiénes <span className="bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">somos?</span></h3>

      </section>
    </main>
  );
}