"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function deleteRegistration(formData) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const id = (formData.get("id") || "").toString();
  if (!id) return;

  try {
    await prisma.eventRegistration.delete({ where: { id } });
    // Drop any notification that pointed at this now-deleted registration.
    await prisma.notification.deleteMany({
      where: { type: "EVENT_REGISTRATION", entityId: id },
    });
  } catch (error) {
    console.error("deleteRegistration failed:", error);
    return;
  }

  revalidatePath("/admin/events/registrations");
  revalidatePath("/admin/events");
  revalidatePath("/admin");
}
