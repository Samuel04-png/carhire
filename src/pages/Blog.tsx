import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { blogPosts } from "@/data/mock";

export default function BlogPage() {
  return (
    <div className="bg-[var(--color-gray-100)] pb-20">
      <PageHero
        eyebrow="Insights"
        title="Travel notes, booking advice, and fleet insights"
        description="Read practical guidance on airport transfers, corporate travel, event transport, and vehicle hire in Zambia."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Blog" },
        ]}
        image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeader
          eyebrow="Articles"
          title="Useful reading before you book"
          description="These articles cover the details that help travellers, coordinators, and company teams choose the right service."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="overflow-hidden rounded-[30px] border border-[var(--color-gray-200)] bg-white shadow-[0_18px_60px_rgba(10,22,40,0.08)]"
            >
              <img
                src={post.image}
                alt={post.title}
                className="h-56 w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-6">
                <div className="text-xs uppercase tracking-[0.26em] text-[var(--color-accent)]">
                  {post.category}
                </div>
                <h2 className="mt-4 font-display text-2xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
                  {post.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[var(--color-gray-600)]">
                  {post.excerpt}
                </p>
                <div className="mt-5 text-xs uppercase tracking-[0.22em] text-[var(--color-gray-500)]">
                  {post.readTime}
                </div>
                <Link
                  to={`/blog/${post.slug}`}
                  className="mt-6 inline-flex items-center text-sm font-semibold text-[var(--color-primary)]"
                >
                  Read Article
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
