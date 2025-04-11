'use client'
import React, { useEffect, useState } from 'react'
import ProductsPage from '@/components/ProductsPage'
import api from '@/product/api';
import { Product } from '@/product/products';

const ProductsListPage = () => {

    const[productsList, setProducts] = useState<Product[]>([]);


    useEffect(() => {
        const fetchProducts = async() => {
              try{
                const products:Product[] = await api.list();
                setProducts(products);
              }
              catch(err){
                console.error('ERROR FETCHING PRODUCTS:', err);
              }
        };
        
        fetchProducts();
        
    }, []);

  return (
    <section className='p-10'>
      <ProductsPage products={productsList} />
    </section>
  )
}

export default ProductsListPage
