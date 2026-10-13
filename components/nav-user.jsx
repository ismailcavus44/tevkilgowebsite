"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { DotsThreeVertical, SignOut, User } from "@phosphor-icons/react"
import { CikisButonu } from "@/components/CikisButonu"
import { createClient } from "@/lib/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

export function NavUser() {
  const pathname = usePathname()
  const [acik, setAcik] = useState(false)
  const [kisi, setKisi] = useState(null)
  const tetik = useRef(null)
  const niyet = useRef(false)
  const yol = useRef(pathname)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      const { data: profil } = await supabase.from("users").select("ad_soyad, baro, fotograf_url").eq("id", data.user.id).maybeSingle()
      setKisi(profil)
    })
  }, [])

  useEffect(() => {
    if (document.activeElement === tetik.current) tetik.current.blur()
  }, [])

  useEffect(() => {
    const izin = (event) => {
      if (event.type === "keydown" && event.key !== "Enter" && event.key !== " ") return
      niyet.current = true
    }
    window.addEventListener("pointerdown", izin, true)
    window.addEventListener("keydown", izin, true)
    return () => {
      window.removeEventListener("pointerdown", izin, true)
      window.removeEventListener("keydown", izin, true)
    }
  }, [])

  useEffect(() => {
    if (yol.current === pathname) return
    yol.current = pathname
    setAcik(false)
  }, [pathname])

  const ad = kisi?.ad_soyad || "Hesap"
  const baro = kisi?.baro || ""
  const harf = ad.slice(0, 1)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu
          open={acik}
          onOpenChange={(sonraki, details) => {
            if (!sonraki) {
              setAcik(false)
              return
            }
            if (details?.reason === "trigger-press" && niyet.current) setAcik(true)
          }}
        >
          <DropdownMenuTrigger
            ref={tetik}
            openOnHover={false}
            render={<SidebarMenuButton size="lg" className="group-data-[collapsible=icon]:justify-center" />}
          >
            <Avatar className="size-8 shrink-0 rounded-lg">
              {kisi?.fotograf_url ? <AvatarImage src={kisi.fotograf_url} alt="" /> : null}
              <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">{harf}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-medium">{ad}</span>
              <span className="truncate text-xs text-muted-foreground">{baro || "Profil"}</span>
            </div>
            <DotsThreeVertical className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--anchor-width) min-w-0 max-w-(--anchor-width)"
            side="top"
            align="start"
            sideOffset={4}
          >
            <DropdownMenuItem render={<Link href="/app/profil" />} onClick={() => setAcik(false)}>
              <User size={16} />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" render={<CikisButonu className="flex w-full items-center gap-1.5" />} onClick={() => setAcik(false)}>
              <SignOut size={16} />
              Çıkış yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
