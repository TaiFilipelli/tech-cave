'use client'
import React, { useEffect, useState } from 'react'
import ProductsPage from '@/components/ProductsPage'
import FiltersComponent from '@/components/Filters';
import api from '@/product/api';
import { Product } from '@/product/products';
import { useSearchParams } from 'next/navigation';

const ProductsListPage = () => {

  const [productsList, setProducts] = useState<Product[]>([]);
  const searchParams = useSearchParams();
  useEffect(() => {
      const fetchProducts = async() => {
          try{
              const type = searchParams.get('type');
              const brand = searchParams.get('brand');
              const price = searchParams.get('price');
              let products:Product[] = await api.list();

              if (type) {
                products = products.filter(p => p.type === type)
              }
              if(brand){
                products = products.filter(p => p.brand === brand)
              }
              if (price) {
                const priceNum = parseInt(price)
                products = products.filter(p => Number(p.price) <= priceNum)
              }

              setProducts(products);
            }
            catch(err){
              console.error('ERROR FETCHING PRODUCTS:', err);
          }
      };
        
    fetchProducts();
  }, [searchParams]);

  return (
    <section className='flex flex-col items-center text-center p-10'>
      <h2 className='font-bold text-5xl text-black mb-5'>Productos</h2>
      <FiltersComponent/>
      <ProductsPage products={productsList} />
    </section>
  )
}

export default ProductsListPage
