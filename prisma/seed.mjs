// Prisma seed script for AI-Solutions.
//
// Run with:  npm run seed   (or)   npx prisma db seed
//
// Prisma 7 needs a driver adapter at runtime, so this connects through the
// pg adapter using the pooled DATABASE_URL (same as lib/prisma.js). It is
// idempotent: it clears the seeded tables and recreates the sample rows, and
// upserts the admin account by its unique email.
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

// Dev-only admin credentials. Override the password with SEED_ADMIN_PASSWORD.
// CHANGE THIS before using anywhere real.
const ADMIN_EMAIL = "admin";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "admin0188";

async function main() {
  console.log("Clearing existing seed data...");
  // No relations between these models, so delete order is unimportant.
  await prisma.review.deleteMany();
  await prisma.article.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.event.deleteMany();
  await prisma.inquiry.deleteMany();

  console.log("Seeding articles...");
  await prisma.article.createMany({
    data: [
      {
        title: "How AI-Solutions Cut a Client's Support Costs by 40%",
        slug: "support-cost-reduction-case-study",
        content:
          "When a mid-sized retailer came to us drowning in repetitive support tickets, we deployed an AI triage layer that auto-resolved the most common requests. Within one quarter, first-response times dropped and support costs fell by 40%. Here's how we did it.",
        coverImageUrl: "https://cdn.ai-solutions.test/blog/support-costs.jpg",
        published: true,
      },
      {
        title: "5 Signs Your Business Is Ready for Automation",
        slug: "5-signs-ready-for-automation",
        content:
          "Not every workflow needs AI, but some are crying out for it. If your team copies data between systems, answers the same questions daily, or struggles to scale a manual process, these are strong signals it's time to automate. We break down the five clearest indicators.",
        coverImageUrl: "https://cdn.ai-solutions.test/blog/automation-signs.jpg",
        published: true,
      },
      {
        title: "Behind the Scenes: Building Our Recommendation Engine",
        slug: "building-our-recommendation-engine",
        content:
          "A deep-dive draft on the architecture behind the AI-Solutions recommendation engine: the data pipeline, the model we chose, and the trade-offs we made for latency. (Work in progress.)",
        coverImageUrl: null,
        published: false, // draft
      },
    ],
  });

  console.log("Seeding gallery items...");
  await prisma.galleryItem.createMany({
    data: [
      {
        title: "The Engineering Team",
        imageUrl: "https://cdn.ai-solutions.test/gallery/team.jpg",
        caption: "The AI-Solutions engineering team at our HQ.",
      },
      {
        title: "Product Demo Day",
        imageUrl: "https://cdn.ai-solutions.test/gallery/demo-day.jpg",
        caption: null,
      },
      {
        title: "Customer Onboarding Session",
        imageUrl: "https://cdn.ai-solutions.test/gallery/onboarding.jpg",
        caption: "Helping a new client go live with their first automation.",
      },
      {
        title: "Inside the Office",
        imageUrl: "https://cdn.ai-solutions.test/gallery/office.jpg",
        caption: null,
      },
      {
        title: "Internal Hackathon 2026",
        imageUrl: "https://cdn.ai-solutions.test/gallery/hackathon.jpg",
        caption: "Building prototypes in 24 hours.",
      },
      {
        title: "Conference Booth",
        imageUrl: "https://cdn.ai-solutions.test/gallery/booth.jpg",
        caption: "Meeting customers at TechExpo.",
      },
    ],
  });

  console.log("Seeding upcoming events...");
  await prisma.event.createMany({
    data: [
      {
        title: "AI in Practice: Live Webinar",
        description:
          "A 60-minute walkthrough of real AI-Solutions deployments, with live Q&A. Ideal for ops and product leaders evaluating automation.",
        location: "Online",
        eventDate: new Date("2026-07-15T10:00:00.000Z"),
      },
      {
        title: "AI-Solutions at TechExpo 2026",
        description:
          "Visit our booth to see live demos of our support-triage and recommendation products, and meet the team.",
        location: "Bengaluru, India",
        eventDate: new Date("2026-08-20T09:00:00.000Z"),
      },
      {
        title: "Automation Workshop for SMEs",
        description:
          "A hands-on workshop helping small and medium businesses identify and scope their first automation project.",
        location: "Online",
        eventDate: new Date("2026-09-10T14:00:00.000Z"),
      },
    ],
  });

  console.log("Seeding reviews (mix of PENDING and APPROVED)...");
  await prisma.review.createMany({
    data: [
      {
        authorName: "Anita Desai",
        email: "anita.desai@retailco.example",
        rating: 5,
        content:
          "AI-Solutions transformed our support workflow. Tickets that used to take hours are now resolved in minutes.",
        status: "APPROVED",
      },
      {
        authorName: "Marco Rossi",
        email: "marco.rossi@logifast.example",
        rating: 4,
        content:
          "Great results and a smooth onboarding. Would have liked a few more out-of-the-box integrations, but very happy overall.",
        status: "APPROVED",
      },
      {
        authorName: "Sofia Lindgren",
        email: "sofia.lindgren@fintechx.example",
        rating: 5,
        content:
          "Really impressed with the demo. We're evaluating a rollout across two teams next quarter.",
        status: "PENDING",
      },
      {
        authorName: "David Kim",
        email: "david.kim@healthplus.example",
        rating: 3,
        content:
          "Solid product and responsive team. Holding off on a higher rating until the reporting features mature.",
        status: "PENDING",
      },
    ],
  });

  console.log("Seeding inquiries...");
  await prisma.inquiry.createMany({
    data: [
      {
        name: "Priya Nair",
        email: "priya.nair@acmecorp.example",
        phone: "+91 98765 43210",
        company: "Acme Corp",
        country: "India",
        jobTitle: "Operations Manager",
        jobDetails:
          "We'd like to automate our customer support triage and reduce manual ticket routing across a 30-person team.",
      },
      {
        name: "James Carter",
        email: "j.carter@globex.example",
        phone: "+1 415 555 0199",
        company: "Globex",
        country: "United States",
        jobTitle: "CTO",
        jobDetails:
          "Interested in a recommendation engine for our e-commerce platform. Looking to discuss scope and a pilot timeline.",
      },
    ],
  });

  console.log("Upserting admin account...");
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.admin.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash },
    create: { email: ADMIN_EMAIL, passwordHash },
  });

  // Self-check: confirm the stored hash verifies against the plaintext password.
  const admin = await prisma.admin.findUnique({ where: { email: ADMIN_EMAIL } });
  const passwordOk = await bcrypt.compare(ADMIN_PASSWORD, admin.passwordHash);

  const [articles, gallery, events, reviews, inquiries, admins] = await Promise.all([
    prisma.article.count(),
    prisma.galleryItem.count(),
    prisma.event.count(),
    prisma.review.count(),
    prisma.inquiry.count(),
    prisma.admin.count(),
  ]);

  console.log("\nSeed complete:");
  console.table({ articles, gallery, events, reviews, inquiries, admins });
  console.log(`Admin login: ${ADMIN_EMAIL}  (password verifies against hash: ${passwordOk})`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
