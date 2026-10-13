# TevkilGO

TevkilGO mobil uygulamasının web sürümü. Avukatlar arası duruşma tevkil pazaryeri.

## Ana kural

Web'de iş mantığı yazılmaz. Kontenjan, kör toplama süresi, günlük limit, bakiye gibi bütün kurallar Supabase'teki RPC ve RLS'te durur. Web, mobil uygulamanın çağırdığı RPC'leri aynı şekilde çağırır. Kural web'de yeniden yazılmaz, gevşetilmez ve ikinci bir yerde doğrulanmaz.

## Bu iskelet

Veri bağlantısı yok. Sayfalar Supabase'ten okumaz. `/app` herkese açıktır; koruma sonraki adımdadır.

Oturum iskeleti `proxy.js` içindedir. Next.js 16'da bu dosya middleware'in yerine geçer. `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_ANON_KEY` doluysa ve oturum varsa `/` adresi `/app`'e yönlenir. Oturum yoksa veya anahtarlar boşsa proxy hiçbir şey yapmaz.

İstemci ve sunucu Supabase kurucuları `lib/supabase/client.js` ve `lib/supabase/server.js` altındadır.

## Ortam

`.env.local` (commit edilmez):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Tasarım

Renk, yazı ölçeği, köşe yuvarlaklığı ve yüzen gölge `app/globals.css` içindedir. Yazı tipi Manrope (`latin` ve `latin-ext`).

## Komutlar

```bash
npm run dev
```
