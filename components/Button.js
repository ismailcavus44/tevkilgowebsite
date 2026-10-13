import Link from "next/link";

const variants = {
  primary: "bg-navy text-white hover:bg-ink",
  secondary: "border border-line bg-surface text-ink hover:bg-canvas",
};

export function Button({
  href,
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  const classes = `inline-flex min-h-11 items-center justify-center rounded-control px-4 text-[15px] font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
