export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/app", "/app/"],
    },
    sitemap: "https://www.tevkilgo.org/sitemap.xml",
    host: "https://www.tevkilgo.org",
  };
}
