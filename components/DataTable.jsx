"use client";

import { flexRender } from "@tanstack/react-table";
import { useLegacyTable } from "@tanstack/react-table/legacy";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function DataTable({ columns, data, yukleniyor, onRow, secili }) {
  const table = useLegacyTable({
    data: data || [],
    columns,
  });

  if (yukleniyor) {
    return (
      <div className="space-y-2 p-4" aria-busy="true">
        {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-12 w-full" />)}
      </div>
    );
  }

  const satirlar = table.getRowModel().rows;

  return (
    <>
      <div className="md:hidden">
        {satirlar.map((satir) => {
          const hucreler = satir.getVisibleCells();
          const tarih = hucreler.find((hucre) => kolonMu(hucre, ["created_at", "tarih", "son_mesaj_at"], ["tarih"]));
          const durum = hucreler.find((hucre) => kolonMu(hucre, ["durum"], ["durum"]));
          const alt = hucreler.filter((hucre) => hucre !== tarih && hucre !== durum);
          return (
            <button key={satir.id} type="button" className="flex min-h-11 w-full flex-col gap-1 border-b border-border px-4 py-3 text-left last:border-b-0 hover:bg-muted/40" onClick={() => onRow?.(satir.original)}>
              <span className="flex items-center justify-between gap-2">
                <span className="min-w-0 truncate text-sm">{tarih ? flexRender(tarih.column.columnDef.cell, tarih.getContext()) : null}</span>
                <span className="shrink-0">{durum ? flexRender(durum.column.columnDef.cell, durum.getContext()) : null}</span>
              </span>
              <span className="flex flex-wrap gap-x-2 text-sm text-muted-foreground">
                {alt.map((hucre) => (
                  <span key={hucre.id} className="max-w-full min-w-0 truncate">{flexRender(hucre.column.columnDef.cell, hucre.getContext())}</span>
                ))}
              </span>
            </button>
          );
        })}
      </div>
      <div className="hidden md:block">
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((grup) => (
          <TableRow key={grup.id}>
            {grup.headers.map((hucre) => (
              <TableHead key={hucre.id} className={`h-10 bg-muted/40 px-4 text-xs font-medium text-muted-foreground normal-case ${hucre.column.columnDef.meta?.className || ""}`}>
                {hucre.isPlaceholder ? null : flexRender(hucre.column.columnDef.header, hucre.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((satir) => (
          <TableRow
            key={satir.id}
            className="h-12 cursor-pointer border-border hover:bg-muted/40"
            data-state={secili?.(satir.original) ? "selected" : undefined}
            onClick={() => onRow?.(satir.original)}
          >
            {satir.getVisibleCells().map((hucre) => (
              <TableCell key={hucre.id} className={`px-4 ${hucre.column.columnDef.meta?.className || ""}`}>
                {flexRender(hucre.column.columnDef.cell, hucre.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
      </div>
    </>
  );
}

function kolonMu(hucre, anahtarlar, basliklar) {
  const id = String(hucre.column.id || "").toLowerCase();
  const baslik = hucre.column.columnDef.header;
  const yazi = typeof baslik === "string" ? baslik.toLocaleLowerCase("tr-TR") : "";
  return anahtarlar.some((anahtar) => id.includes(anahtar)) || basliklar.some((parca) => yazi.includes(parca));
}
