import { Link, Navigate, useParams } from "react-router-dom";
import { PageHero } from "@/components/shared/PageHero";
import { blogPosts } from "@/data/mock";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="bg-[var(--color-gray-100)] pb-20">
      <PageHero
        eyebrow={post.category}
        title={post.title}
        description={post.excerpt}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
        image={post.image}
      />

      <article className="mx-auto max-w-4xl px-4 py-20">
        <div className="rounded-[34px] border border-[var(--color-gray-200)] bg-white p-8 shadow-[0_20px_70px_rgba(10,22,40,0.08)] md:p-12">
          <div className="mb-6 text-xs uppercase tracking-[0.26em] text-[var(--color-gray-500)]">
            {post.publishedAt} | {post.readTime}
          </div>
          <div className="space-y-6 text-base leading-8 text-[var(--color-gray-600)]">
            {post.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-10">
            <Link to="/blog" className="text-sm font-semibold text-[var(--color-accent)]">
              Back to all articles
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}

