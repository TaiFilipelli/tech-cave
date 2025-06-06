'use client'
import React from 'react'
import { useProducts } from '@/product/provider'
import { Product } from '@/product/products'
import { addToast, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image } from '@heroui/react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'

const DeletePage = () => {

  const products:Product[] = useProducts();
  const { data: session } = useSession();

  const [selectedProduct, setSelectedProduct] = React.useState< Product | null>(null)

  const handleDelete = async () => {
    if (!selectedProduct || !session?.accessToken) { 
      addToast({ title: "Error al eliminar producto", description: 'No hay producto seleccionado o no hay sesión válida', color: "warning"});
      return;
    }
  
    try {
      const response = await fetch('/api/deleteProduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: session.accessToken,
          productId: selectedProduct.id
        })
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        addToast({ title:'Error al eliminar producto', description:result.error, color: "danger"});
      }
  
      addToast({ title: "Producto eliminado", description: 'El producto ha sido eliminado correctamente', color: "success" });
      setSelectedProduct(null);

    } catch (error) {
      addToast({ title: "Error al eliminar producto", description: error instanceof Error ? error.message : 'Error al eliminar producto',color: "warning" });
    }
  };
  
  return (
    <main className='flex flex-col items-center justify-center px-20'>
      <h1 className='font-bold text-3xl mt-10'>Borrar producto existente</h1>
      <section className='flex flex-row items-center gap-4 w-2/3 my-10'>
        <article className='bg-black rounded-xl p-6 w-1/2'>
        <h2 className='font-semibold text-xl my-4'>Seleccione el producto que desea borrar</h2>
        <Dropdown type='listbox' shouldBlockScroll={false} className='overflow-y-scroll'>
          <DropdownTrigger>
            <Button className='text-lg'>{selectedProduct ?  selectedProduct.name.slice(0, 20) + "..." : 'Seleccione un producto'}</Button>
          </DropdownTrigger>
          <DropdownMenu className='text-black'>
            {products.map((product)=>(
              <DropdownItem key={product.id} onPress={() => setSelectedProduct(product)} className='text-lg' showDivider>
                {product.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        </article>
        <article className='bg-black rounded-xl p-6 w-1/2 items-center h-full'>
          <h3 className='font-semibold text-2xl my-4'>Producto seleccionado</h3>
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
          <Button disabled={!selectedProduct} className='text-lg bg-gradient-to-br from-red-400 to-red-600 text-white' startContent={<FontAwesomeIcon icon={faTrashCan}/>} onPress={handleDelete}>Eliminar producto</Button> 
      </article>
    )}
    <Link href={'/dashboard'} className='hover:underline text-xl my-5'>Volver atrás</Link> 
    </main>
  )
}

export default DeletePage
