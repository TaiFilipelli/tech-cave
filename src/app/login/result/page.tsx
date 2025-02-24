'use client';
import React from 'react'
import { Button } from '@heroui/react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const LoginResult = () => {

  const { data: session } = useSession();

  return (
    <section className="flex flex-col items-center justify-center">
      <h1>Bienvenido, {session?.user.name}!</h1>
      <p>Puede realizar compras libremente por la aplicación</p>
      <Button as={Link} href='/'>Volver atrás</Button>
    </section>
  )
}

export default LoginResult
