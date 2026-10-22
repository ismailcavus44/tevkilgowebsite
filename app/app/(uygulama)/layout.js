import { Suspense } from "react";
import { cookies } from "next/headers";
import { AppShell } from "@/components/AppShell";
import { uygulamaKapisi } from "@/lib/oturum";

async function OnayKapisi({ children }) {
  await uygulamaKapisi();
  const depo = await cookies();
  const sidebarAcik = depo.get("sidebar_state")?.value !== "false";
  return <AppShell sidebarAcik={sidebarAcik}>{children}</AppShell>;
}

export default function UygulamaLayout({ children }) {
  return (
    <Suspense fallback={<div className="h-dvh bg-canvas" />}>
      <OnayKapisi>{children}</OnayKapisi>
    </Suspense>
  );
}
