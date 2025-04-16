'use client'
import React from 'react'
import { useProducts } from '@/product/provider'
import { Button, Dropdown, DropdownTrigger, DropdownItem, DropdownMenu, Input } from '@heroui/react';
import { Product } from '@/product/products';

const EditPage = () => {

  const products = useProducts();

  const [selectedProduct, setSelectedProduct] = React.useState<Product>();
  const [newPrice, setNewPrice] = React.useState<number>(0);
  const [newStock, setNewStock] = React.useState<number>(0);

  const handleChanges = () => {
    const productIndex = products.findIndex(p => p.id === selectedProduct?.id);
    if (productIndex === -1) throw new Error("Producto no encontrado en la lista");
  }

  // const handleChanges = async () => {
  //   if (!selectedProduct) return;
  
  //   try {
  //     const productIndex = products.findIndex(p => p.id === selectedProduct.id);
  
  //     if (productIndex === -1) {
  //       throw new Error("Producto no encontrado en la lista");
  //     }
  
  //     // +2 porque la hoja empieza en la fila 1 (headers) y después datos desde la fila 2
  //     const rowToEdit = productIndex + 2;
  
  //     const range = `Hoja1!D${rowToEdit}:G${rowToEdit}`;
  //     const sheetId = "2PACX-1vRL66YJq850C5luiGRId3xN55F17Dzci1GNRAB6ZQe5aLT_H_jJPSQDDjTnNeviBHSmaQ3YTUFRxPZm"; // reemplazá por el ID real
  //     const accessToken = ''; // averiguar cómo obtener el token de acceso de un usuario admin para la hoja de cálculo
  
  //     const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?valueInputOption=USER_ENTERED`;
  
  //     const body = {
  //       range,
  //       majorDimension: "ROWS",
  //       values: [[newPrice, newStock]]
  //     };
  
  //     const res = await fetch(updateUrl, {
  //       method: "PUT",
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(body),
  //     });
  
  //     if (!res.ok) {
  //       const errorData = await res.json();
  //       throw new Error(errorData.error?.message || "Error al actualizar producto");
  //     }
  
  //     alert("Producto actualizado con éxito");
  //   } catch (err) {
  //     console.error("Error actualizando el producto:", err);
  //     alert("Error al actualizar el producto. Ver consola.");
  //   }
  // }


  return (
    <section className='flex flex-col items-center justify-center p-20'>
      <h1 className='font-bold text-3xl mb-2'>Editar producto existente</h1>
      <p className='font-medium text-lg mb-5'>Edite precio y stock de cualquier producto</p>
      <Dropdown>
        <DropdownTrigger>
          <Button className='bg-gray-400 text-black p-2 rounded-md'>{selectedProduct ? selectedProduct.name : 'Seleccionar producto'}</Button>
        </DropdownTrigger>
        <DropdownMenu>
          {products.map((product) => (
            <DropdownItem key={product.id} className='p-2 text-2xl text-black' onPress={() => setSelectedProduct(product)}>
              {product.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      <section className='flex flex-col items-center justify-center p-5 gap-2'>
          <Input label='Cambiar precio' labelPlacement='outside' onChange={(e) => setNewPrice(parseInt(e.target.value))}/>
          <Input label='Cambiar stock' labelPlacement='outside' onChange={(e) => setNewStock(parseInt(e.target.value))}/>
      </section>
      <p>Lista de cambios:</p>
      <ul className='mb-2 list-disc'>
        <li>Precio: {newPrice}</li>
        <li>Stock: {newStock}</li>
      </ul>
      <Button disabled className='bg-blue-600 text-white' onPress={handleChanges}>Guardar cambios</Button>
    </section>
  )
}
export default EditPage
