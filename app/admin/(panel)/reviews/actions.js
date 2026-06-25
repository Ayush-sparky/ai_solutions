"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const ALLOWED_STATUSES = new Set(["PENDING", "APPROVED", "REJECTED"]);

export async function setReviewStatus(formData) {
  // Server actions are POST endpoints — re-verify the admin session here.
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const id = formData.get("id")?.toString();
  const status = formData.get("status")?.toString();
  if (!id || !status || !ALLOWED_STATUSES.has(status)) return;

  try {
    await prisma.review.update({ where: { id }, data: { status } });
  } catch (error) {
    console.error("Failed to update review status:", error);
    return;
  }

  // Refresh every view that reflects review state.
  revalidatePath("/admin/reviews");
  revalidatePath("/admin");
  revalidatePath("/reviews");
  revalidatePath("/");
}
