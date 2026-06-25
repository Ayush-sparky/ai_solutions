import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateGalleryItem } from "../../actions";
import GalleryForm from "../../GalleryForm";

export const metadata = { title: "Edit gallery item" };

export default async function EditGalleryItemPage({ params }) {
  const { id } = await params;
  const item = await prisma.galleryItem.findUnique({ where: { id } });
  if (!item) notFound();

  const initial = {
    id: item.id,
    title: item.title,
    imageUrl: item.imageUrl,
    caption: item.caption ?? "",
  };

  return (
    <div className="p-6 sm:p-8">
      <Link href="/admin/gallery" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
        &larr; Gallery
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Edit gallery item</h1>

      <div className="mt-6 max-w-2xl">
        <GalleryForm action={updateGalleryItem} initial={initial} submitLabel="Save changes" />
      </div>
    </div>
  );
}
