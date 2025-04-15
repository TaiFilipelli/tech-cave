'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import api from '@/product/api'
import ProductsPage from '@/components/ProductsPage'
import FiltersComponent from '@/components/Filters'
import { Product } from '@/product/products'

const ClientProductsList = () => {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      let products = await api.list()

      const type = searchParams.get('type')
      const minPrice = searchParams.get('minPrice')
      const maxPrice = searchParams.get('maxPrice')

      if (type) {
        products = products.filter(p => p.type === type)
      }

      if (minPrice || maxPrice) {
        const min = minPrice ? parseInt(minPrice) : 0
        const max = maxPrice ? parseInt(maxPrice) : Infinity
        products = products.filter(p => {
          const price = Number(p.price)
          return price >= min && price <= max
        })
      }

      setProducts(products)
    }

    fetchProducts()
  }, [searchParams.toString()])

  return (
    <>
      <FiltersComponent />
      <ProductsPage products={products} />
    </>
  )
}

export default ClientProductsList
