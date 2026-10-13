import Link from "next/link";
import { CaretLeft } from "@phosphor-icons/react/ssr";

export function QuietDetail({ children }) {
  return (
    <div className="pointer-events-auto hidden h-full items-center bg-canvas px-8 py-10 md:flex">
      <p className="max-w-[36ch] text-muted">{children}</p>
    </div>
  );
}

export function RecordDetail({ backHref, title, body }) {
  return (
    <div className="pointer-events-auto flex h-full min-h-full flex-col bg-canvas">
      <header className="flex items-center gap-2 border-b border-line bg-surface px-3 py-2 md:px-6">
        <Link
          href={backHref}
          className="inline-flex min-h-11 items-center gap-1 rounded-control px-2 text-sm font-medium md:hidden"
        >
          <CaretLeft size={18} aria-hidden="true" />
          Geri
        </Link>
        <h1 className="text-lg font-extrabold md:hidden">{title}</h1>
        <h2 className="hidden text-lg font-extrabold md:block">{title}</h2>
      </header>
      <p className="measure px-5 py-8 text-muted md:px-8">{body}</p>
    </div>
  );
}
