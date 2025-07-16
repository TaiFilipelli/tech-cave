'use client';
import { Product } from "@/product/products";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import ProductCard from "@/components/ProductCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch, faComputer, faShieldHalved, faTruckFast, faBox } from "@fortawesome/free-solid-svg-icons";
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
    const featured = [...products].sort(()=>0.9-Math.random());
    setFeaturedProducts(featured.slice(0,8));
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
            </article>)
          })}
        </div>
      </section>
      <div className="w-full dark:bg-gradient-to-b dark:from-black dark:to-gray-900/70">
        <Divider className="mb-5 dark:bg-black"/>
      </div>
        <BrandsStrip/>
      <div className="w-full dark:bg-gradient-to-b dark:from-gray-900/70 dark:to-black">
        <Divider className="my-5 dark:bg-black"/>
      </div>
      <section className="mx-5 p-2 text-center">
        <h3 className="text-4xl font-bold mb-5">Productos <span className="bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">destacados</span></h3> 
        { featuredProducts.length === 0 && (
          <article className="flex flex-col gap-4 m-10">
            <h2 className="text-xl font-semibold text-black mb-4">Preparando productos...</h2>
            <FontAwesomeIcon icon={faCircleNotch} spin size="2xl"/>
          </article>
        )}
        <div className="overflow-x-auto scrollbar-thin py-2 w-full" style={{ WebkitMaskImage: "linear-gradient(to right, black 90%, transparent)", maskImage: "linear-gradient(to right, black 95%, transparent)",}}>
          <article className="flex gap-6 flex-nowrap px-4">
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
          <h4 className="text-2xl font-bold">Todo lo que necesitas</h4>
          <p className="font-semibold">para tu PC de ensueño</p>
        </article>
        <article>
          <FontAwesomeIcon icon={faShieldHalved} size="3x" className="mb-2"/>
          <h4 className="text-2xl font-bold">Garantia oficial</h4>
          <p className="font-semibold">en todos los productos</p>
        </article>
        <article>
          <FontAwesomeIcon icon={faTruckFast} size="3x" className="mb-2"/>
          <h4 className="text-2xl font-bold">Envios a tu casa</h4>
          <p className="font-semibold">rápidos y seguros</p>  
        </article>
      </section>
      <Divider className="my-5"/>
      <section id="about" className="flex flex-col text-center p-2 bg-gradient-to-b from-gray-200 to-gray-300 dark:from-black dark:to-gray-900">
        <h3 className="text-5xl font-bold mb-5 tracking-tighter">Qué es <span className="bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">{`Tech's`} Cave?</span></h3>
        <h4 className="text-xl font-semibold">2 años llevando calidad e innovación a los escritorios.</h4>
        <section className="flex flex-row max-[650px]:flex-col gap-4 justify-between max-[650px]:justify-center my-20 max-[650px]:my-5">
            <article className="flex flex-col justify-start text-left p-5 w-1/2 max-[650px]:w-full">
              <h2 className="text-3xl font-semibold space-y-4 mb-5">Quiénes somos?</h2>
              <p className="text-lg my-2">Simple: un grupo pequeño de emprendedores con el objetivo de llevar lo mejor de la industria a una comunidad cada dia más grande.</p>
              <p className="text-lg my-2">Nuestro objetivo? Seguir creciendo, mejorando y expandiendo nuestros horizontes para proveerte con lo mejor de lo mejor a cada vez más clientes... sin olvidarnos de vos.</p>
              <p className="text-lg my-2">Nuestro compromiso sobrepasa el de simplemente {`"vender"`} productos. Queremos construir una comunidad de apasionados para compartir nuestro amor por la tecnologia de punta.</p>
            </article>
            <article className="flex flex-col items-center p-10 w-1/2 max-[650px]:w-full bg-gradient-to-br from-purple-300/20 to-purple-600/20 dark:from-purple-900/20 dark:to-black/20 rounded-2xl border-2 border-purple-900/20 shadow-lg">
              <div className="rounded-full bg-gradient-to-br from-red-600 to-yellow-500 p-5 w-20 h-20 justify-center items-center flex mb-5 text-white dark:text-black">
                <FontAwesomeIcon icon={faBox} fontFamily="regular" size="3x"/>
              </div>
              <h2 className="text-xl font-bold space-y-4 mb-2">{`Tech's Cave`}</h2>
              <h3 className="text-lg">Desde 2023</h3>
              <div className="w-full flex flex-wrap justify-around items-center mt-5">
                <legend  className="flex flex-col items-center p-2">
                  <h3 className="font-bold text-2xl text-violet-600">+50k</h3>
                  <p className="text-sm">componentes vendidos</p>
                </legend>
                <legend className="flex flex-col items-center p-2">
                  <h3 className="font-bold text-2xl text-violet-600">24/7</h3>
                  <p className="text-sm">soporte completo</p>
                </legend>
              </div>
            </article>
        </section>
      </section>
    </main>
  );
}