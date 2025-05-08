import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@heroui/react'
import Link from 'next/link'

const ErrorPage = () => {
  return (
    <section className='flex flex-col items-center justify-center p-20 h-[70vh] mt-16'>
      <FontAwesomeIcon icon={faXmark} className='text-9xl' beat/>
      <h1 className='font-bold text-3xl'>404 - Página no encontrada</h1>
      <p className='font-semibold text-xl m-5'>Nada que ver acá, pa. Volvé tranqui</p>
      <Button as={Link} href='/' className='bg-blue-600 text-white px-6' startContent={<FontAwesomeIcon icon={faArrowLeft}/>}>Volver</Button>
    </section>
  )
}

export default ErrorPage
