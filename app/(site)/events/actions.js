"use server";

import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(formData, name) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

// Server action used with useActionState on the public event detail page:
// (prevState, formData) => newState. Records a viewer's sign-up for an
// upcoming event and pings the admin dashboard in real time.
export async function submitEventRegistration(prevState, formData) {
  const eventId = field(formData, "eventId");
  const values = {
    name: field(formData, "name"),
    // Normalise to lowercase so duplicate detection is case-insensitive and
    // matches the @@unique([eventId, email]) constraint on EventRegistration.
    email: field(formData, "email").toLowerCase(),
    phone: field(formData, "phone"),
    company: field(formData, "company"),
    message: field(formData, "message"),
  };

  const errors = {};

  if (!values.name) errors.name = "Please enter your name.";
  else if (values.name.length < 2) errors.name = "Please enter your full name.";
  else if (values.name.length > 100) errors.name = "That name is too long.";

  if (!values.email) errors.email = "Please enter your email.";
  else if (!EMAIL_RE.test(values.email))
    errors.email = "Please enter a valid email address.";

  if (values.phone) {
    const phoneDigits = values.phone.replace(/\D/g, "");
    if (phoneDigits.length < 7)
      errors.phone = "Please enter a valid phone number.";
  }

  if (values.company && values.company.length > 120)
    errors.company = "That company name is too long.";

  if (values.message && values.message.length > 1000)
    errors.message = "Please keep your note under 1000 characters.";

  if (Object.keys(errors).length > 0) {
    return { success: false, errors, values };
  }

  // The event must exist and still be upcoming — registrations close once it's
  // over. This guards against stale forms and direct POSTs to ended events.
  let event;
  try {
    event = eventId
      ? await prisma.event.findUnique({ where: { id: eventId } })
      : null;
  } catch (error) {
    console.error("Failed to look up event for registration:", error);
    event = null;
  }

  if (!event) {
    return {
      success: false,
      errors: {},
      values,
      message: "Sorry, we couldn't find that event. It may have been removed.",
    };
  }

  if (new Date(event.eventDate).getTime() < Date.now()) {
    return {
      success: false,
      errors: {},
      values,
      message: "Registration for this event has closed — it has already taken place.",
    };
  }

  // Friendly fast-path: reject a repeat sign-up for this event with the same
  // email before hitting the insert. The @@unique constraint (handled via P2002
  // below) is the authoritative guard against the race between this check and
  // the create. If the lookup itself fails, fall through and let the DB decide.
  try {
    const existing = await prisma.eventRegistration.findFirst({
      where: { eventId: event.id, email: values.email },
      select: { id: true },
    });
    if (existing) {
      return {
        success: false,
        errors: { email: "This email is already registered for this event." },
        values,
      };
    }
  } catch (error) {
    console.error("Failed to check for an existing registration:", error);
  }

  try {
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId: event.id,
        name: values.name,
        email: values.email,
        phone: values.phone || null,
        company: values.company || null,
        message: values.message || null,
      },
    });
    // Fire-and-forget live notification for the admin dashboard. createNotification
    // swallows its own errors, so this never affects the visitor's submission.
    await createNotification({
      type: "EVENT_REGISTRATION",
      title: "New event registration",
      body: `${values.name} registered for ${event.title}`,
      entityId: registration.id,
    });
  } catch (error) {
    // Unique-constraint violation: someone registered this email for this event
    // between our pre-check and the insert (or the pre-check failed). Same
    // friendly message as the fast path.
    if (error.code === "P2002") {
      return {
        success: false,
        errors: { email: "This email is already registered for this event." },
        values,
      };
    }
    console.error("Failed to save event registration:", error);
    return {
      success: false,
      errors: {},
      values,
      message: "Sorry, something went wrong saving your registration. Please try again.",
    };
  }

  return { success: true, errors: {} };
}
