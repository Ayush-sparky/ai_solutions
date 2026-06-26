"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
}

// datetime-local gives "YYYY-MM-DDTHH:mm". We interpret it as UTC so it matches
// how the public events page displays times.
function parseEventDate(raw) {
  if (!raw) return null;
  const date = new Date(`${raw.slice(0, 16)}:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function readEvent(formData) {
  return {
    title: (formData.get("title") || "").toString().trim(),
    slug: (formData.get("slug") || "").toString().trim().toLowerCase(),
    description: (formData.get("description") || "").toString().trim(),
    location: (formData.get("location") || "").toString().trim(),
    eventDate: (formData.get("eventDate") || "").toString().trim(),
  };
}

function validateEvent(v) {
  const errors = {};
  if (!v.title) errors.title = "Title is required.";
  if (!v.slug) errors.slug = "Slug is required.";
  else if (!SLUG_RE.test(v.slug))
    errors.slug = "Use lowercase letters, numbers, and hyphens only.";
  if (!v.description) errors.description = "Description is required.";
  if (!v.location) errors.location = "Location is required.";
  if (!v.eventDate) errors.eventDate = "Date and time are required.";
  else if (!parseEventDate(v.eventDate))
    errors.eventDate = "Enter a valid date and time.";
  return errors;
}

function dataFrom(values) {
  return {
    title: values.title,
    slug: values.slug,
    description: values.description,
    location: values.location,
    eventDate: parseEventDate(values.eventDate),
  };
}

function revalidateEvents(slug) {
  revalidatePath("/admin/events");
  revalidatePath("/events");
  if (slug) revalidatePath(`/events/${slug}`);
}

export async function createEvent(prevState, formData) {
  await requireAdmin();
  const values = readEvent(formData);
  const errors = validateEvent(values);
  if (Object.keys(errors).length > 0) return { errors, values };

  try {
    await prisma.event.create({ data: dataFrom(values) });
  } catch (error) {
    if (error.code === "P2002")
      return { errors: { slug: "That slug is already in use." }, values };
    console.error("createEvent failed:", error);
    return { errors: { form: "Something went wrong. Please try again." }, values };
  }

  revalidateEvents(values.slug);
  redirect("/admin/events");
}

export async function updateEvent(prevState, formData) {
  await requireAdmin();
  const id = (formData.get("id") || "").toString();
  const values = readEvent(formData);
  const errors = validateEvent(values);
  if (!id) errors.form = "Missing event id.";
  if (Object.keys(errors).length > 0) return { errors, values };

  try {
    await prisma.event.update({ where: { id }, data: dataFrom(values) });
  } catch (error) {
    if (error.code === "P2002")
      return { errors: { slug: "That slug is already in use." }, values };
    console.error("updateEvent failed:", error);
    return { errors: { form: "Something went wrong. Please try again." }, values };
  }

  revalidateEvents(values.slug);
  redirect("/admin/events");
}

export async function deleteEvent(formData) {
  await requireAdmin();
  const id = (formData.get("id") || "").toString();
  if (!id) return;
  try {
    // Registrations cascade-delete via the schema's onDelete: Cascade relation.
    await prisma.event.delete({ where: { id } });
  } catch (error) {
    console.error("deleteEvent failed:", error);
    return;
  }
  revalidateEvents();
}
