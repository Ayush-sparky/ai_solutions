import { prisma } from "@/lib/prisma";
import PageHero from "@/components/PageHero";
import GalleryGrid from "./GalleryGrid";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gallery",
  description:
    "A look inside AI-Solutions — our team, events, and the work we do.",
};

async function getGalleryItems() {
  try {
    return await prisma.galleryItem.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to load gallery items:", error);
    return [];
  }
}

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="A look inside AI-Solutions"
        subtitle="Our team, our events, and the work we&rsquo;re proud of."
      />

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {items.length > 0 ? (
            <GalleryGrid items={items} />
          ) : (
            <p className="text-center text-slate-500">
              The gallery is empty for now. Check back soon.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
