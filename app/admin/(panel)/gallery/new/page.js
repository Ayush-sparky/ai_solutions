import Link from "next/link";
import { createGalleryItem } from "../actions";
import GalleryForm from "../GalleryForm";

export const metadata = { title: "New gallery item" };

export default function NewGalleryItemPage() {
  return (
    <div className="p-6 sm:p-8">
      <Link href="/admin/gallery" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
        &larr; Gallery
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">New gallery item</h1>

      <div className="mt-6 max-w-2xl">
        <GalleryForm action={createGalleryItem} submitLabel="Add item" />
      </div>
    </div>
  );
}
