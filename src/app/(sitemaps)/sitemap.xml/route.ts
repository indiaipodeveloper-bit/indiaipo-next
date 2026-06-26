import { API_URL } from "@/lib/constants";

export async function GET() {
  const response = await fetch(`${API_URL}/sitemap.xml`);

  return new Response(await response.text(), {
    headers: {
      "Content-Type": "application/xml",
    },
    status: response.status,
  });
}
