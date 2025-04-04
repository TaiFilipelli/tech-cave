import React from 'react'
import Link from 'next/link'

const DashboardPage = () => {
  return (
    <section className='flex flex-col items-center justify-center p-20'>
      <h1 className='font-bold text-3xl'>Dashboard de Tech´s Cave</h1>
      <Link href={'/'} className='underline text-white text-lg my-5'>Volver atrás</Link>
    </section>
  )
}

export default DashboardPage
