'use client'
import React from 'react'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Slider } from '@heroui/react';
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
  const [selectedPrice, setSelectedPrice] = React.useState<number[]>([0, 5000000]);

  const handleClearFilters = () => {
    setSelectedType(null);
    setSelectedBrand(null);
    setSelectedPrice([0, 5000000]);
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
    <nav className="flex flex-row max-[1250px]:flex-col max-[1250px]:gap-5 w-[50%] max-[550px]:w-[70%] max-[350px]:w-full bg-gray-400 p-5 my-2 rounded-xl shadow-lg mb-10 justify-around">
      <Dropdown>
        <DropdownTrigger>
          <Button className='font-semibold text-md dark:bg-white dark:text-black'>{selectedType ? selectedType : 'Categorias'}</Button>
        </DropdownTrigger>
        <DropdownMenu selectionMode='single' disallowEmptySelection variant='flat'>
          {types.map((type, index) => (
            <DropdownItem key={index} onPress={() => setSelectedType(type)} showDivider>
              {type}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      <Dropdown>
        <DropdownTrigger>
          <Button className='font-semibold text-md dark:bg-white dark:text-black'>{selectedPrice[0] ? `$${selectedPrice[0]}-$${selectedPrice[1]}` : 'Precio'}</Button>
        </DropdownTrigger>
        <DropdownMenu variant='flat'>
          <DropdownItem isReadOnly key={0}>
            <Slider minValue={0} maxValue={5000000} defaultValue={[0,5000000]} value={selectedPrice} label='ARS' step={100} onChange={(value) => {if (Array.isArray(value)) {setSelectedPrice(value);}}}/>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Dropdown>
        <DropdownTrigger>
          <Button className='font-semibold text-md dark:bg-white dark:text-black'>{selectedBrand ? selectedBrand : 'Marcas'}</Button>
        </DropdownTrigger>
        <DropdownMenu selectionMode='single' disallowEmptySelection variant='flat'>
          {brands.map((brand, index) => (
            <DropdownItem key={index} onPress={()=> setSelectedBrand(brand)} showDivider>
              {brand}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      <article className='flex flex-row max-[440px]:flex-col gap-2'>
        <Button onPress={handleApplyFilters} className='text-lg font-semibold bg-violet-600 text-white px-6'>Filtrar</Button>
        <Button onPress={handleClearFilters} className='bg-red-600 text-white font-semibold' startContent={<FontAwesomeIcon icon={faTrash}/>}>Limpiar</Button>
      </article>
    </nav>
  )
}

export default FiltersComponent
