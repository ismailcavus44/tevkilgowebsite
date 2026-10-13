"use client";

import { useEffect, useId, useRef } from "react";
import { IlanFormu } from "@/components/uygulama/IlanFormu";

export function NewListingDialog({ open, onClose }) {
  const titleId = useId();
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(event) {
      if (event.key !== "Escape") return;
      onCloseRef.current();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  function close() {
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="dialog-panel max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-modal bg-surface p-6 shadow-float lg:max-w-[640px]"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-xl font-bold">
            <span className="lg:hidden">Görev Oluştur</span>
            <span className="hidden lg:inline">İlan aç</span>
          </h2>
          <button
            type="button"
            onClick={close}
            className="min-h-11 rounded-control px-2 text-sm text-muted"
          >
            Kapat
          </button>
        </div>
        <div className="mt-5">
          <IlanFormu onBitti={close} onVazgec={close} />
        </div>
      </div>
    </div>
  );
}
