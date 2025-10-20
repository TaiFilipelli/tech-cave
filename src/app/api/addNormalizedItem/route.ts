import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { accessToken, values, sheetName } = body; 
  
      if (!accessToken || !values || !sheetName) {
        return new Response(JSON.stringify({ error: "Faltan datos requeridos: accessToken, values o sheetName" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      // Se construye el rango dinámicamente. El append se hará a la columna A:B de la hoja especificada (Marcas o Tipos).
      const range = `${sheetName}!A:B`; 
      // El ID de la hoja de cálculo maestra se obtiene de otras rutas (ej. addProduct)
      const sheetId = "1O_9reXr8yzEZDllwOo_YKOtJ3HZqKJd7dkF_cWrqa1g";
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`; 

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          range,
          majorDimension: "ROWS",
          values,
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        console.error("Error al añadir item normalizado:", data.error);
        return new NextResponse(JSON.stringify({ error: data.error?.message || "Error desconocido en Google Sheets API" }), {
          status: res.status,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      return new NextResponse(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new NextResponse(JSON.stringify({ error: "Error en el servidor", detail: (error as Error).message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }