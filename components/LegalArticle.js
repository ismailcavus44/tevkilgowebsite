import { Children, isValidElement } from "react";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createSlugger } from "@/lib/legal";

const linkClass = "font-medium text-navy underline decoration-line underline-offset-2";

export function ReadingLayout({ title, toc, children }) {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[minmax(0,70ch)_14rem] lg:justify-center lg:gap-16">
      <article>
        <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
        {toc?.length ? (
          <nav className="mt-6 lg:hidden" aria-label="İçindekiler">
            <Toc items={toc} />
          </nav>
        ) : null}
        <div className="mt-8 space-y-6">{children}</div>
      </article>
      {toc?.length ? (
        <nav className="hidden lg:block" aria-label="İçindekiler">
          <div className="sticky top-8">
            <Toc items={toc} />
          </div>
        </nav>
      ) : null}
    </div>
  );
}

function Toc({ items }) {
  return (
    <div>
      <p className="text-sm font-medium text-muted">İçindekiler</p>
      <ul className="mt-3 space-y-2 border-l border-line">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block border-l-2 border-transparent text-muted hover:text-ink ${
                item.level > 2 ? "py-1 pl-6 text-sm" : "py-1 pl-3 text-sm"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function textOf(children) {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") return String(child);
      if (isValidElement(child)) return textOf(child.props.children);
      return "";
    })
    .join("");
}

function MdLink({ href = "", children }) {
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} className={linkClass}>
        {children}
      </Link>
    );
  }
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className={linkClass}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

export function LegalArticle({ doc }) {
  const slug = createSlugger();

  const components = {
    h2: ({ children }) => (
      <h2 id={slug(textOf(children))} className="pt-4 text-xl font-bold">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 id={slug(textOf(children))} className="pt-2 text-lg font-bold">
        {children}
      </h3>
    ),
    a: MdLink,
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    ul: ({ children }) => <ul className="list-disc space-y-2 pl-5">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal space-y-2 pl-5">{children}</ol>,
    table: ({ children }) => (
      <div className="overflow-x-auto rounded-card border border-line bg-surface">
        <table className="w-full border-collapse text-left text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-canvas">{children}</thead>,
    th: ({ children }) => (
      <th scope="col" className="border-b border-line px-4 py-3 font-semibold">
        {children}
      </th>
    ),
    td: ({ children }) => <td className="border-b border-line px-4 py-3 align-top">{children}</td>,
    tr: ({ children }) => <tr className="[&:last-child>td]:border-b-0">{children}</tr>,
  };

  return (
    <ReadingLayout title={doc.title} toc={doc.toc}>
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {doc.body}
      </Markdown>
    </ReadingLayout>
  );
}
