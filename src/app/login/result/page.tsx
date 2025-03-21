'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@heroui/react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const LoginResult = () => {
  const { data: session } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkGoogleSheetsPermissions = async () => {
      if (!session?.accessToken) return;

      const sheetId = "1O_9reXr8yzEZDllwOo_YKOtJ3HZqKJd7dkF_cWrqa1g";
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:A1?valueRenderOption=FORMATTED_VALUE`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        });

        setIsAdmin(response.ok);
      } catch (error) {
        console.error("Error verificando permisos:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    if (session?.accessToken) {
      checkGoogleSheetsPermissions();
    }
  }, [session]);

  return (
    <section className="flex flex-col items-center justify-center text-center p-20">
      <h1 className='text-4xl font-bold mb-2'>Bienvenido, {session?.user?.name}!</h1>
      <p className='text-xl font-semibold mb-4'>Puede realizar compras libremente por la aplicación</p>

      {loading ? (
        <p className="text-lg">Verificando permisos...</p>
      ) : (
        <p className={`text-lg font-semibold ${isAdmin ? 'text-green-600' : 'text-red-600'}`}>
          {isAdmin ? "Tienes permisos de escritura en Google Sheets" : "No tienes permisos de escritura"}
        </p>
      )}

      <Button as={Link} href='/' className='text-lg font-semibold p-4 mt-6'>Volver atrás</Button>
    </section>
  );
};

export default LoginResult;
