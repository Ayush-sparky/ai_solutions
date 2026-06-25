import { prisma } from "@/lib/prisma";
import PageHero from "@/components/PageHero";

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
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100"
                >
                  {/* Arbitrary admin-provided URLs -> plain img (no next/image domain config). */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    {item.caption ? (
                      <p className="mt-0.5 line-clamp-2 text-xs text-slate-200">
                        {item.caption}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
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
