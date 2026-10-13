"use client"

import Link from "next/link"
import Image from "next/image"
import { MoonStars } from "@phosphor-icons/react"
import { BildirimPaneli } from "@/components/uygulama/Bildirimler"
import { useOzellikler } from "@/components/uygulama/Ozellikler"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  const { modlarAktif } = useOzellikler()
  return (
    <header className="sticky top-0 z-30 flex min-h-14 shrink-0 items-center gap-2 border-b bg-card px-2 md:hidden" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <SidebarTrigger className="size-11" />
      <Link href="/app" className="flex min-h-11 min-w-0 items-center gap-2">
        <Image src="/icon.png" alt="" width={28} height={28} className="size-7 shrink-0 rounded-md" />
        <span className="truncate text-sm font-semibold">TevkilGO</span>
      </Link>
      <div className="ml-auto flex items-center">
        <BildirimPaneli />
        {modlarAktif ? (
          <Link href="/app#modlar" aria-label="Modlar" className="inline-flex size-11 items-center justify-center rounded-md text-foreground">
            <MoonStars size={20} />
          </Link>
        ) : null}
      </div>
    </header>
  )
}
