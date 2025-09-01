'use client'
import React, { useEffect } from 'react'
import { Button, Slider, Autocomplete, AutocompleteItem } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useRouter, useSearchParams } from 'next/navigation';
import brandsApi from '@/brands/api';
import typesApi from '@/productTypes/api';
import { Brand } from '@/brands/brand';
import { Type } from '@/productTypes/type';


const FiltersComponent = () => {

  useEffect(() => {
    async function fetchData() {
      const brands:Brand[] = await brandsApi.list();
      const types:Type[] = await typesApi.list();
      setBrands(brands);
      setTypes(types);

      console.log("Tipos:", types);
      console.log("Marcas:",brands);
    }
    fetchData();
  },[]);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [brands, setBrands] = React.useState<Brand[]>([]);
  const [types, setTypes] = React.useState<Type[]>([]);
  const [selectedType, setSelectedType] = React.useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = React.useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = React.useState<number[]>([0, 3000000]);

  const handleClearFilters = () => {
    setSelectedType(null);
    setSelectedBrand(null);
    setSelectedPrice([0, 3000000]);
    router.push('/products');
  }
  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedType){
      const typeObj = types.find(type => Number(type.id) === selectedType);
      if (typeObj) params.set('type', typeObj.tipo);
    }
    if (selectedBrand) {
      const brandObj = brands.find(brand => Number(brand.id) === selectedBrand);
      if (brandObj) params.set('brand', brandObj.marca);
    }
    if (selectedPrice){
      params.set('minPrice', selectedPrice[0].toString());
      params.set('maxPrice', selectedPrice[1].toString());
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <aside className="flex flex-col w-auto h-[50%] gap-5 bg-white dark:bg-[#1F2937] p-5 my-2 rounded-xl shadow-lg">
      <Autocomplete className='w-full' label="Categorias" labelPlacement='outside' placeholder='Buscar categoria...' variant='bordered' selectedKey={selectedType ? String(selectedType) : undefined} onSelectionChange={(key) => setSelectedType(key ? Number(key) : null)}>
        {types.map((type) => (
          <AutocompleteItem key={type.id}>{type.tipo}</AutocompleteItem>
        ))}
      </Autocomplete>
      <Autocomplete className='w-full' label="Marcas" labelPlacement='outside' placeholder='Buscar por marca...' variant='bordered' selectedKey={selectedBrand ? String(selectedBrand) : undefined} onSelectionChange={(key) => setSelectedBrand(key ? Number(key) : null)}>
        {brands.map((brand) => (
          <AutocompleteItem key={brand.id}>{brand.marca}</AutocompleteItem>
        ))}
      </Autocomplete>
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
