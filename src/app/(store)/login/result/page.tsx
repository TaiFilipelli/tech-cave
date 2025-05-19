'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@heroui/react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

const LoginResult = () => {
  const { data: session } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkGoogleSheetsPermissions = async () => {
      if (!session?.accessToken) return;

      const sheetId = "1O_9reXr8yzEZDllwOo_YKOtJ3HZqKJd7dkF_cWrqa1g";
      const range = "Productos!I2";
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?valueInputOption=USER_ENTERED`;

      const data = {
        range: range,
        majorDimension: "ROWS",
        values: [["Testeo de permisos, pa"]],
      };

      try {
        const writeResponse = await fetch(
          url,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        let hasPermissions = false;
    
        if (!writeResponse.ok) {
          throw new Error(`Error en la escritura: ${writeResponse.statusText}`);
        }else {
          setIsAdmin(true);
          hasPermissions = true;
        }

        console.log("✅ Escritura exitosa. Añadiendo usuario a la base de datos...");
    
        
        const user = {
          name: session.user.name,
          email: session.user.email,
          isAdmin: hasPermissions,
        }
        
        const addUserResponse = await fetch("/api/users", {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
          credentials:'include',
        });
        
        if (!addUserResponse.ok) {
          throw new Error(`Error al guardar usuario: ${addUserResponse.statusText}`);
        }
        console.log("Usuario guardado exitosamente:", addUserResponse.status,". Ahora, limpiando celda...");
        setLoading(false);

        const clearResponse = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:clear`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
    
        if (!clearResponse.ok) {
          throw new Error(`Error al borrar: ${clearResponse.statusText}`);
        }
    
        console.log("🧹 Celda limpiada exitosamente. Ahora, añadiendo usuario a la db...");

        return true;
      } catch (error) {
        setLoading(false);
        console.error(error)
        return false;
      }
    };

    if (session?.accessToken) {
      checkGoogleSheetsPermissions();
    }
  }, [session]);

  return (
    <section className="h-[80vh] flex flex-col items-center justify-center text-center p-20 mt-16">
      {loading ? (
        <>
          <FontAwesomeIcon icon={faCircleNotch} spin size='2xl'/>
          <p className='text-lg font-semibold'>Espere un momento, por favor...</p>
        </>
      ) : (
        <>
        <h1 className='text-4xl font-bold mb-2'>Bienvenido, {session?.user?.name}!</h1>
        <p className='text-xl font-semibold mb-4'>Puede realizar compras libremente por la aplicación</p>
        <p className={`text-lg font-semibold ${isAdmin ? 'text-green-600' : 'text-red-600'}`}>
          {isAdmin ? "Tienes permisos de escritura en Google Sheets" : "No tienes permisos de escritura"}
        </p>
        </>
      )}

      <Button as={Link} href='/' className='text-lg font-semibold p-4 mt-6'>Volver atrás</Button>
    </section>
  );
};

export default LoginResult;
