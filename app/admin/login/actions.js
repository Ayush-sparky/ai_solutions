"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

// A valid bcrypt hash, used for a constant-time dummy comparison when no admin
// matches — avoids leaking (via timing) whether an account exists.
const DUMMY_HASH = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

export async function login(prevState, formData) {
  const email = (formData.get("email") || "").toString().trim().toLowerCase();
  const password = (formData.get("password") || "").toString();

  const errors = {};
  if (!email) errors.email = "Enter your username.";
  if (!password) errors.password = "Enter your password.";

  if (Object.keys(errors).length > 0) {
    return { errors, values: { email } };
  }

  let admin = null;
  try {
    admin = await prisma.admin.findUnique({ where: { email } });
  } catch (error) {
    console.error("Login lookup failed:", error);
    return {
      errors: { form: "Something went wrong. Please try again." },
      values: { email },
    };
  }

  const passwordOk = admin
    ? await bcrypt.compare(password, admin.passwordHash)
    : await bcrypt.compare(password, DUMMY_HASH);

  // Same generic message whether the email is unknown or the password is wrong.
  if (!admin || !passwordOk) {
    return { errors: { form: "Invalid email or password." }, values: { email } };
  }

  await createSession(admin);
  redirect("/admin");
}
