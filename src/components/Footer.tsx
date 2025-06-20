import React from 'react'
import Link from 'next/link'
import { Divider } from '@heroui/react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyBillTransfer } from '@fortawesome/free-solid-svg-icons'

const Footer = () => {
  return (
    <footer className="dark:bg-gray-900 dark:text-white bg-gray-400 text-black px-6 py-10 flex flex-col items-center justify-center">
      <section className="container mx-auto flex flex-row justify-between items-center gap-4 max-[650px]:flex-col max-[650px]:gap-10">
        <nav className="flex flex-col gap-4 max-[650px]:w-full">
          <h3 className="text-xl font-semibold">Navegación Rápida</h3>
          <Divider/>
          <Link href="/products" className="hover:underline">Productos</Link>
          <Link href="/#about" className="hover:underline">Sobre nosotros</Link>
        </nav>
        <nav className='flex flex-col gap-4 max-[650px]:w-full'>
          <h3 className="text-xl font-semibold">Comunicate con el dev</h3>
          <Divider/>
          <Link href="https://wa.me/3364181788" className="hover:underline">WhatsApp</Link> 
          <Link href="https://github.com/TaiFilipelli" className="hover:underline">LinkedIn</Link>
        </nav>
        <nav className='flex flex-col gap-4 max-[650px]:w-full'>
          <h3 className="text-xl font-semibold">Medios de Pago</h3>
          <Divider/>
          <Image src={'/mercado-pago-logo.svg'} alt='MP Logo' width={100} height={100}/>
          <div className='flex flex-row gap-2 items-center'>
            <FontAwesomeIcon icon={faMoneyBillTransfer} size='2xl'/>
            <p>Efvo./Transferencia</p>
          </div>
        </nav>
      </section>
      <Divider className='mt-4'/>
      <p className="text-sm text-center md:text-left pt-5">
        &copy; {new Date().getFullYear()} Tech Cave. Todos los derechos reservados.
      </p>        
    </footer>
  )
}
export default Footer