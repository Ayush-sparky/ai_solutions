import { readFile } from "node:fs/promises";
import path from "node:path";

// Serves uploaded images from public/uploads/ through the app. We go through a
// route handler (instead of relying on static file serving) because Next.js
// does NOT serve files added to public/ at runtime in a production build — only
// files present at build time. Reading from disk here works in dev and prod.
//
// These images are public site content (gallery, article covers), so no auth.

const CONTENT_TYPES = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

// Only a plain filename — no slashes, no traversal.
const SAFE_NAME = /^[a-zA-Z0-9._-]+$/;

export async function GET(request, { params }) {
  const { name } = await params;

  if (!name || !SAFE_NAME.test(name) || name.includes("..")) {
    return new Response("Not found", { status: 404 });
  }

  const ext = name.split(".").pop()?.toLowerCase();
  const contentType = CONTENT_TYPES[ext];
  if (!contentType) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const filePath = path.join(process.cwd(), "public", "uploads", name);
    const data = await readFile(filePath);
    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
