"use client"

import Link from "next/link"
import Image from "next/image"
import { List } from "@phosphor-icons/react"
import { BildirimPaneli } from "@/components/uygulama/Bildirimler"
import { useSidebar } from "@/components/ui/sidebar"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  return (
    <header className="sticky top-0 z-30 flex min-h-14 shrink-0 items-center gap-2 border-b bg-card px-2 md:hidden" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <button type="button" onClick={toggleSidebar} aria-label="Menüyü aç" className="inline-flex size-11 items-center justify-center rounded-md text-foreground active:bg-muted">
        <List size={24} />
      </button>
      <Link href="/app" className="flex min-h-11 min-w-0 items-center gap-2">
        <Image src="/icon.png" alt="" width={28} height={28} className="size-7 shrink-0 rounded-md" />
        <span className="truncate text-sm font-semibold">TevkilGO</span>
      </Link>
      <div className="ml-auto flex items-center">
        <BildirimPaneli />
      </div>
    </header>
  )
}
