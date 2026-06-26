-- Add the new notification kind for viewer event sign-ups.
-- (Safe inside a transaction on PostgreSQL 12+/Neon: the value is only *used*
--  at runtime, never within this migration.)
ALTER TYPE "NotificationType" ADD VALUE 'EVENT_REGISTRATION';

-- AlterTable: give every Event a unique slug for its public detail URL.
-- Add nullable, backfill existing rows from their id (guaranteed unique), then
-- enforce NOT NULL + uniqueness.
ALTER TABLE "Event" ADD COLUMN "slug" TEXT;
UPDATE "Event" SET "slug" = "id" WHERE "slug" IS NULL;
ALTER TABLE "Event" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateTable
CREATE TABLE "EventRegistration" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventRegistration_eventId_createdAt_idx" ON "EventRegistration"("eventId", "createdAt");

-- CreateIndex
CREATE INDEX "EventRegistration_createdAt_idx" ON "EventRegistration"("createdAt");

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
