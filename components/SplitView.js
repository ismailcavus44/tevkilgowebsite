"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export function SplitView({ list, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const acik = /\/(ilanlar|gorevlerim|basvurularim|bildirimler)\/[^/]+$/.test(pathname);
  const gorevDetay = /\/gorevlerim\/[^/]+$/.test(pathname);

  function kapat() {
    if (!acik) return;
    router.push(pathname.replace(/\/[^/]+$/, ""));
  }

  useEffect(() => {
    if (!acik) return undefined;
    function onKey(event) {
      if (event.key !== "Escape") return;
      if (document.querySelector("[role='dialog']")) return;
      router.push(pathname.replace(/\/[^/]+$/, ""));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [acik, pathname, router]);

  return (
    <div className="relative h-full min-h-0">
      <div className="h-full min-h-0 w-full overflow-hidden">{list}</div>
      {acik ? null : <div hidden>{children}</div>}
      <Sheet open={acik} onOpenChange={(sonraki) => { if (!sonraki) kapat(); }}>
        <SheetContent side="right" showCloseButton={!gorevDetay} className="h-dvh w-full max-w-none gap-0 bg-background p-0 data-[side=right]:h-dvh data-[side=right]:w-full data-[side=right]:max-w-none md:h-full md:max-w-md md:data-[side=right]:h-full md:data-[side=right]:max-w-md">
          <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">{acik ? children : null}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
