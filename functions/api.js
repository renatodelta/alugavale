export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // KV Namespace is accessed via env.DB
  const DB = env.DB;
  
  if (!DB) {
    return new Response(JSON.stringify({ error: "KV DB not bound. Please bind 'DB' in Cloudflare settings." }), { status: 500 });
  }

  const STORAGE_KEY = "properties_data";

  // Handle GET - Fetch list
  if (request.method === "GET") {
    const data = await DB.get(STORAGE_KEY);
    return new Response(data || "[]", {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  // Handle POST - Save/Update
  if (request.method === "POST") {
    const input = await request.json();
    const currentDataRaw = await DB.get(STORAGE_KEY);
    let properties = JSON.parse(currentDataRaw || "[]");

    if (input.action === 'update_status') {
      properties = properties.map(p => {
        if (p.id === input.id) {
          p.status = input.status;
          if (input.status === 'rejected') {
            p.photos = [];
            p.description = '--- REGISTRO REJEITADO ---';
            p.neighborhood = '---';
            p.rentValue = '0,00';
          }
        }
        return p;
      });
    } else if (input.action === 'delete') {
      properties = properties.filter(p => p.id !== input.id);
    } else {
      const newProperty = {
        ...input,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      properties.push(newProperty);
    }

    await DB.put(STORAGE_KEY, JSON.stringify(properties));
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  // Handle OPTIONS (Pre-flight)
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }

  return new Response("Method not allowed", { status: 405 });
}
