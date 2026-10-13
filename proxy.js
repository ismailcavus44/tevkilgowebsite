import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Next.js 16 oturum kapısı (eski adı middleware.js). Supabase oturum çerezini
// her istekte tazeler. Oturum yoksa /app altı /giris'e gider (?next= ile);
// oturum varsa /, /giris ve /uye-ol /app'e gider. Doğrulama durumu kontrolü
// /app layout'larındadır.

const GIRIS_SONRASI_KAPALI = ["/", "/giris", "/uye-ol"];

export async function proxy(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  // createServerClient ile getUser arasına kod girmemeli; oturum burada tazelenir.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;
  const appAlti = pathname === "/app" || pathname.startsWith("/app/");

  if (!user && appAlti) {
    const url = request.nextUrl.clone();
    url.pathname = "/giris";
    url.search = "";
    url.searchParams.set("next", `${pathname}${search}`);
    return yonlendir(url, supabaseResponse);
  }

  if (user && GIRIS_SONRASI_KAPALI.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/app";
    url.search = "";
    return yonlendir(url, supabaseResponse);
  }

  return supabaseResponse;
}

function yonlendir(url, supabaseResponse) {
  const response = NextResponse.redirect(url);
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie);
  });
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
