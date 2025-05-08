'use client';
import { useProductStore } from "@/store/productsStore";
import { Button, Image } from "@heroui/react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

export default function ProductDetails() {
    const product = useProductStore((state) => state.selectedProduct);

    if (!product) {
        return(
            <div className="items-center justify-center text-center flex flex-col p-20 mb-20">
                <h1 className="font-bold text-4xl mb-10">Cargando el producto, pa</h1> 
                <FontAwesomeIcon icon={faCircleNotch} spin size="2xl" />
            </div>
        );
    }

    return (
        <main className="p-20 max-[550px]:p-5 mt-16">
        <Button as={Link} href="/" className="bg-red-600 text-white font-bold text-3xl items-center text-center">←</Button>
        <section className="bg-white text-black mt-10 mb-16 items-center rounded-2xl border-1 border-black">
            <article className="flex flex-wrap max-[1000px]:flex-col max-[800px]:items-center p-10 max-[400px]:px-2">
                <div className="w-1/3 max-[800px]:w-2/3 max-[500px]:w-full flex items-center justify-center ">
                    <Image src={product?.image} alt={product?.name} className="object-cover max-h-72"/>
                </div>
                <div className="w-2/3">
                    <h1 className="text-4xl max-[500px]:text-3xl font-bold mb-5">{product?.name}</h1>
                    <p className="text-2xl font-semibold">Categoria: {product?.type}</p>
                    <h3 className="text-2xl font-semibold mt-5 text-green-600">{product?.price}</h3>
                    <Button disabled className="w-1/2 max-[1000px]:w-2/3 max-[650px]:w-full text-xl font-semibold rounded-2xl my-5">Agregar al carrito</Button>
                    <h4 className={`text-lg font-semibold text-white underline ${product?.stock > 15 ? "text-green-700" : product?.stock > 10 ? "text-orange-500" : "text-red-600"}`}>Stock {product?.stock > 15 ? "alto" : product?.stock > 10 ? "medio" : "bajo"}</h4>
                    <p className="text-xl font-bold mt-5">Sobre este producto:</p><p>{product?.description}</p>
                </div>
            </article>
        </section>
        </main>
    );
}