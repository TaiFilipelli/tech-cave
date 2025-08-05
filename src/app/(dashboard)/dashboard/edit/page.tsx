'use client'
import React from 'react'
import { useProducts } from '@/product/provider'
import { Button, Input, addToast, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Autocomplete, AutocompleteItem } from '@heroui/react';
import { Product } from '@/product/products';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const EditPage = () => {

  const { data: session } = useSession();
  const products = useProducts();

  const [selectedType, setSelectedType] = React.useState<string>('');
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = React.useState<Product>();
  const [formState, setFormState] = React.useState({
    name: '',
    price: 0,
    description: '',
    brand: '',
    stock: 0,
  });
  const [isConfirming, setIsConfirming] = React.useState(false);

  const uniqueTypes = [...new Set(products.map((p) => p.type))];

  React.useEffect(() => {
    if (selectedType) {
      setFilteredProducts(products.filter((p) => p.type === selectedType));
    }
  }, [selectedType, products]);

  React.useEffect(() => {
    if (selectedProduct) {
      setFormState({
        name: selectedProduct.name,
        price: selectedProduct.price,
        description: selectedProduct.description,
        brand: selectedProduct.brand,
        stock: selectedProduct.stock,
      });
    }
  }, [selectedProduct]);
  const handleChanges = async () => {
    if (!selectedProduct) return;
  
    try {
      const productIndex = products.findIndex(p => p.id === selectedProduct.id);
  
      if (productIndex === -1) {
        throw new Error("Producto no encontrado en la lista");
      }
  
      // +2 porque la hoja empieza en la fila 1 (donde están las cabeceras de las columnas) y después datos desde la fila 2
      const rowToEdit = productIndex + 2;
  
      const range = `Productos!B${rowToEdit}:G${rowToEdit}`;
      const sheetId = "1O_9reXr8yzEZDllwOo_YKOtJ3HZqKJd7dkF_cWrqa1g";
      const accessToken = session?.accessToken;
  
      const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?valueInputOption=USER_ENTERED`;
  
      const body = {
        range,
        majorDimension: "ROWS",
        values: [[formState.name, selectedProduct.type, formState.price, formState.description, formState.brand, formState.stock]],
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
  
      addToast({title: "Producto actualizado con éxito", color: "success", timeout: 4000});
      setFormState({ name: '', price: 0, description: '', brand: '', stock: 0 });
      setSelectedProduct(undefined);
      setSelectedType('');
    } catch (err) {
      console.error("Error actualizando el producto:", err);
      addToast({title: "Error al actualizar producto", description:'Inténtelo más tarde', color: "danger"});
    }
  }

  return (
    <section className='flex flex-col items-center justify-center p-20 max-[450px]:p-5 h-[100dvh]'>
      <h1 className='font-bold text-3xl mb-2'>Editar producto existente</h1>
      <p className='font-medium text-lg mb-5'>Edite precio y stock de cualquier producto</p>
      <div className='flex flex-wrap gap-4 mb-6'>
        <Autocomplete className='w-full' label="Categorias" labelPlacement='outside' placeholder='Buscar categoria...' variant='bordered'>
        {uniqueTypes.map((type, i) => (
          <AutocompleteItem key={i} onSelect={() => setSelectedType(type)}>{type}</AutocompleteItem>
        ))}
        </Autocomplete>
        <Autocomplete className='w-full' label="Productos" labelPlacement='outside' placeholder='Buscar producto...' variant='bordered'>
          {filteredProducts.map((product, i) => (
            <AutocompleteItem key={i} onSelect={() => setSelectedProduct(product)}>{product.name}</AutocompleteItem>
          ))}
        </Autocomplete>
      </div>
      {selectedProduct && (
        <form className='grid grid-cols-1 md:grid-cols-2 gap-4 bg-black p-6 rounded-xl mb-6 max-[450px]:w-full'>
          <Input label='Nombre' value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} />
          <Input label='Precio' type='number' value={Number(formState.price.toString().replace(/[^0-9,]/g, '').replace(/\./g, '').replace(',', '.')).toString()} onChange={(e) => setFormState({ ...formState, price: + e.target.value })} />
          <Input label='Descripción' value={formState.description} onChange={(e) => setFormState({ ...formState, description: e.target.value })} />
          <Input label='Marca' value={formState.brand} onChange={(e) => setFormState({ ...formState, brand: e.target.value })} />
          <Input label='Stock' type='number' value={formState.stock.toString()} onChange={(e) => setFormState({ ...formState, stock: + e.target.value })} />
        </form>
      )}
      <Button disabled={ !selectedProduct } className='bg-violet-600 text-white text-lg font-semibold p-6 hover:cursor-pointer' onPress={()=> setIsConfirming(true)}>Guardar cambios</Button>
      <Link href={`/dashboard`} className='text-white text-lg my-4 hover:underline'>Volver atrás</Link>
      <Modal isOpen={isConfirming} onClose={() => setIsConfirming(false)} isDismissable={false} className='bg-gray-700' backdrop='opaque' classNames={{ backdrop: 'bg-gradient-to-t from-violet-900 to-zinc-900/10 backdrop-opacity-20'}}>
        <ModalContent>
          <ModalHeader className="text-xl font-semibold">¿Confirmar cambios?</ModalHeader>
          <ModalBody>
            <p>¿Estás seguro que querés guardar estos cambios en <strong>{selectedProduct?.name}</strong>?</p>
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
export default EditPage
