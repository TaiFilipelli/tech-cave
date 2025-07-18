'use client'
import React from 'react'
import { Button, Slider } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useRouter, useSearchParams } from 'next/navigation';


const FiltersComponent = () => {

  const types:string[] = [
    'Procesador', 'Placa de Video', 'Placa madre', 'Memoria RAM', 'Almacenamiento SSD', 
    'Almacenamiento HDD', 'Fuente de Alimentacion', 'Otros'
  ];

  const brands:string[] = [
    'AMD', 'Intel', 'NVIDIA', 'Asrock', 'ASUS', 'Patriot', 'Corsair', 'ADATA', 'T-CREATE', 'WD', 'Corsair', 'Cougar', 'HYTE'
  ]

  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedType, setSelectedType] = React.useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = React.useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = React.useState<number[]>([0, 3000000]);

  const handleClearFilters = () => {
    setSelectedType(null);
    setSelectedBrand(null);
    setSelectedPrice([0, 3000000]);
    router.push('/products');
  }
  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedType) params.set('type', selectedType);
    if (selectedBrand) params.set('brand', selectedBrand);
    if (selectedPrice){
      params.set('minPrice', selectedPrice[0].toString());
      params.set('maxPrice', selectedPrice[1].toString());
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <aside className="flex flex-col w-auto h-[50%] gap-5 bg-gray-400 dark:bg-[#1F2937] p-5 my-2 rounded-xl shadow-lg">
      <article>
        <label htmlFor="type-input" className="font-semibold block text-lg mb-2">Categorias</label>
        <input list="types" id="type-input" placeholder="Buscar categoria..." value={selectedType ?? ''} onChange={e => setSelectedType(e.target.value)} className="w-full border px-2 py-1 rounded"/>
        <datalist id="types">
          {types.map((type, i) => <option key={i} value={type} />)}
        </datalist>
      </article>
      <article>  
        <label htmlFor="brand-input" className="font-semibold block text-lg mb-2">Marcas</label>
        <input list="brands" id="brand-input" placeholder="Buscar marca..." value={selectedBrand ?? ''} onChange={e => setSelectedBrand(e.target.value)} className="w-full border px-2 py-1 rounded"/>
        <datalist id="brands">
          {brands.map((brand, i) => <option key={i} value={brand} />)}
        </datalist>
      </article>
      <article>
        <label className="font-semibold block text-lg mb-2">Precio</label>
        <Slider minValue={0} maxValue={3000000} value={selectedPrice} onChange={(value) => {if (Array.isArray(value)) {setSelectedPrice(value);}}} step={100} defaultValue={[0, 3000000]}/>
        <p className="text-sm mt-1">ARS ${selectedPrice[0]} - ${selectedPrice[1]}</p>
      </article>
      <article className='flex flex-row max-[440px]:flex-col gap-2'>
        <Button onPress={handleApplyFilters} className='text-lg font-semibold bg-violet-600 text-white px-6'>Filtrar</Button>
        <Button onPress={handleClearFilters} className='bg-red-600 text-white font-semibold' startContent={<FontAwesomeIcon icon={faTrash}/>}>Limpiar</Button>
      </article>
    </aside>
  )
}

export default FiltersComponent
