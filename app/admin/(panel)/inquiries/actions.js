"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function deleteInquiry(formData) {
  // Server actions are POST endpoints — re-verify the admin session here.
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const id = (formData.get("id") || "").toString();
  if (!id) return;

  try {
    await prisma.inquiry.delete({ where: { id } });
    // Drop any notification that pointed at this now-deleted inquiry.
    await prisma.notification.deleteMany({ where: { type: "INQUIRY", entityId: id } });
  } catch (error) {
    console.error("deleteInquiry failed:", error);
    return;
  }

  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}
