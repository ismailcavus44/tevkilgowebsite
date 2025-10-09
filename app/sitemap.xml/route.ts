export function GET() {
  const base = "https://www.tevkilgo.com";
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${base}/biz-kimiz</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${base}/blog</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${base}/kvkk</loc>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${base}/gizlilik-politikasi</loc>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${base}/sorumluluk-reddi</loc>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}



