'use client'
import React from 'react'
import { useProducts } from '@/product/provider'

const AddPage = () => {

  const products = useProducts()


  return (
    <section className='flex flex-col items-center justify-center p-20'>
      <h1 className='font-bold text-3xl'>Agregar producto</h1>
      <h2 className='font-semibold text-xl my-5'>ADVERTENCIA: El texto a continuación únicamente sirve para chequear si funca. Parece que si.</h2>
      <p>{JSON.stringify(products)}</p>
    </section>
  )
}

export default AddPage
