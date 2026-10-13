"use client";

import { useEffect, useState } from "react";
import { Star } from "@phosphor-icons/react/ssr";

const APPLICANTS = [
  { name: "Av. A··· Y.", score: "4,8" },
  { name: "Av. M··· K.", score: "4,6" },
  { name: "Av. S··· D.", score: "4,9" },
  { name: "Av. E··· T.", score: "4,7" },
];

export function ListingCard({ variant = "hero" }) {
  const calm = variant === "calm";
  const [count, setCount] = useState(calm ? 4 : 2);

  useEffect(() => {
    if (calm) return undefined;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const toThree = window.setTimeout(
      () => setCount(reduce ? 4 : 3),
      reduce ? 0 : 700,
    );
    const toFour = window.setTimeout(() => setCount(4), reduce ? 0 : 1400);
    return () => {
      window.clearTimeout(toThree);
      window.clearTimeout(toFour);
    };
  }, [calm]);

  const people = APPLICANTS.slice(0, count);

  if (calm) {
    return (
      <article className="overflow-hidden rounded-card border border-line bg-surface">
        <header className="px-5 pt-5">
          <p className="text-lg font-bold leading-snug">
            Ankara Batı Adliyesi · 3. İş Mahkemesi
          </p>
        </header>
        <div className="px-5 py-5">
          <CardBody count={count} people={people} calm />
        </div>
      </article>
    );
  }

  return (
    <article className="overflow-hidden rounded-card bg-surface shadow-float">
      <div className="px-6 py-6">
        <p className="text-xl font-bold leading-snug">
          Ankara Batı Adliyesi · 3. İş Mahkemesi
        </p>
        <CardBody count={count} people={people} />
      </div>
    </article>
  );
}

function CardBody({ count, people, calm = false }) {
  return (
    <>
      <p
        className={
          calm
            ? "text-xl font-extrabold"
            : "mt-4 text-2xl font-extrabold tracking-tight"
        }
      >
        Yarın 09:30
      </p>
      <p className={`text-muted ${calm ? "mt-1" : "mt-2 text-lg"}`}>
        Duruşmaya katılım
      </p>
      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-base font-medium">Başvuranlar</p>
        <p className="rounded-full border border-gold px-3 py-1 text-base font-medium text-navy tabular-nums">
          {count} başvuru
        </p>
      </div>
      <ul className="mt-2 min-h-[13.5rem] divide-y divide-line">
        {people.map((person, index) => (
          <li
            key={person.name}
            className={`flex items-center justify-between gap-3 py-3 ${
              !calm && index >= 2 ? "applicant-enter" : ""
            }`}
          >
            <span className="text-base font-medium">{person.name}</span>
            <span className="inline-flex items-center gap-1 text-base tabular-nums">
              <Star size={18} weight="fill" aria-hidden="true" />
              <span>{person.score}</span>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
