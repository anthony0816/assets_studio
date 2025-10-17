export async function POST(request) {
  const { url } = await request.json();

  const response = await fetch(url);
  const buffer = await response.arrayBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": response.headers.get("content-type"),
      "Content-Disposition": `attachment; filename="image.png"`,
    },
  });
}
