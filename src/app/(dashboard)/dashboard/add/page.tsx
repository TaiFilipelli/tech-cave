'use client'
import React from 'react'
import { useProducts } from '@/product/provider'
import { addToast, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { productSchema } from '@/lib/schemas/productCreationSchema'

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

  const [isConfirming, setIsConfirming] = React.useState<boolean>(false);

  const types:string[] = [
    'Procesador', 'Placa de Video', 'Placa Madre', 'Memoria RAM', 'Almacenamiento SSD', 
    'Almacenamiento HDD', 'Fuente de Alimentación', 'Otros'
  ];

  const brands:string[] = [
    'AMD', 'Intel', 'NVIDIA', 'Asrock', 'ASUS', 'Patriot', 'Corsair', 'ADATA', 'T-CREATE', 'WD', 'Corsair', 'Cougar', 'HYTE'
  ]

  const handleChanges = async () => {
    try {

      const parsed = productSchema.safeParse({
        name,
        type,
        price,
        description,
        brand,
        img,
        stock
      });

      if (!parsed.success) {
        const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] || "Hay errores en el formulario";
        addToast({
          title: "Error al agregar producto",
          description: firstError,
          color: "warning",
        });
        return;
      }
      
      const lastProduct = products[products.length - 1];
      const nextId = Number(lastProduct.id) + 1;
  
      const response = await fetch('/api/addProduct', {
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
    <section className='flex flex-col items-center justify-center h-[100vh] px-20 py-16 max-[640px]:p-10'>
      <h1 className='font-bold text-3xl'>Agregar producto</h1>
      <h2 className='font-semibold text-xl my-5'>Complete TODOS los campos a continuación</h2>
      <section className='flex flex-col items-center justify-center w-[60dvw] max-[600px]:w-[90dvw] bg-black rounded-2xl p-5 gap-4 my-4'>
      <Input type="text" label='Nombre del producto' labelPlacement='outside' placeholder='Ej: Placa de Video NVIDIA 5090' value={name} isRequired onChange={(e) => setName(e.target.value)} className='w-1/2 max-[640px]:w-2/3'/>
      <Input type="number" label='Precio' labelPlacement='outside' isRequired value={price.toString()} onChange={(e) => setPrice(Number(e.target.value))} className='w-1/2 max-[640px]:w-2/3'/>
      <Input type="text" label='Descripción' labelPlacement='outside' placeholder='Ej: Este es un producto único...' isRequired value={description} onChange={(e) => setDescription(e.target.value)} className='w-1/2 max-[640px]:w-2/3'/>
      <Input type="number" label='Stock disponible' labelPlacement='outside' isRequired value={stock.toString()} onChange={(e) => setStock(Number(e.target.value))} className='w-1/2 max-[640px]:w-2/3'/>
      <Input type="text" label='URL imagen' labelPlacement='outside' placeholder='Ej: https://imagen_stock.com' isRequired value={img} onChange={(e) => setImg(e.target.value)} className='w-1/2 max-[640px]:w-2/3'/>
      <div className='w-full flex flex-col gap-4 items-center justify-start'>
      <article>
        <label htmlFor="type" className='font-semibold text-md px-4'>Tipo de producto</label>
        <input type="text" id="type" list='types' value={type} onChange={(e) => setType(e.target.value)} className='text-black rounded-lg p-2 ' />
        <datalist id='types'>
          {types.map((type, index) => (
            <option key={index} value={type} />
          ))}
        </datalist>
      </article>
      <article>
        <label htmlFor="brand" className='font-semibold text-md px-4'>Marca</label>
        <input type="text" id="brand" list='brands' value={brand} onChange={(e) => setBrand(e.target.value)} className='text-black rounded-lg p-2 ' />
        <datalist id='brands'>
          {brands.map((brand, index) => (
            <option key={index} value={brand} />
          ))}
        </datalist>
      </article>
      </div>
      </section>
      <Button onPress={() => setIsConfirming(true)} className='bg-gradient-to-br from-blue-600 to-violet-600 text-white font-semibold text-xl p-6 border-2 border-black '>Agregar producto</Button>
      <Link href={`/dashboard`} className='text-white text-lg my-4 hover:underline'>Volver atrás</Link>
      <Modal isOpen={isConfirming} onClose={() => setIsConfirming(false)} isDismissable={false} className='bg-gray-700 py-2 px-4' backdrop='blur'>
        <ModalContent>
          <ModalHeader className="text-xl font-semibold">¿Confirmar cambios?</ModalHeader>
          <ModalBody>
            <p>¿Estás seguro que querés guardar este producto?</p>
            <ul className='list-disc text-lg gap-2'>
              <li>{name}</li>
              <li>Tipo: {type}</li>
              <li>${price.toString()}</li>
              <li>{description}</li>
              <li>Marca {brand}</li>
              <li>{stock.toString()} unidades</li>
            </ul>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" color='danger' className='text-white' onPress={() => setIsConfirming(false)}>Cancelar</Button>
            <Button variant='shadow' color='secondary' className='text-white font-semibold' onPress={() => { handleChanges(); setIsConfirming(false); }}>Confirmar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </section>
  )
}

export default AddPage
