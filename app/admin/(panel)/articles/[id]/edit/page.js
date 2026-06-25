import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateArticle } from "../../actions";
import ArticleForm from "../../ArticleForm";

export const metadata = { title: "Edit article" };

export default async function EditArticlePage({ params }) {
  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) notFound();

  const initial = {
    id: article.id,
    title: article.title,
    slug: article.slug,
    content: article.content,
    coverImageUrl: article.coverImageUrl ?? "",
    published: article.published,
  };

  return (
    <div className="p-6 sm:p-8">
      <Link href="/admin/articles" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
        &larr; Articles
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Edit article</h1>

      <div className="mt-6 max-w-2xl">
        <ArticleForm action={updateArticle} initial={initial} submitLabel="Save changes" />
      </div>
    </div>
  );
}
