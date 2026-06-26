"use server";

import { prisma } from "@/lib/prisma";
import { COUNTRIES } from "@/lib/countries";
import { createNotification } from "@/lib/notifications";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(formData, name) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

// Server action used with useActionState: (prevState, formData) => newState.
export async function submitInquiry(prevState, formData) {
  const values = {
    name: field(formData, "name"),
    email: field(formData, "email"),
    phone: field(formData, "phone"),
    company: field(formData, "company"),
    country: field(formData, "country"),
    jobTitle: field(formData, "jobTitle"),
    jobDetails: field(formData, "jobDetails"),
  };

  const errors = {};

  if (!values.name) errors.name = "Please enter your name.";
  else if (values.name.length < 2) errors.name = "Please enter your full name.";
  else if (values.name.length > 100) errors.name = "That name is too long.";
  else if (/\d/.test(values.name))
    errors.name = "Names can't contain numbers.";
  else if (!/\p{L}/u.test(values.name))
    errors.name = "Please enter a valid name.";

  if (!values.email) errors.email = "Please enter your email.";
  else if (!EMAIL_RE.test(values.email))
    errors.email = "Please enter a valid email address.";

  const phoneDigits = values.phone.replace(/\D/g, "");
  if (!values.phone) errors.phone = "Please enter your phone number.";
  else if (phoneDigits.length < 7)
    errors.phone = "Please enter a valid phone number.";

  if (!values.company) errors.company = "Please enter your company.";

  if (!values.country) errors.country = "Please select your country.";
  else if (!COUNTRIES.includes(values.country))
    errors.country = "Please select a country from the list.";

  if (!values.jobTitle) errors.jobTitle = "Please enter your job title.";

  if (!values.jobDetails) errors.jobDetails = "Please tell us about your project.";
  else if (values.jobDetails.length < 10)
    errors.jobDetails = "Please add a little more detail (at least 10 characters).";
  else if (values.jobDetails.length > 5000)
    errors.jobDetails = "Please keep this under 5000 characters.";

  if (Object.keys(errors).length > 0) {
    return { success: false, errors, values };
  }

  try {
    const inquiry = await prisma.inquiry.create({ data: values });
    // Fire-and-forget: notify the admin dashboard in real time. createNotification
    // swallows its own errors, so this never affects the visitor's submission.
    await createNotification({
      type: "INQUIRY",
      title: "New inquiry",
      body: `${values.name}${values.company ? ` · ${values.company}` : ""} — ${values.jobTitle}`,
      entityId: inquiry.id,
    });
  } catch (error) {
    console.error("Failed to save inquiry:", error);
    return {
      success: false,
      errors: {},
      values,
      message: "Sorry, something went wrong saving your message. Please try again.",
    };
  }

  return { success: true, errors: {} };
}
