# 05 — Real-time & Background Jobs

> Socket.io events (server + client), the single node-cron job, and what actually happens
> on disconnect/reconnect. All emitters/listeners traced to source.

---

## 1. Socket.io server setup

`backend/src/services/socketService.ts` is a **singleton** (`export default SocketService.getInstance()`,
line 164). Initialized once in `index.ts:26` with the shared HTTP server, so REST and WS share a
process and port.

- Namespaces: **only the default namespace `/`** is used. No custom namespaces.
- Rooms: each socket auto-joins `user:<userId>` on connect (`socketService.ts:67`), and admins
  additionally join `admin:<userId>` (`socketService.ts:71`). **The `admin:<id>` room is joined
  but never emitted to** anywhere — dead room.
- CORS origin list is hardcoded and duplicated from `index.ts` (see doc 04 §7).

Connection handler (`socketService.ts:60-77`):

```ts
this.io.on('connection', (socket) => {
  const userId = socket.data.userId;
  const role = socket.data.role;
  console.log(`Socket connected: User ${userId} (${role})`);
  socket.join(`user:${userId}`);
  if (role === 'admin') socket.join(`admin:${userId}`);
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: User ${userId}`);
  });
});
```

The disconnect handler **only logs**. No cleanup, no presence tracking, no state persistence.

---

## 2. Event catalogue

Event contracts are typed in `backend/src/types/socketTypes.ts:54-65`.

### Server → Client events

| Event | Payload | Emitted from | Target room | Client listener |
|-------|---------|--------------|-------------|-----------------|
| `task:assigned` | `ClientTask` (full task obj) | `socketService.emitTaskAssigned` (`:107`) ← `taskController.createTask` (`:116`) | `user:<employeeId>` | `SocketProvider.tsx:36` → toast + `refreshTrigger++` |
| `task:statusChanged` | `{ taskId, status }` | `emitTaskStatusChanged` (`:120`) ← accept/complete/fail (`taskController.ts:214,256,298`) | `user:<adminId>` **and** `user:<employeeId>` | `SocketProvider.tsx:41` → toast + refresh |
| `invitation:received` | `ClientInvitation` | `emitInvitationReceived` (`:137`) ← `sendInvitation` (`invitationController.ts:78,105`) | `user:<employeeId>` | `SocketProvider.tsx:46` → toast + refresh |
| `invitation:responded` | `{ invitationId, status }` | `emitInvitationResponded` (`:150`) ← `respondToInvitation` (`invitationController.ts:189`) | `user:<adminId>` | `SocketProvider.tsx:51` → toast + refresh |
| `notification:new` | `NotificationRow` | `createAndEmitNotification` (`:99`) — called by all of the above + comments | `user:<userId>` | `SocketProvider.tsx:57` (refresh) **and** `useNotifications.ts:61` (prepend + unread++) |
| `comment:new` | `CommentRow` | **inline** in `commentController.createComment` (`:59-60`) | `user:<created_by>` and `user:<assigned_to>` | ⚠️ **No global listener** — see §4 |

### Client → Server events

- Declared: `'join:room'(roomId)` (`socketTypes.ts:64`) and `ping` (InterServer, `:68`).
- **Neither is implemented on the server** — there is no `socket.on('join:room', …)` handler
  anywhere. The type exists but the feature does not. Rooms are joined automatically server-side
  only.

### The central notification helper (persist + emit)

`socketService.ts:89-103`:

```ts
public async createAndEmitNotification(userId, type, title, message, entityId?, entityType?): Promise<void> {
  try {
    const notification = await Notification.create(userId, type, title, message, entityId, entityType);
    this.getIO().to(`user:${userId}`).emit('notification:new', notification);
  } catch (error) {
    console.error('Failed to create/emit notification:', error);
  }
}
```

Good pattern: DB-persist first, then emit, wrapped in try/catch so a notification failure won't
crash the calling request. Note it is **fire-and-forget** from callers
(`emitTaskAssigned` etc. call it without `await`, e.g. `socketService.ts:110`), so a failed
persist is only logged and the HTTP request still returns success.

---

## 3. The single background job — overdue task cron

`backend/src/cron/taskCron.ts` (full file):

```ts
import cron from 'node-cron';
import pool from '../config/database';

export const startTaskCron = () => {
  // Run every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('Running cron job: Checking for overdue tasks...');
      const query = `
        UPDATE tasks
        SET is_overdue = true
        WHERE status NOT IN ('completed', 'failed')
        AND due_date < NOW()
        AND is_overdue = false
        RETURNING id;
      `;
      const result = await pool.query(query);
      if (result.rowCount && result.rowCount > 0) {
        console.log(`Marked ${result.rowCount} tasks as overdue.`);
      } else {
        console.log('No new overdue tasks found.');
      }
    } catch (error) {
      console.error('Error in overdue task cron job:', error);
    }
  });
  console.log('Task cron job scheduled (runs every hour).');
};
```

Started in `index.ts:85` inside the `httpServer.listen` callback.

**Assessment:**
- **Schedule:** `0 * * * *` — top of every hour.
- **What it does:** flips `is_overdue = true` on `tasks` that are past `due_date` and not yet
  completed/failed.
- **Error handling:** wrapped in try/catch that only `console.error`s. A failure is silent (no
  alerting, no retry, no dead-letter). If the DB is briefly unavailable at the top of the hour,
  that hour's sweep is simply skipped until next hour.
- ❌ **Only touches `tasks`, not `project_tasks`.** `project_tasks.is_overdue` exists
  (`migration.ts:154`) but is never updated by anything → always stays false.
- ❌ **No overdue notification/emit.** Marking overdue does not emit any socket event or create a
  notification, so nobody is told a task went overdue in real time; it only affects analytics on
  next fetch.
- ⚠️ **Multi-instance hazard:** if the backend is ever scaled to >1 instance (or restarts
  overlap), every instance runs its own cron. The `UPDATE … WHERE is_overdue = false` is
  idempotent enough that duplicate runs are harmless here, but there is no locking/leader
  election — a future job with side effects would double-fire.
- ⚠️ **Timezone:** `node-cron` uses server local time by default; on Render this is UTC. "Every
  hour" is fine, but any future date-boundary logic would be UTC-based, not user-local.

There are **no other background jobs, queues, or workers.** The `githubService` in-memory cache
(`githubService.ts:55`, 10-min TTL) is the only other stateful background construct, and it is
per-process (lost on restart, not shared across instances).

---

## 4. Real-time gaps and bugs

1. **`comment:new` has no client handler.** The server emits `comment:new` to both task
   participants (`commentController.ts:59-60`), but there is **no `socket.on('comment:new', …)`**
   in `SocketProvider` or `useNotifications`. The only reason a new comment appears in real time
   is the *separate* `notification:new` event (created for the "other" participant only,
   `commentController.ts:62-71`), which bumps `refreshTrigger`. So: the comment author's own view
   doesn't live-update from the socket, and the `TaskCommentsModal` relies on refetch/refresh.
   The dedicated comment event is effectively dead on the client.

2. **Socket URL misconfiguration in production** (`frontend/src/services/socket.ts:4`) — connects
   to `VITE_API_URL` which includes `/api`. See doc 04 §9. In production this points the socket
   at the wrong path, so **real-time likely does not work on the deployed site**, only in local
   dev with the default fallback.

3. **`admin:<id>` rooms are joined but never used** (`socketService.ts:71`). Dead code.

4. **`join:room` / `ping` client-to-server events are declared but not handled** (§2).

5. **No acknowledgements / delivery guarantees.** Emits are fire-and-forget to a room; if the
   target user is offline, the socket event is lost. The **persisted notification** is the only
   durable record (good), but the toast/`task:assigned`/`invitation:received` real-time cues are
   lost for offline users and are **not replayed** on reconnect (see §5).

---

## 5. Disconnect / reconnect behaviour — is state reconciled or lost?

### Client reconnect config (`frontend/src/services/socket.ts:13-23`)

```ts
socket = io(SOCKET_URL, {
  auth: { token },
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000
});
```

- The client will retry forever with 1–5s backoff. On reconnect it re-runs the handshake auth
  with the **same token that was captured at connect time** — if the access token has since
  expired, the reconnect handshake fails (`socketService.ts:44-57` rejects), and since the token
  string is captured once in `SocketProvider`'s effect, it won't pick up a refreshed token unless
  the component re-runs the effect. Practically: after ~15 min the socket can get stuck failing to
  reconnect until the auth state changes and the effect re-fires.

### Is missed state reconciled?

- **Partially, and only by accident of design.** There is no explicit "on reconnect, replay
  missed events" logic. However:
  - `useNotifications` re-fetches the full notification list whenever `refreshTrigger` changes
    (`useNotifications.ts:43-45`), and dashboards re-fetch tasks on `refreshTrigger`. But
    `refreshTrigger` is only bumped by *incoming live events* — a reconnect itself does **not**
    bump it. Socket.io does not emit a `notification:new` for events that happened while
    disconnected.
  - So events that occurred **during** a disconnect are **lost from the real-time channel** and
    are only recovered on the next natural full-page load / component mount fetch, or the next
    live event that triggers a refresh.
- **Net result:** durable state (notifications, task lists) lives in the DB and is correct on the
  next REST fetch, but there is **no reconnection reconciliation** — the app relies on the user
  navigating/refreshing or a subsequent live event to resync. Toasts for missed events are simply
  never shown.

### Server side on disconnect

- The disconnect handler only logs (`socketService.ts:74-76`). No presence table, no "last seen",
  no queued-event buffer. Nothing to reconcile from the server's side.
