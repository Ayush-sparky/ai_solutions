import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { getParam, parsePage, paginate, PAGE_SIZE } from "@/lib/pagination";
import AdminSearch from "@/components/admin/AdminSearch";
import FilterChips from "@/components/admin/FilterChips";
import Pagination from "@/components/admin/Pagination";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteArticle, toggleArticlePublished } from "./actions";

export const metadata = { title: "Articles" };

// Case-insensitive search across the title and slug.
function searchWhere(q) {
  if (!q) return {};
  const contains = { contains: q, mode: "insensitive" };
  return { OR: [{ title: contains }, { slug: contains }] };
}

export default async function AdminArticlesPage({ searchParams }) {
  const sp = await searchParams;
  const q = getParam(sp?.q);
  const requested = getParam(sp?.status).toLowerCase();
  const filter = ["published", "draft"].includes(requested) ? requested : "all";

  const base = searchWhere(q);
  const statusWhere =
    filter === "published"
      ? { published: true }
      : filter === "draft"
        ? { published: false }
        : {};
  const where = { AND: [base, statusWhere] };

  let articles = [];
  let total = 0;
  let counts = { all: 0, published: 0, draft: 0 };
  let pageInfo = paginate(1, 0, PAGE_SIZE);

  try {
    const [all, published] = await Promise.all([
      prisma.article.count({ where: base }),
      prisma.article.count({ where: { AND: [base, { published: true }] } }),
    ]);
    counts = { all, published, draft: all - published };
    total = counts[filter] ?? all;

    pageInfo = paginate(parsePage(sp?.page), total, PAGE_SIZE);
    articles = await prisma.article.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: pageInfo.skip,
      take: pageInfo.take,
    });
  } catch (error) {
    console.error("Failed to load articles:", error);
  }

  const filterOptions = [
    { label: "All", value: "all", count: counts.all },
    { label: "Published", value: "published", count: counts.published },
    { label: "Draft", value: "draft", count: counts.draft },
  ];

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Articles</h1>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-600">
            {counts.all}
          </span>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          <span aria-hidden="true">+</span> New article
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <FilterChips
          basePath="/admin/articles"
          paramKey="status"
          active={filter}
          defaultValue="all"
          options={filterOptions}
          params={{ q }}
        />
        <AdminSearch placeholder="Search title or slug…" />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {articles.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            {q ? `No articles match “${q}”.` : "No articles in this view."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Title</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                  <th scope="col" className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Updated</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-50/75">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{article.title}</div>
                      <div className="text-xs text-slate-400">/{article.slug}</div>
                    </td>
                    <td className="px-4 py-3">
                      {article.published ? (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/20">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                      {formatDate(article.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <form action={toggleArticlePublished}>
                          <input type="hidden" name="id" value={article.id} />
                          <input type="hidden" name="published" value={article.published ? "false" : "true"} />
                          <button
                            type="submit"
                            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
                          >
                            {article.published ? "Unpublish" : "Publish"}
                          </button>
                        </form>
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                        >
                          Edit
                        </Link>
                        <ConfirmDeleteButton action={deleteArticle} id={article.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination
        basePath="/admin/articles"
        params={{ q, status: filter === "all" ? undefined : filter }}
        page={pageInfo.current}
        totalPages={pageInfo.totalPages}
        total={total}
        from={pageInfo.from}
        to={pageInfo.to}
        unit="article"
      />
    </div>
  );
}
