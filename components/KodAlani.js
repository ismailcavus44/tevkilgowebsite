"use client";

export function KodAlani({ id, value, onChange, onComplete, error, disabled }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[14px] font-medium">
        Doğrulama kodu
      </label>
      <input
        id={id}
        name="kod"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        autoFocus
        disabled={disabled}
        value={value}
        onChange={(event) => {
          const rakamlar = event.target.value.replace(/\D/g, "").slice(0, 6);
          onChange(rakamlar);
          if (rakamlar.length === 6) onComplete?.(rakamlar);
        }}
        placeholder="••••••"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-hata` : undefined}
        className="control h-14 text-center !text-[24px] font-semibold tracking-[0.5em] tabular-nums"
      />
      {error ? (
        <p id={`${id}-hata`} className="mt-1.5 text-[13px] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
