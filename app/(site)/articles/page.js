import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PageHero from "@/components/PageHero";
import { formatDate, excerpt } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Articles",
  description:
    "Insights, case studies, and guides on AI strategy, automation, and custom AI from the AI-Solutions team.",
};

async function getPublishedArticles() {
  try {
    return await prisma.article.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to load articles:", error);
    return [];
  }
}

export default async function ArticlesPage() {
  const articles = await getPublishedArticles();

  return (
    <>
      <PageHero
        eyebrow="Articles"
        title="Insights from the AI-Solutions team"
        subtitle="Case studies, practical guides, and our take on making AI work in the real world."
      />

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {articles.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-lg"
                >
                  {article.coverImageUrl ? (
                    <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                      {/* Arbitrary admin-provided URLs -> plain img (no next/image domain config). */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={article.coverImageUrl}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-gradient-to-br from-indigo-500 to-violet-600" />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <time className="text-xs font-medium text-slate-500">
                      {formatDate(article.createdAt)}
                    </time>
                    <h2 className="mt-2 text-lg font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
                      {article.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                      {excerpt(article.content)}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">
                      Read more
                      <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500">
              No articles have been published yet. Check back soon.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
