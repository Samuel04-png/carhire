import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { faqs } from "@/data/mock";

export default function FAQPage() {
  const [query, setQuery] = useState("");

  const grouped = useMemo<Record<string, typeof faqs>>(() => {
    return faqs
      .filter((item) =>
        `${item.question} ${item.answer} ${item.category}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      )
      .reduce<Record<string, typeof faqs>>((accumulator, item) => {
        accumulator[item.category] ??= [];
        accumulator[item.category].push(item);
        return accumulator;
      }, {});
  }, [query]);

  return (
    <div className="bg-[var(--color-gray-100)] pb-20">
      <PageHero
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        description="Answers on bookings, payments, documents, coverage, and support."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "FAQ" },
        ]}
        image="https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="mx-auto max-w-5xl px-4 py-20">
        <SectionHeader
          eyebrow="Search"
          title="Find answers fast"
          description="Search by topic and go straight to the answer you need."
          align="center"
        />
        <div className="mx-auto mt-8 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-gray-500)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-14 w-full rounded-full border border-[var(--color-gray-200)] bg-white pl-11 pr-4 shadow-[0_16px_60px_rgba(10,22,40,0.06)] outline-none focus:border-[var(--color-accent)]"
              placeholder="Search booking, payment, coverage, support..."
            />
          </div>
        </div>

        <div className="mt-10 space-y-8">
          {(Object.entries(grouped) as Array<[string, typeof faqs]>).map(
            ([category, items]) => (
            <div
              key={category}
              className="rounded-[34px] border border-[var(--color-gray-200)] bg-white p-8 shadow-[0_20px_70px_rgba(10,22,40,0.08)]"
            >
              <div className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">
                {category}
              </div>
              <div className="mt-6 space-y-4">
                {items.map((item) => (
                  <details key={item.question} className="group rounded-[26px] bg-[var(--color-gray-100)] p-5">
                    <summary className="cursor-pointer list-none font-semibold text-[var(--color-primary)]">
                      {item.question}
                    </summary>
                    <p className="mt-4 text-sm leading-7 text-[var(--color-gray-600)]">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
