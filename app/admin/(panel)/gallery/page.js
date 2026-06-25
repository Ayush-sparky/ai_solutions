import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteGalleryItem } from "./actions";

export const metadata = { title: "Gallery" };

async function getItems() {
  try {
    return await prisma.galleryItem.findMany({ orderBy: { createdAt: "desc" } });
  } catch (error) {
    console.error("Failed to load gallery items:", error);
    return [];
  }
}

export default async function AdminGalleryPage() {
  const items = await getItems();

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gallery</h1>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-600">
            {items.length}
          </span>
        </div>
        <Link
          href="/admin/gallery/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          <span aria-hidden="true">+</span> New item
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          No gallery items yet. Add your first one.
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="aspect-[4/3] bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="font-medium text-slate-900">{item.title}</h2>
                {item.caption ? (
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">{item.caption}</p>
                ) : null}
                <div className="mt-3 flex items-center justify-end gap-1 border-t border-slate-100 pt-3">
                  <Link
                    href={`/admin/gallery/${item.id}/edit`}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                  >
                    Edit
                  </Link>
                  <ConfirmDeleteButton action={deleteGalleryItem} id={item.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
