import { Suspense } from "react";
import { connection } from "next/server";
import { cookies } from "next/headers";
import { AppShell } from "@/components/AppShell";

async function Kabuk({ children }) {
  await connection();
  const depo = await cookies();
  const sidebarAcik = depo.get("sidebar_state")?.value !== "false";
  return <AppShell sidebarAcik={sidebarAcik}>{children}</AppShell>;
}

export default function SssLayout({ children }) {
  return (
    <Suspense fallback={<div className="h-dvh bg-canvas" />}>
      <Kabuk>{children}</Kabuk>
    </Suspense>
  );
}
