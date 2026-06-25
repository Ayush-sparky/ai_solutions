import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteArticle, toggleArticlePublished } from "./actions";

export const metadata = { title: "Articles" };

async function getArticles() {
  try {
    return await prisma.article.findMany({ orderBy: { updatedAt: "desc" } });
  } catch (error) {
    console.error("Failed to load articles:", error);
    return [];
  }
}

export default async function AdminArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Articles</h1>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-600">
            {articles.length}
          </span>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          <span aria-hidden="true">+</span> New article
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {articles.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No articles yet. Create your first one.
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
    </div>
  );
}
