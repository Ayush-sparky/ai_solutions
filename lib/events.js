// In-process pub/sub bus used to push new admin notifications to connected
// Server-Sent Events streams the instant they're created.
//
// How it fits together: a public form submission (server action) creates a
// Notification row and calls `publishNotification(...)`. The SSE route handler
// (app/api/admin/notifications/stream) subscribes with `onNotification(...)`
// and forwards each payload to the browser, where it becomes a toast + badge
// update — no polling delay.
//
// SCOPE: this is a single-process, in-memory bus. It works for `next dev` and a
// single-instance `next start` (which is how this app runs). It does NOT span
// multiple server instances; the DB-backed unread counts (see lib/notifications)
// are the source of truth, and clients reconcile against them on every (re)connect,
// so a missed in-memory event never means a missed notification — only a missed
// toast. Swap this module for Redis pub/sub if the app is ever horizontally scaled.
import { EventEmitter } from "node:events";

const NOTIFICATION_EVENT = "notification";

// Reuse one emitter across hot-reloads (dev) and the whole process (prod) so
// server actions and the SSE route always share the same instance.
const globalForEvents = globalThis;
const bus =
  globalForEvents.__notificationBus ?? new EventEmitter();
// Many admin tabs can subscribe at once; lift the default 10-listener warning cap.
bus.setMaxListeners(0);
globalForEvents.__notificationBus = bus;

// Broadcast a (already serialized, plain-object) notification to every stream.
export function publishNotification(payload) {
  bus.emit(NOTIFICATION_EVENT, payload);
}

// Subscribe to new notifications. Returns an unsubscribe function.
export function onNotification(listener) {
  bus.on(NOTIFICATION_EVENT, listener);
  return () => bus.off(NOTIFICATION_EVENT, listener);
}
