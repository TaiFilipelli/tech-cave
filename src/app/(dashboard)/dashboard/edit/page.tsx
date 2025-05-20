'use client'
import React from 'react'
import { useProducts } from '@/product/provider'
import { Button, Dropdown, DropdownTrigger, DropdownItem, DropdownMenu, Input, addToast } from '@heroui/react';
import { Product } from '@/product/products';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const EditPage = () => {

  const { data: session } = useSession();

  const products = useProducts();

  const [selectedProduct, setSelectedProduct] = React.useState<Product>();
  const [newPrice, setNewPrice] = React.useState<number>(0);
  const [newStock, setNewStock] = React.useState<number>(0);
  
  const handleChanges = async () => {
    if (!selectedProduct) return;
  
    try {
      const productIndex = products.findIndex(p => p.id === selectedProduct.id);
  
      if (productIndex === -1) {
        throw new Error("Producto no encontrado en la lista");
      }
  
      // +2 porque la hoja empieza en la fila 1 (headers) y después datos desde la fila 2
      const rowToEdit = productIndex + 2;
  
      const range = `Productos!D${rowToEdit}:G${rowToEdit}`;
      const sheetId = "1O_9reXr8yzEZDllwOo_YKOtJ3HZqKJd7dkF_cWrqa1g";
      const accessToken = session?.accessToken;
  
      const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?valueInputOption=USER_ENTERED`;
  
      const body = {
        range,
        majorDimension: "ROWS",
        values: [[newPrice, newStock]]
      };
  
      const res = await fetch(updateUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || "Error al actualizar producto");
      }
  
      addToast({title: "Producto actualizado con éxito", color: "success"});
      setNewPrice(0);
      setNewStock(0);
    } catch (err) {
      console.error("Error actualizando el producto:", err);
      addToast({title: "Error al actualizar producto", description:'Inténtelo más tarde', color: "danger"});
    }
  }

  return (
    <section className='flex flex-col items-center justify-center p-20'>
      <h1 className='font-bold text-3xl mb-2'>Editar producto existente</h1>
      <p className='font-medium text-lg mb-5'>Edite precio y stock de cualquier producto</p>
      <Dropdown>
        <DropdownTrigger>
          <Button className='bg-gray-400 text-black p-2 rounded-md'>{selectedProduct ? selectedProduct.name.slice(0, 20) + "..." : 'Seleccionar producto'}</Button>
        </DropdownTrigger>
        <DropdownMenu>
          {products.map((product) => (
            <DropdownItem key={product.id} className='p-2 text-2xl text-black' onPress={() => setSelectedProduct(product)}>
              {product.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      <article className='flex flex-wrap gap-4'>
        <section className='flex flex-col items-center justify-center p-5 bg-black rounded-xl my-5'>
            <Input label='Cambiar precio' labelPlacement='outside' onChange={(e) => setNewPrice(Number(e.target.value))}/>
            <Input label='Cambiar stock' labelPlacement='outside' onChange={(e) => setNewStock(Number(e.target.value))}/>
        </section>
        <div className='flex flex-col items-center my-5'>
          <p className='text-lg '>Lista de cambios:</p>
          <ul className='mb-2 list-disc'>
            <li className={`${newPrice==0 ? 'opacity-0' : 'opacity-100'}`}>Precio: {newPrice}</li>
            <li className={`${newStock==0 ? 'opacity-0' : 'opacity-100'}`}>Stock: {newStock}</li>
          </ul>
        </div>
      </article>
      <Button disabled={ !selectedProduct || !newPrice || !newStock } className='bg-blue-600 text-white' onPress={handleChanges}>Guardar cambios</Button>
      <Link href={`/dashboard`} className='text-white text-lg my-4 hover:underline'>Volver atrás</Link>
    </section>
  )
}
export default EditPage
