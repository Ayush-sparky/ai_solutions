"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// An uploaded image path (/api/uploads/…) or an external URL (legacy/seed data).
const IMAGE_RE = /^(?:\/api\/uploads\/\S+|https?:\/\/\S+)$/i;

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
}

function readItem(formData) {
  return {
    title: (formData.get("title") || "").toString().trim(),
    imageUrl: (formData.get("imageUrl") || "").toString().trim(),
    caption: (formData.get("caption") || "").toString().trim(),
  };
}

function validateItem(v) {
  const errors = {};
  if (!v.title) errors.title = "Title is required.";
  if (!v.imageUrl) errors.imageUrl = "An image is required.";
  else if (!IMAGE_RE.test(v.imageUrl))
    errors.imageUrl = "Please upload a valid image.";
  return errors;
}

function dataFrom(values) {
  return {
    title: values.title,
    imageUrl: values.imageUrl,
    caption: values.caption || null,
  };
}

function revalidateGallery() {
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function createGalleryItem(prevState, formData) {
  await requireAdmin();
  const values = readItem(formData);
  const errors = validateItem(values);
  if (Object.keys(errors).length > 0) return { errors, values };

  try {
    await prisma.galleryItem.create({ data: dataFrom(values) });
  } catch (error) {
    console.error("createGalleryItem failed:", error);
    return { errors: { form: "Something went wrong. Please try again." }, values };
  }

  revalidateGallery();
  redirect("/admin/gallery");
}

export async function updateGalleryItem(prevState, formData) {
  await requireAdmin();
  const id = (formData.get("id") || "").toString();
  const values = readItem(formData);
  const errors = validateItem(values);
  if (!id) errors.form = "Missing item id.";
  if (Object.keys(errors).length > 0) return { errors, values };

  try {
    await prisma.galleryItem.update({ where: { id }, data: dataFrom(values) });
  } catch (error) {
    console.error("updateGalleryItem failed:", error);
    return { errors: { form: "Something went wrong. Please try again." }, values };
  }

  revalidateGallery();
  redirect("/admin/gallery");
}

export async function deleteGalleryItem(formData) {
  await requireAdmin();
  const id = (formData.get("id") || "").toString();
  if (!id) return;
  try {
    await prisma.galleryItem.delete({ where: { id } });
  } catch (error) {
    console.error("deleteGalleryItem failed:", error);
    return;
  }
  revalidateGallery();
}
