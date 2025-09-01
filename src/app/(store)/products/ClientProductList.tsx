'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ProductsPage from '@/components/ProductsPage'
import FiltersComponent from '@/components/Filters'
import { Product } from '@/product/products'
import { useProducts } from '@/product/provider'
import OrderComponent from '@/components/Order'

const ClientProductsList = () => {
  const allProducts = useProducts();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<'asc' | 'desc' | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts);

  useEffect(() => {

    const typeRaw = searchParams.get('type');
    const type = typeRaw ? decodeURIComponent(typeRaw.replace(/\+/g, ' ')) : null;
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const brand = searchParams.get('brand');

    let result = [...allProducts];

    if (type) {
      result = result.filter(p => p.type.toLowerCase() === type.toLowerCase());
    }

    if(brand){
      result = result.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    }
    
    const parsePrice = (price: string | number): number => {
    if (typeof price === 'number') return price;
    return Number(price.replace(/[^0-9]/g, ''));
  };

    if (minPrice || maxPrice) {
      const min = minPrice ? parsePrice(minPrice) : 0;
      const max = maxPrice ? parsePrice(maxPrice) : Infinity;

      result = result.filter(p => parsePrice(p.price) >= min && parsePrice(p.price) <= max);
    }

    if (order) {
    result.sort((a, b) => 
      order === 'asc'
        ? Number(a.price) - Number(b.price)
        : Number(b.price) - Number(a.price)
    );
    } else {
      result.sort((a, b) => Number(a.id) - Number(b.id));
    }
    setFilteredProducts(result);

  }, [searchParams.toString(), allProducts, order]);

  return (
    <main className='w-full flex flex-row'>
      <FiltersComponent />
      <section className='w-full flex flex-col'>
        <header className='flex flex-row justify-between items-center mb-5 mx-10'>
          <h2 className="text-5xl font-bold">Productos</h2>
          <OrderComponent onChange={setOrder} order={order} />
        </header>
        <ProductsPage products={filteredProducts} />
      </section>
    </main>
  );
};

export default ClientProductsList;
