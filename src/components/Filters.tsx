'use client'
import React from 'react'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Slider } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useRouter, useSearchParams } from 'next/navigation';


const FiltersComponent = () => {

  const types:string[] = [
    'Procesador', 'Placa de Video', 'Placa Madre', 'Memoria RAM', 'Almacenamiento SSD', 
    'Almacenamiento HDD', 'Fuente de Alimentación', 'Otros'
  ];

  const brands:string[] = [
    'AMD', 'Intel', 'NVIDIA', 'Asrock', 'ASUS', 'Patriot', 'Corsair', 'ADATA', 'T-CREATE', 'WD', 'Corsair', 'Cougar', 'HYTE'
  ]

  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedType, setSelectedType] = React.useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = React.useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = React.useState<number>(0);

  const handleClearFilters = () => {
    router.push('/products');
  }
  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedType) params.set('type', selectedType);
    if (selectedBrand) params.set('brand', selectedBrand);
    if (selectedPrice) params.set('price', selectedPrice.toString());

    router.push(`?${params.toString()}`);
  };

  return (
    <nav className="flex flex-row w-[50%] bg-gray-400 p-5 my-2 rounded-xl shadow-lg mb-10 justify-around">
      <Dropdown>
        <DropdownTrigger>
          <Button className='font-semibold text-md'>{selectedType ? selectedType : 'Categorias'}</Button>
        </DropdownTrigger>
        <DropdownMenu selectionMode='single' disallowEmptySelection variant='flat'>
          {types.map((type, index) => (
            <DropdownItem key={index} onPress={() => setSelectedType(type)}>
              {type}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      <Dropdown>
        <DropdownTrigger>
          <Button className='font-semibold text-md'>Precio</Button>
        </DropdownTrigger>
        <DropdownMenu variant='flat'>
          <DropdownItem isReadOnly key={0}>
            <Slider minValue={0} maxValue={5000000} defaultValue={[0,5000000]} label='ARS' step={100} onChange={(value) => setSelectedPrice(value)}/>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Dropdown>
        <DropdownTrigger>
          <Button className='font-semibold text-md'>{selectedBrand ? selectedBrand : 'Marcas'}</Button>
        </DropdownTrigger>
        <DropdownMenu selectionMode='single' disallowEmptySelection variant='flat'>
          {brands.map((brand, index) => (
            <DropdownItem key={index} onPress={()=> setSelectedBrand(brand)}>
              {brand}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      <article className='flex flex-row gap-2'>
        <Button onPress={handleApplyFilters} className='text-lg font-semibold bg-blue-600 text-white px-6'>Filtrar</Button>
        <Button onPress={handleClearFilters} className='bg-red-600 text-white font-semibold' startContent={<FontAwesomeIcon icon={faTrash}/>}>Limpiar</Button>
      </article>
    </nav>
  )
}

export default FiltersComponent
