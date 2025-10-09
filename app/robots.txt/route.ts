export function GET() {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://www.tevkilgo.com/sitemap.xml`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}



