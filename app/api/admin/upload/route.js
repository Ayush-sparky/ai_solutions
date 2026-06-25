import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getSession } from "@/lib/auth";

// Admin-only image upload. Saves the file under public/uploads/ and returns the
// path it's served at — "/api/uploads/<uuid>.jpg" — which the caller stores in
// the DB. (Serving goes through app/api/uploads/[name] rather than static public
// serving, which Next.js doesn't do for files written at runtime in production.)
//
// This is the ONLY place that touches local storage — to move to cloud storage
// (Vercel Blob, S3, Cloudinary) later, swap the write below for an SDK upload
// and return the resulting URL. Nothing else in the app needs to change.

const ALLOWED_EXT = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(request) {
  // Server actions and pages are guarded by middleware/layout, but this route
  // is not — enforce auth here.
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || typeof file === "string" || file.size === 0) {
    return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });
  }

  const ext = ALLOWED_EXT[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Unsupported file type. Use JPG, PNG, WebP, or GIF." },
      { status: 415 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image is too large. Maximum size is 5 MB." },
      { status: 413 }
    );
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    const filename = `${randomUUID()}.${ext}`;
    await writeFile(path.join(dir, filename), bytes);
    return NextResponse.json({ url: `/api/uploads/${filename}` });
  } catch (error) {
    console.error("Image upload failed:", error);
    return NextResponse.json(
      { error: "Could not save the image. Please try again." },
      { status: 500 }
    );
  }
}
