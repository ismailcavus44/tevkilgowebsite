"use client";

import { useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";

export function Field({ label, multiline = false, error, hint, ref, id, type, ...props }) {
  const [goster, setGoster] = useState(false);
  const sifre = type === "password";
  const aciklama = error ? `${id}-hata` : hint ? `${id}-ipucu` : undefined;
  const ortak = {
    ref,
    id,
    className: `control${sifre ? " pr-11" : ""}`,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": aciklama,
    ...props,
  };

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[14px] font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        {multiline ? (
          <textarea {...ortak} />
        ) : (
          <input type={sifre && goster ? "text" : type} {...ortak} />
        )}
        {sifre ? (
          <button
            type="button"
            onClick={() => setGoster((deger) => !deger)}
            aria-label={goster ? "Şifreyi gizle" : "Şifreyi göster"}
            aria-pressed={goster}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted hover:text-ink"
          >
            {goster ? <EyeSlash size={18} /> : <Eye size={18} />}
          </button>
        ) : null}
      </div>
      {error ? (
        <p id={`${id}-hata`} className="mt-1.5 text-[13px] text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-ipucu`} className="mt-1.5 text-[13px] text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
