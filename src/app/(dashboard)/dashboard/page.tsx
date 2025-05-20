'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@heroui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'

const DashboardPage = () => {

  const [greeting, setGreeting] = useState('Hola')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 12) {
      setGreeting('Buenos días')
    } else if (hour >= 12 && hour < 20) {
      setGreeting('Buenas tardes')
    } else {
      setGreeting('Buenas noches')
    }
  }, []);

  return (
    <section className='flex flex-col items-center justify-center p-20 max-[380px]:p-10'>
      <h1 className='font-bold text-3xl mb-5'>{greeting}, admin!</h1>
      <p className='text-lg text-center'>Bienvenido al panel de administración de Tech´s Cave. Aquí puedes administrar los productos de la tienda.</p>
      <div className='flex flex-col justify-center items-center gap-3 mt-10 w-full'>
        <Button as={Link} href='/dashboard/add' className='bg-gradient-to-br from-pink-600 to-yellow-600 text-white font-semibold w-1/3 max-[760px]:w-2/3 max-[500px]:w-full' startContent={<FontAwesomeIcon icon={faPlus} size='lg'/>}>Agregar producto</Button>
        <Button as={Link} href='/dashboard/edit' className='bg-gradient-to-br from-pink-600 to-yellow-600 text-white font-semibold w-1/3 max-[760px]:w-2/3 max-[500px]:w-full' startContent={<FontAwesomeIcon icon={faPencil} size='lg'/>}>Editar producto</Button>
        <Button as={Link} href='/dashboard/delete' className='bg-gradient-to-br from-pink-600 to-yellow-600 text-white font-semibold w-1/3 max-[760px]:w-2/3 max-[500px]:w-full' startContent={<FontAwesomeIcon icon={faTrash} size='lg'/>}>Eliminar producto</Button>
      </div>
      <Link href={'/'} className='underline text-white text-lg my-5'>Volver atrás</Link>
    </section>
  )
}

export default DashboardPage
