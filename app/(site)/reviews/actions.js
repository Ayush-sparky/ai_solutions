"use server";

import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(formData, name) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

// Server action used with useActionState: (prevState, formData) => newState.
export async function submitReview(prevState, formData) {
  const values = {
    authorName: field(formData, "authorName"),
    email: field(formData, "email"),
    rating: field(formData, "rating"),
    content: field(formData, "content"),
  };

  const errors = {};

  if (!values.authorName) errors.authorName = "Please enter your name.";
  else if (values.authorName.length > 80)
    errors.authorName = "That name is too long.";

  if (!values.email) errors.email = "Please enter your email.";
  else if (!EMAIL_RE.test(values.email))
    errors.email = "Please enter a valid email address.";

  const rating = Number.parseInt(values.rating, 10);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    errors.rating = "Please select a rating from 1 to 5 stars.";

  if (!values.content) errors.content = "Please write a short review.";
  else if (values.content.length < 10)
    errors.content = "Please add a little more detail (at least 10 characters).";
  else if (values.content.length > 2000)
    errors.content = "Please keep your review under 2000 characters.";

  if (Object.keys(errors).length > 0) {
    return { success: false, errors, values };
  }

  try {
    const review = await prisma.review.create({
      data: {
        authorName: values.authorName,
        email: values.email,
        rating,
        content: values.content,
        // Explicit for clarity (this is also the schema default): new reviews
        // are held for moderation and stay hidden from the public site.
        status: "PENDING",
      },
    });
    // Real-time heads-up for the admin moderation queue. Self-contained error
    // handling inside createNotification keeps this off the visitor's path.
    await createNotification({
      type: "REVIEW",
      title: "New review awaiting moderation",
      body: `${values.authorName} left a ${rating}★ review`,
      entityId: review.id,
    });
  } catch (error) {
    console.error("Failed to save review:", error);
    return {
      success: false,
      errors: {},
      values,
      message: "Sorry, something went wrong submitting your review. Please try again.",
    };
  }

  return { success: true, errors: {} };
}
