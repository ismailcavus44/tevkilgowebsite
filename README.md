## TevkilGO Web Sitesi

Statik, veritabanı ve admin paneli olmayan Next.js (App Router + Tailwind v4) projesi.

### Çalıştırma

PowerShell:
```powershell
npm install
npm run dev
```

Adres: `http://localhost:3000`

### Sayfalar
- `/` Ana sayfa (landing)
- `/blog` Blog & Duyurular (statik)
- `/kvkk` KVKK Aydınlatma Metni (statik, örnek)
- `/gizlilik-politikasi` Gizlilik Politikası (statik, örnek)
- `/sorumluluk-reddi` Sorumluluk Reddi Beyanı (statik, örnek)

### SEO
- `app/layout.tsx` içinde temel `metadata`
- `app/robots.txt/route.ts`
- `app/sitemap.xml/route.ts`

### Font
- Google Fonts Manrope (display: swap)

Not: Yasal metinler örnektir; yayın öncesi hukuk danışmanınız tarafından güncellenmelidir.
