"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function deleteFutureInterest(formData) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const id = (formData.get("id") || "").toString();
  if (!id) return;

  try {
    await prisma.futureInterest.delete({ where: { id } });
  } catch (error) {
    console.error("deleteFutureInterest failed:", error);
    return;
  }

  revalidatePath("/admin/future-interest");
}
