export async function POST(req: Request) {
    try {
      const { accessToken, productId } = await req.json();
  
      if (!accessToken || !productId) {
        return new Response(
          JSON.stringify({ error: 'Faltan datos requeridos' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      const sheetId = '1O_9reXr8yzEZDllwOo_YKOtJ3HZqKJd7dkF_cWrqa1g';
  
      const getRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Productos!A2:A`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      const getData = await getRes.json();
  
      if (!getRes.ok || !getData.values) {
        return new Response(JSON.stringify({ error: 'No se pudieron obtener productos' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      const rows = getData.values;
      const rowIndex = rows.findIndex((row: string[]) => row[0] === productId);
  
      if (rowIndex === -1) {
        return new Response(JSON.stringify({ error: 'Producto no encontrado' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      const deleteRow = rowIndex + 2;
  
      const batchRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}:batchUpdate`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [
              {
                deleteDimension: {
                  range: {
                    sheetId: 0,
                    dimension: 'ROWS',
                    startIndex: deleteRow - 1,
                    endIndex: deleteRow,
                  },
                },
              },
            ],
          }),
        }
      );
  
      const batchData = await batchRes.json();
  
      if (!batchRes.ok) {
        return new Response(JSON.stringify({ error: batchData.error || 'Error eliminando fila' }), {
          status: batchRes.status,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
  
    } catch (error) {
      console.error(error);
      return new Response(
        JSON.stringify({ error: 'Error en el servidor', detail: error }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }
  