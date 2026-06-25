"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// An uploaded image path (/api/uploads/…) or an external URL (legacy/seed data).
const IMAGE_RE = /^(?:\/api\/uploads\/\S+|https?:\/\/\S+)$/i;

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
}

function readArticle(formData) {
  return {
    title: (formData.get("title") || "").toString().trim(),
    slug: (formData.get("slug") || "").toString().trim().toLowerCase(),
    content: (formData.get("content") || "").toString().trim(),
    coverImageUrl: (formData.get("coverImageUrl") || "").toString().trim(),
    published: formData.get("published") === "on",
  };
}

function validateArticle(v) {
  const errors = {};
  if (!v.title) errors.title = "Title is required.";
  if (!v.slug) errors.slug = "Slug is required.";
  else if (!SLUG_RE.test(v.slug))
    errors.slug = "Use lowercase letters, numbers, and hyphens only.";
  if (!v.content) errors.content = "Content is required.";
  if (v.coverImageUrl && !IMAGE_RE.test(v.coverImageUrl))
    errors.coverImageUrl = "Please upload a valid image.";
  return errors;
}

function dataFrom(values) {
  return {
    title: values.title,
    slug: values.slug,
    content: values.content,
    coverImageUrl: values.coverImageUrl || null,
    published: values.published,
  };
}

function revalidateArticles() {
  revalidatePath("/admin/articles");
  revalidatePath("/articles");
}

export async function createArticle(prevState, formData) {
  await requireAdmin();
  const values = readArticle(formData);
  const errors = validateArticle(values);
  if (Object.keys(errors).length > 0) return { errors, values };

  try {
    await prisma.article.create({ data: dataFrom(values) });
  } catch (error) {
    if (error.code === "P2002")
      return { errors: { slug: "That slug is already in use." }, values };
    console.error("createArticle failed:", error);
    return { errors: { form: "Something went wrong. Please try again." }, values };
  }

  revalidateArticles();
  redirect("/admin/articles");
}

export async function updateArticle(prevState, formData) {
  await requireAdmin();
  const id = (formData.get("id") || "").toString();
  const values = readArticle(formData);
  const errors = validateArticle(values);
  if (!id) errors.form = "Missing article id.";
  if (Object.keys(errors).length > 0) return { errors, values };

  try {
    await prisma.article.update({ where: { id }, data: dataFrom(values) });
  } catch (error) {
    if (error.code === "P2002")
      return { errors: { slug: "That slug is already in use." }, values };
    console.error("updateArticle failed:", error);
    return { errors: { form: "Something went wrong. Please try again." }, values };
  }

  revalidateArticles();
  redirect("/admin/articles");
}

export async function deleteArticle(formData) {
  await requireAdmin();
  const id = (formData.get("id") || "").toString();
  if (!id) return;
  try {
    await prisma.article.delete({ where: { id } });
  } catch (error) {
    console.error("deleteArticle failed:", error);
    return;
  }
  revalidateArticles();
}

export async function toggleArticlePublished(formData) {
  await requireAdmin();
  const id = (formData.get("id") || "").toString();
  const published = formData.get("published") === "true";
  if (!id) return;
  try {
    await prisma.article.update({ where: { id }, data: { published } });
  } catch (error) {
    console.error("toggleArticlePublished failed:", error);
    return;
  }
  revalidateArticles();
}
