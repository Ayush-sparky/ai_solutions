import Link from "next/link";
import { createArticle } from "../actions";
import ArticleForm from "../ArticleForm";

export const metadata = { title: "New article" };

export default function NewArticlePage() {
  return (
    <div className="p-6 sm:p-8">
      <Link href="/admin/articles" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
        &larr; Articles
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">New article</h1>

      <div className="mt-6 max-w-2xl">
        <ArticleForm action={createArticle} submitLabel="Create article" />
      </div>
    </div>
  );
}
