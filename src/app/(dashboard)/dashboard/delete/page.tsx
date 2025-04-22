'use client'
import React from 'react'
import { useProducts } from '@/product/provider'
import { Product } from '@/product/products'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image } from '@heroui/react'

const DeletePage = () => {

  const products:Product[] = useProducts();

  const [selectedProduct, setSelectedProduct] = React.useState< Product | null>(null)

  return (
    <main className='flex flex-col items-center justify-center p-20'>
      <h1 className='font-bold text-3xl'>Borrar producto existente</h1>
      <section className='flex flex-row items-center gap-4 w-2/3 my-10'>
        <article className='bg-black rounded-xl p-6 w-1/2'>
        <h2 className='font-semibold text-xl my-4'>Seleccione el producto que desea borrar</h2>
        <Dropdown>
          <DropdownTrigger>
            <Button className='text-lg'>{selectedProduct ? selectedProduct.name : 'Seleccione un producto'}</Button>
          </DropdownTrigger>
          <DropdownMenu className='text-black'>
            {products.map((product)=>(
              <DropdownItem key={product.id} onPress={() => setSelectedProduct(product)} className='text-lg'>
                {product.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        </article>
        <article className='bg-black rounded-xl p-6 w-1/2 items-center'>
          <h3 className='font-semibold text-xl my-4'>Producto seleccionado</h3>
          {selectedProduct ? 
          <>
            <h3>{selectedProduct?.name}</h3>
            <Image src={selectedProduct!.image} alt={selectedProduct!.name} width={300} height={300}/>
            <p className='text-lg'>Tipo de producto: {selectedProduct?.type}</p>
            <p className='text-lg'>Marca: {selectedProduct?.brand}</p>
            <p className='text-lg'>Precio: ${selectedProduct?.price}</p>
            <p className='text-lg'>Stock: {selectedProduct?.stock}</p>
          </>
          :
          <p className='text-lg'>No hay producto seleccionado</p>}
        </article>
      </section>
      {selectedProduct && (
      <article className='w-1/2 flex flex-col items-center justify-center bg-black rounded-xl p-2'>
          <h2 className='text-xl mb-4'>Desea eliminar el producto seleccionado?</h2>
          <Button disabled className='text-lg'>Eliminar producto</Button>
      </article>
    )}
    </main>
  )
}

export default DeletePage
