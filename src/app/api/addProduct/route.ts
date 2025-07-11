export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { accessToken, values, range } = body;
  
      if (!accessToken || !values || !range) {
        return new Response(JSON.stringify({ error: "Faltan datos requeridos" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      const sheetId = "1O_9reXr8yzEZDllwOo_YKOtJ3HZqKJd7dkF_cWrqa1g";
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;
  
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
        return new Response(JSON.stringify({ error: data.error || "Error desconocido" }), {
          status: res.status,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Error en el servidor", detail: error }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  