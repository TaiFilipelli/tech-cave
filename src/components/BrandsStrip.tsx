import Image from 'next/image'
import React from 'react'

export default function BrandsStrip(){

    const brands = [
      { src: "/brands/asus.png", alt: "ASUS"   },
      { src: "/brands/amd.png", alt: "AMD" },
      { src: "/brands/intel.png", alt: "Intel" },
      { src: "/brands/nvidia.png", alt: "NVIDIA" },
      { src: "/brands/corsair.png", alt: "Corsair" },
      { src: "/brands/logitech.png", alt: "Logitech" },
    ]

  return (
    <section className="flex flex-col justify-between items-center text-center pt-5 dark:bg-gray-600 dark:text-black">
        <h3 className="text-4xl font-bold mb-5">Las mejores <span className="bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">marcas</span></h3>
        <div className="relative overflow-hidden w-full max-w-[80rem] h-[190px] bg-transparent mask-gradient">
            <ul className="flex animate-marquee whitespace-nowrap gap-8 px-8">
            {brands.concat(brands).map((brand, i) => (
                <li key={i} className="flex flex-col items-center justify-center min-w-[165px]">
                    <div className="rounded-full bg-transparent p-6 transition-colors">
                        <Image src={brand.src} alt={brand.alt} className="object-contain" width={100} height={100} />
                    </div>
                </li>
            ))}
            </ul>
        </div>
    </section>
  )
};