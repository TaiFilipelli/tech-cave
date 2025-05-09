import { Product } from '@/product/products'
import React from 'react'
import ProductCard from './ProductCard'
import { useCartStore } from '@/store/useCartStore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSadTear } from '@fortawesome/free-solid-svg-icons';

interface ProductsPageProps {
  products: Product[];
}
const ProductsPage:React.FC<ProductsPageProps> = ({products}) => {

    const { addToCart } = useCartStore((state) => state);

    return (
      <section className='items-center justify-center flex flex-col'>
        {products.length>0 ? 
          <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10'>
          {products.map((product)=>(
            <ProductCard product={product} key={product.id} addToCart={addToCart} />
          ))}
          </section>
        :
          <section className='flex flex-col gap-4 m-10'>
            <h1 className='text-xl font-semibold text-black mb-4'>No hay productos disponibles.</h1>
            <FontAwesomeIcon icon={faFaceSadTear} size="2xl"/>
          </section>
      }
      </section>
  )
}

export default ProductsPage
