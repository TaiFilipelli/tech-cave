'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ProductsPage from '@/components/ProductsPage'
import FiltersComponent from '@/components/Filters'
import { Product } from '@/product/products'
import { useProducts } from '@/product/provider'

const ClientProductsList = () => {
  const allProducts = useProducts();
  const searchParams = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts);

  useEffect(() => {
    const type = searchParams.get('type');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const brand = searchParams.get('brand');

    let result = [...allProducts];

    if (type) {
      result = result.filter(p => p.type === type);
    }

    if(brand){
      result = result.filter(p => p.brand === brand);
    }
    
    if (minPrice || maxPrice) {
      const min = minPrice ? Number(minPrice) : 0;
      const max = maxPrice ? Number(maxPrice) : Infinity;
  
      result = result.filter(p => Number(p.price.toString().replace(/[^0-9.,]/g, '').replace(',', '.')) >= min && Number(p.price.toString().replace(/[^0-9.,]/g, '').replace(',', '.')) <= max);
    }
    setFilteredProducts(result);

  }, [searchParams.toString(), allProducts]);

  return (
    <>
      <FiltersComponent />
      <ProductsPage products={filteredProducts} />
    </>
  );
};

export default ClientProductsList;
