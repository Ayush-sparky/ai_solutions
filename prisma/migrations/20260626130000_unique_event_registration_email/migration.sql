-- Prevent the same email from registering for the same event more than once.
--
-- Defensive de-duplication first: if any duplicate (eventId, email) rows already
-- exist (case-insensitively), keep the earliest sign-up and drop the rest, so
-- the unique index below can be created without error. On a fresh table this is
-- a no-op. The app normalises emails to lowercase before insert, so the index
-- is effectively case-insensitive going forward.
DELETE FROM "EventRegistration" a
USING "EventRegistration" b
WHERE a."eventId" = b."eventId"
  AND lower(a."email") = lower(b."email")
  AND (
    a."createdAt" > b."createdAt"
    OR (a."createdAt" = b."createdAt" AND a."id" > b."id")
  );

-- CreateIndex
CREATE UNIQUE INDEX "EventRegistration_eventId_email_key" ON "EventRegistration"("eventId", "email");
