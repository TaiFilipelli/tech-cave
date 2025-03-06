'use client';
import React from 'react'
import { Button } from '@heroui/react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const LoginResult = () => {

  const { data: session } = useSession();

  return (
    <section className="flex flex-col items-center justify-center text-center p-20">
      <h1 className='text-4xl font-bold mb-2'>Bienvenido, {session?.user.name}!</h1>
      <p className='text-xl font-semibold mb-10'>Puede realizar compras libremente por la aplicación</p>
      <Button as={Link} href='/' className='text-lg font-semibold p-4'>Volver atrás</Button>
    </section>
  )
}

export default LoginResult
