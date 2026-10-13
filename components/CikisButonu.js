"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function CikisButonu({ className = "", children = "Çıkış" }) {
  const router = useRouter();
  const [bekliyor, setBekliyor] = useState(false);

  return (
    <button
      type="button"
      disabled={bekliyor}
      className={className}
      onClick={async () => {
        setBekliyor(true);
        await createClient().auth.signOut();
        router.replace("/giris");
        router.refresh();
      }}
    >
      {children}
    </button>
  );
}
