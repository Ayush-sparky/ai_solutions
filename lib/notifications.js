// Server-side helpers for the admin notification system. The Notification table
// is the durable source of truth for unread badge counts; lib/events provides
// the live push on top of it.
import { prisma } from "@/lib/prisma";
import { publishNotification } from "@/lib/events";

// How many recent notifications the bell dropdown shows / the snapshot returns.
export const NOTIFICATION_FEED_LIMIT = 30;

// Convert a Prisma Notification row into a plain, JSON-safe object suitable for
// crossing to client components and SSE payloads (Dates -> ISO strings).
function serialize(n) {
  return {
    id: n.id,
    type: n.type,
    title: n.title,
    body: n.body,
    entityId: n.entityId,
    readAt: n.readAt ? n.readAt.toISOString() : null,
    createdAt: n.createdAt.toISOString(),
  };
}

// Persist a notification and immediately push it to any connected admin streams.
// Never throws to its caller: a notification failure must not break the public
// form submission that triggered it.
export async function createNotification({ type, title, body, entityId }) {
  try {
    const row = await prisma.notification.create({
      data: { type, title, body, entityId },
    });
    publishNotification(serialize(row));
    return row;
  } catch (error) {
    console.error("Failed to create notification:", error);
    return null;
  }
}

// Current feed + unread counts. Used for the server-rendered initial state and
// for client reconciliation on (re)connect.
export async function getNotificationSnapshot() {
  try {
    const [items, inquiry, review, eventRegistration] = await Promise.all([
      prisma.notification.findMany({
        orderBy: { createdAt: "desc" },
        take: NOTIFICATION_FEED_LIMIT,
      }),
      prisma.notification.count({ where: { type: "INQUIRY", readAt: null } }),
      prisma.notification.count({ where: { type: "REVIEW", readAt: null } }),
      prisma.notification.count({
        where: { type: "EVENT_REGISTRATION", readAt: null },
      }),
    ]);
    return {
      items: items.map(serialize),
      counts: {
        inquiry,
        review,
        eventRegistration,
        total: inquiry + review + eventRegistration,
      },
    };
  } catch (error) {
    console.error("Failed to load notifications:", error);
    return {
      items: [],
      counts: { inquiry: 0, review: 0, eventRegistration: 0, total: 0 },
    };
  }
}

// Mark notifications read. Accepts one of: { all: true }, { id }, { ids: [] },
// or { type }. Only flips rows that are still unread. Returns a fresh snapshot.
export async function markNotificationsRead(selector = {}) {
  const where = { readAt: null };
  if (selector.id) where.id = selector.id;
  else if (Array.isArray(selector.ids) && selector.ids.length > 0)
    where.id = { in: selector.ids };
  else if (selector.type) where.type = selector.type;
  else if (!selector.all) return getNotificationSnapshot(); // no-op selector

  try {
    await prisma.notification.updateMany({ where, data: { readAt: new Date() } });
  } catch (error) {
    console.error("Failed to mark notifications read:", error);
  }
  return getNotificationSnapshot();
}
