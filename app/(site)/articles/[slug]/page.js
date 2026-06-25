import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate, excerpt } from "@/lib/format";

export const dynamic = "force-dynamic";

// Wrapped in cache() so generateMetadata and the page share one query per request.
const getArticle = cache(async (slug) => {
  try {
    // findFirst (not findUnique) so we can also require published: true,
    // keeping drafts unreachable on the public site.
    return await prisma.article.findFirst({
      where: { slug, published: true },
    });
  } catch (error) {
    console.error(`Failed to load article "${slug}":`, error);
    return null;
  }
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Article not found" };
  return {
    title: article.title,
    description: excerpt(article.content, 155),
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) notFound();

  const paragraphs = article.content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article>
      <header className="bg-slate-900 text-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <Link
            href="/articles"
            className="inline-flex items-center gap-1 text-sm font-medium text-indigo-300 hover:text-indigo-200"
          >
            <span aria-hidden="true">&larr;</span> All articles
          </Link>
          <time className="mt-8 block text-sm text-slate-400">
            {formatDate(article.createdAt)}
          </time>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>
        </div>
      </header>

      {article.coverImageUrl ? (
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="-mt-10 aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100 shadow-lg ring-1 ring-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImageUrl}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {paragraphs.map((paragraph, i) => (
          <p
            key={i}
            className="mt-6 text-lg leading-8 text-slate-700 first:mt-0"
          >
            {paragraph}
          </p>
        ))}

        <div className="mt-12 border-t border-slate-100 pt-8">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
          >
            Talk to us about your project
          </Link>
        </div>
      </div>
    </article>
  );
}
