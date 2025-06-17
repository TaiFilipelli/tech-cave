'use client'
import React from 'react'
import { useProducts } from '@/product/provider'
import { Product } from '@/product/products'
import { addToast, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'

const DeletePage = () => {

  const products:Product[] = useProducts();
  const { data: session } = useSession();

  const [selectedProduct, setSelectedProduct] = React.useState< Product | null>(null);
  const [selectedType, setSelectedType] = React.useState<string>('');
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);

  const uniqueTypes = [...new Set(products.map((p) => p.type))];

  React.useEffect(() => {
    if (selectedType) {
      setFilteredProducts(products.filter((p) => p.type === selectedType));
    }
  }, [selectedType, products]);

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
    <main className='flex flex-col items-center justify-center px-20 h-[100dvh]'>
      <h1 className='font-bold text-3xl mt-10'>Borrar producto existente</h1>
      <section className='flex flex-row max-[850px]:flex-col min-[850px]:items-center gap-4 w-2/3 max-[850px]:w-full my-10 max-[850px]:my-0'>
        <article className='bg-black rounded-xl p-6 w-1/2 max-[850px]:w-full'>
          <h2 className='font-semibold text-xl my-4'>Seleccione el producto que desea borrar</h2>
            <div className='flex flex-wrap gap-4 mb-6'>
                <Dropdown>
                  <DropdownTrigger>
                    <Button>{selectedType || 'Seleccionar tipo de producto'}</Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    {uniqueTypes.map((type) => (
                      <DropdownItem key={type} onPress={() => setSelectedType(type)} className='text-black' showDivider>{type}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
        
                <Dropdown isDisabled={!selectedType}>
                  <DropdownTrigger>
                    <Button>{selectedProduct ? selectedProduct.name.slice(0, 20) + "..." : 'Seleccionar producto'}</Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    {filteredProducts.map((product) => (
                      <DropdownItem key={product.id} onPress={() => setSelectedProduct(product)} className='text-black' showDivider>{product.name.slice(0, 30) + "..."}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
        </article>
        <article className='bg-black rounded-xl p-6 mb-5 w-1/2 max-[850px]:w-full items-center'>
          <h3 className='font-semibold text-2xl my-4'>Producto seleccionado</h3>
          {selectedProduct ? 
          <>
            <h3>{selectedProduct?.name}</h3>
            <Image src={selectedProduct!.image} alt={selectedProduct!.name} width={200} height={200}/>
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
          <Button disabled={!selectedProduct} className='text-lg bg-gradient-to-br from-red-400 to-red-600 text-white' startContent={<FontAwesomeIcon icon={faTrashCan}/>} onPress={()=>setIsDeleting(true)}>Eliminar producto</Button> 
      </article>
    )}
    <Link href={'/dashboard'} className='hover:underline text-xl my-5'>Volver atrás</Link>
     <Modal isOpen={isDeleting} onClose={() => setIsDeleting(false)} isDismissable={false} className='bg-gray-700' backdrop='opaque' classNames={{backdrop: 'bg-gradient-to-t from-red-900 to-zinc-900/10 backdrop-opacity-20'}}>
        <ModalContent>
          <ModalHeader className="text-xl font-semibold">¿Confirmar eliminación?</ModalHeader>
          <ModalBody>
            <p>¿Estás seguro que deseas eliminar <strong>{selectedProduct?.name}</strong> para siempre?</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" color='danger' className='text-white' onPress={() => setIsDeleting(false)}>Cancelar</Button>
            <Button variant='shadow' color='secondary' className='text-white font-semibold' onPress={() => { handleDelete(); setIsDeleting(false); }}>Confirmar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </main>
  )
}

export default DeletePage
