import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// İş mantığı burada yazılmaz. Kontenjan, kör toplama, günlük limit ve bakiye
// Supabase RPC ile RLS içindedir. Web, mobil uygulamanın çağırdığı RPC'yi çağırır.

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Component içinden çerez yazılamaz. Oturum tazelemesi proxy.js'tedir.
          }
        },
      },
    },
  );
}
