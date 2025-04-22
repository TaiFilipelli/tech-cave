'use client'
import React from 'react'
import { useProducts } from '@/product/provider'
import { addToast, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from '@heroui/react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const AddPage = () => {

  const products = useProducts();
  const { data: session } = useSession();
  const [name, setName] = React.useState<string>("");
  const [type, setType] = React.useState<string>("");
  const [price, setPrice] = React.useState<number>(0);
  const [description, setDescription] = React.useState<string>("");
  const [brand, setBrand] = React.useState<string>('');
  const [img, setImg] = React.useState<string>('');
  const [stock, setStock] = React.useState<number>(0);

  const types:string[] = [
    'Procesador', 'Placa de Video', 'Placa Madre', 'Memoria RAM', 'Almacenamiento SSD', 
    'Almacenamiento HDD', 'Fuente de Alimentación', 'Otros'
  ];

  const brands:string[] = [
    'AMD', 'Intel', 'NVIDIA', 'Asrock', 'ASUS', 'Patriot', 'Corsair', 'ADATA', 'T-CREATE', 'WD', 'Corsair', 'Cougar', 'HYTE'
  ]

  const handleChanges = async () => {
    try {
      if (!name || !type || !price || !description || !brand || !stock) {
        addToast({title: "Error al agregar producto", description:'Todos los campos son obligatorios', color: "warning"});
        return;
      }
      const lastProduct = products[products.length - 1];
      const nextId = Number(lastProduct.id) + 1;
      console.log("TOKEN DE SESIÓN:", session?.accessToken);
  
      const response = await fetch('/api/addUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.accessToken}`},
        body: JSON.stringify({
          accessToken: session?.accessToken,
          range: 'Productos!A:H',
          values: [[
            nextId.toString(),
            name,
            type,
            price.toString(),
            description,
            brand,
            stock.toString(),
            img
          ]]
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Error al crear nuevo producto");
      }
  
      addToast({title: "Producto creado con éxito!", color: "success"});
      setName("");
      setType("");
      setPrice(0);
      setDescription("");
      setBrand('');
      setImg('');
      setStock(0);

    } catch (err) {
      console.error("Error creando el nuevo producto:", err);
      addToast({title: "Error al crear producto", description:'Inténtelo más tarde', color: "danger"});
    }
  }

  return (
    <section className='flex flex-col items-center justify-center p-20'>
      <h1 className='font-bold text-3xl'>Agregar producto</h1>
      <h2 className='font-semibold text-xl my-5'>Complete TODOS los campos a continuación</h2>
      <section className='flex flex-col items-center justify-center w-full bg-black rounded-2xl p-5 gap-4 my-4'>
      <Input type="text" label='Nombre del producto' labelPlacement='outside' placeholder='Ej: Placa de Video NVIDIA 5090' value={name} isRequired onChange={(e) => setName(e.target.value)} className='w-1/2'/>
      <Input type="number" label='Precio' labelPlacement='outside' isRequired value={price.toString()} onChange={(e) => setPrice(Number(e.target.value))} className='w-1/2' />
      <Input type="text" label='Descripción' labelPlacement='outside' placeholder='Ej: Este es un producto único...' isRequired value={description} onChange={(e) => setDescription(e.target.value)} className='w-1/2'/>
      <Input type="number" label='Stock disponible' labelPlacement='outside' isRequired value={stock.toString()} onChange={(e) => setStock(Number(e.target.value))} className='w-1/2'/>
      <Input type="text" label='URL imagen' labelPlacement='outside' placeholder='Ej: https://imagen_stock.com' isRequired value={img} onChange={(e) => setImg(e.target.value)} className='w-1/2'/> 
      <Dropdown>
        <DropdownTrigger className='w-1/2 mt-2'>
          <Button className='font-semibold text-md'>{type ? type : 'Tipo'}</Button>
        </DropdownTrigger>
        <DropdownMenu selectionMode='single' disallowEmptySelection variant='flat'>
          {types.map((type, index) => (
            <DropdownItem key={index} onPress={()=> setType(type)} className='text-2xl text-black'>
              {type}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      <Dropdown>
        <DropdownTrigger className='w-1/2'>
          <Button className='font-semibold text-md'>{brand ? brand : 'Marca'}</Button>
        </DropdownTrigger>
        <DropdownMenu selectionMode='single' disallowEmptySelection variant='flat'>
          {brands.map((brand, index) => (
            <DropdownItem key={index} onPress={()=> setBrand(brand)} className='text-2xl text-black'>
              {brand}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      </section>
      <Button onPress={handleChanges} className='bg-gradient-to-br from-blue-600 to-violet-600 text-white font-semibold text-xl p-6 border-2 border-black '>Agregar producto</Button>
      <Link href={`/dashboard`} className='text-white text-lg my-4 hover:underline'>Volver atrás</Link>
    </section>
  )
}

export default AddPage
