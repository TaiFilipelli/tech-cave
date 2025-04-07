import React from 'react'
import Link from 'next/link'
import { Button } from '@heroui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'

const DashboardPage = () => {
  return (
    <section className='flex flex-col items-center justify-center p-20'>
      <h1 className='font-bold text-3xl mb-5'>Dashboard de Tech´s Cave</h1>
      <p className='text-lg text-center'>Bienvenido al panel de administración de Tech´s Cave. Aquí puedes administrar los productos de la tienda.</p>
      <div className='flex flex-col justify-center items-center gap-3 mt-10 w-full'>
        <Button as={Link} href='/dashboard/add' className='bg-gradient-to-br from-pink-600 to-yellow-600 text-white font-semibold w-1/3' startContent={<FontAwesomeIcon icon={faPlus} size='sm'/>}>Agregar producto</Button>
        <Button as={Link} href='/dashboard/edit' className='bg-gradient-to-br from-pink-600 to-yellow-600 text-white font-semibold w-1/3' startContent={<FontAwesomeIcon icon={faPencil} size='sm'/>}>Editar producto</Button>
        <Button as={Link} href='/dashboard/delete' className='bg-gradient-to-br from-pink-600 to-yellow-600 text-white font-semibold w-1/3' startContent={<FontAwesomeIcon icon={faTrash} size='sm'/>}>Eliminar producto</Button>
      </div>
      <Link href={'/'} className='underline text-white text-lg my-5'>Volver atrás</Link>
    </section>
  )
}

export default DashboardPage
