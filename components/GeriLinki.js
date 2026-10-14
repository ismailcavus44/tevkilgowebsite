import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function GeriLinki({ href = "/", yazi = "Ana sayfa" }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-primary hover:underline"
    >
      <ArrowLeft className="size-4" />
      {yazi}
    </Link>
  );
}
