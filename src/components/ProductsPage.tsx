import { Product } from '@/product/products'
import React from 'react'
import ProductCard from './ProductCard'
import { useCartStore } from '@/store/useCartStore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSadTear } from '@fortawesome/free-solid-svg-icons';
import { Pagination } from '@heroui/react';

interface ProductsPageProps {
  products: Product[];
}
const ProductsPage:React.FC<ProductsPageProps> = ({products}) => {

    const { addToCart } = useCartStore((state) => state);

    const [currentPage, setCurrentPage] = React.useState(1);
    const productsPerPage = 8;

    const totalPages = Math.ceil(products.length / productsPerPage);

    const paginatedProducts = products.slice((currentPage -1) * productsPerPage, currentPage * productsPerPage);

    return (
       <section className='items-center justify-center flex flex-col'>
      {products.length > 0 ? (
        <>
          <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10'>
            {paginatedProducts.map((product) => (
              <ProductCard product={product} key={product.id} addToCart={addToCart} />
            ))}
          </section>

          <div className='mt-10'>
            <Pagination page={currentPage} total={totalPages} onChange={setCurrentPage} variant='light' showControls showShadow classNames={{cursor: 'bg-gradient-to-br from-red-600 to-yellow-500'}}/>
          </div>
        </>
      ) : (
        <section className='flex flex-col gap-4 m-10 items-center'>
          <h1 className='text-xl font-semibold text-black mb-4'>No hay productos disponibles.</h1>
          <FontAwesomeIcon icon={faFaceSadTear} size="2xl" />
        </section>
      )}
    </section>
  )
}

export default ProductsPage
